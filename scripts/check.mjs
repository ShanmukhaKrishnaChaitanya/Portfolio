import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { profile } from '../src/content.mjs';

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
const resumeRequestPages = new Set(['index.html', 'about.html', 'contact.html']);
let checkedReferences = 0;
let checkedResumeRequests = 0;

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
  const externalReference = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference);
  const knownResumePdf = /(?:Shanmukha-Munagala-Resume|Resume__ShanmukhaKrishnaChaitanyaMunagala)\.pdf/i.test(reference);
  if ((!externalReference && /\.pdf(?:[?#]|$)/i.test(reference)) || knownResumePdf || /^data:application\/pdf[;,]/i.test(reference)) {
    report(file, `Local or résumé PDF ${kind}="${raw}" is public; use the résumé request email flow instead.`);
    return;
  }
  if (externalReference) return;

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
  const resumeLinks = tags.filter(({ name, attrs }) => name === 'a' && attrs['data-resume-request'] === 'true');
  if (resumeRequestPages.has(file) && resumeLinks.length !== 1) report(file, 'Expected exactly one résumé request email link.');
  for (const { tag, attrs } of resumeLinks) {
    try {
      const request = new URL(attrs.href);
      if (request.protocol !== 'mailto:' || decodeURIComponent(request.pathname) !== profile.email) {
        report(file, 'Résumé requests must open an email to the profile address.');
      }
      if (!request.searchParams.get('subject')?.trim() || !request.searchParams.get('body')?.trim()) {
        report(file, 'Résumé request email must include a subject and message.');
      }
      if (/\sdownload(?:\s|=|>)/i.test(tag)) report(file, 'Résumé request links must not have a download attribute.');
      checkedResumeRequests++;
    } catch {
      report(file, 'Invalid résumé request email link.');
    }
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

// GitHub Pages serves repository files even when no page links to them.
// Keep local copies only in the ignored tmp/ directory, outside the site output.
async function checkPublicPdfs(directory = '') {
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    if (['.git', 'tmp', 'node_modules'].includes(entry.name)) continue;
    const relative = directory ? `${directory}/${entry.name}` : entry.name;
    if (entry.isDirectory()) await checkPublicPdfs(relative);
    else if (entry.isFile() && /\.pdf$/i.test(entry.name)) {
      report(relative, 'PDF would be publicly hosted; keep the résumé in ignored tmp/ and use email requests.');
    }
  }
}
await checkPublicPdfs();

if (failures.length) {
  console.error(`Portfolio check failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Portfolio check passed: ${files.size} pages, ${checkedReferences} local references, metadata, landmarks, unique IDs, anchors, ${checkedResumeRequests} résumé request email links, and no public PDFs.`);
}
