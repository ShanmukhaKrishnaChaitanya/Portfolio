import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expected = [
  'index.html', 'about.html', 'experience.html', 'projects.html',
  'research.html', 'contact.html', '404.html',
  'projects/smart-grid.html', 'projects/keyword-extraction.html',
  'projects/waste-classification.html', 'projects/epilepsy-diagnosis.html'
];
const failures = [];
const documents = new Map();
const stylesheets = new Set();
let checkedReferences = 0;

const report = (file, message) => failures.push(`${file}: ${message}`);
const decodeEntities = (value) => value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
  const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
  if (entity[1] !== '#') return named[entity.toLowerCase()] || entity;
  const hex = entity[2].toLowerCase() === 'x';
  const point = parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
  return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
});

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4]);
  }
  return result;
}

async function loadDocument(file) {
  if (documents.has(file)) return documents.get(file);
  const text = await readFile(path.join(root, file), 'utf8');
  const markup = text.replace(/<!--[\s\S]*?-->/g, '');
  const tags = [...markup.matchAll(/<[a-z][^>]*>/gi)].map(([tag]) => ({
    tag,
    name: tag.match(/^<([a-z][\w:-]*)/i)[1].toLowerCase(),
    attrs: attributes(tag)
  }));
  const ids = new Set();
  for (const { attrs } of tags) {
    if ('id' in attrs) {
      if (!attrs.id) report(file, 'Empty id attribute.');
      else if (ids.has(attrs.id)) report(file, `Duplicate id "${attrs.id}".`);
      ids.add(attrs.id);
    }
  }
  const document = { markup, tags, ids };
  documents.set(file, document);
  return document;
}

async function checkReference(file, raw, kind) {
  const reference = raw.trim();
  if (!reference || reference === '#') {
    report(file, `Empty or placeholder ${kind}="${raw}".`);
    return;
  }
  if (/^javascript:/i.test(reference)) {
    report(file, `JavaScript placeholder in ${kind}="${raw}".`);
    return;
  }
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) return;

  // Resolve under the deployment prefix as well as locally, so nested pages
  // cannot accidentally point outside the GitHub Pages project directory.
  let url;
  try {
    url = new URL(reference, `https://portfolio.invalid/Portfolio/${file}`);
  } catch {
    report(file, `Invalid ${kind}="${raw}".`);
    return;
  }
  if (!url.pathname.startsWith('/Portfolio/')) {
    report(file, `${kind}="${raw}" leaves the /Portfolio/ deployment path.`);
    return;
  }
  let relative;
  try {
    relative = decodeURIComponent(url.pathname.slice('/Portfolio/'.length));
  } catch {
    report(file, `Invalid URL encoding in ${kind}="${raw}".`);
    return;
  }
  if (!relative || relative.endsWith('/')) relative += 'index.html';
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(root + path.sep)) {
    report(file, `${kind}="${raw}" resolves outside the site.`);
    return;
  }
  try {
    if (!(await stat(absolute)).isFile()) throw new Error('Not a file');
  } catch {
    report(file, `${kind}="${raw}" refers to missing file ${relative}.`);
    return;
  }
  checkedReferences++;
  if (relative.endsWith('.css')) stylesheets.add(relative);
  if (url.hash && relative.endsWith('.html')) {
    try {
      const anchor = decodeURIComponent(url.hash.slice(1));
      const target = await loadDocument(relative);
      if (!target.ids.has(anchor)) report(file, `${kind}="${raw}" refers to missing id "${anchor}" in ${relative}.`);
    } catch (error) {
      report(file, `Cannot inspect anchor in ${kind}="${raw}": ${error.message}`);
    }
  }
}

const files = new Set(expected);
for (const directory of ['', 'projects']) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'previous index.html') files.add(directory ? `${directory}/${entry.name}` : entry.name);
  }
}

for (const file of files) {
  let document;
  try {
    document = await loadDocument(file);
  } catch {
    report(file, 'Generated page missing. Run npm run build first.');
    continue;
  }
  const { markup, tags } = document;
  const h1Count = tags.filter(({ name }) => name === 'h1').length;
  if (h1Count !== 1) report(file, `Expected one H1; found ${h1Count}.`);
  const html = tags.find(({ name }) => name === 'html');
  if (!html?.attrs.lang?.trim()) report(file, 'Missing document language.');
  const title = markup.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (!title?.replace(/<[^>]*>/g, '').trim()) report(file, 'Missing or empty page title.');
  if (!tags.some(({ name, attrs }) => name === 'meta' && attrs.name?.toLowerCase() === 'description' && attrs.content?.trim())) {
    report(file, 'Missing or empty meta description.');
  }
  if (!tags.some(({ name, attrs }) => name === 'main' || attrs.role?.split(/\s+/).includes('main'))) {
    report(file, 'Missing main landmark.');
  }
  for (const { attrs } of tags) {
    for (const key of ['href', 'src', 'poster', 'action']) {
      if (key in attrs) await checkReference(file, attrs[key], key);
    }
    if (attrs.srcset && !attrs.srcset.trim().startsWith('data:')) {
      for (const source of attrs.srcset.split(',')) await checkReference(file, source.trim().split(/\s+/)[0], 'srcset');
    }
  }
}

for (const stylesheet of stylesheets) {
  const css = await readFile(path.join(root, stylesheet), 'utf8');
  for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) {
    if (!match[2].startsWith('#')) await checkReference(stylesheet, match[2], 'url');
  }
}

const resume = 'assets/Shanmukha-Munagala-Resume.pdf';
try {
  const pdf = await readFile(path.join(root, resume));
  if (!pdf.subarray(0, 5).equals(Buffer.from('%PDF-'))) report(resume, 'File does not have a PDF header.');
} catch {
  report(resume, 'Downloadable résumé is missing.');
}

if (failures.length) {
  console.error(`Portfolio check failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Portfolio check passed: ${files.size} pages, ${checkedReferences} local references, metadata, landmarks, unique IDs, anchors, and résumé PDF.`);
}
