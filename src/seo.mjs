import { profile } from './content.mjs';

export const siteUrl = 'https://shanmukhakrishnachaitanya.github.io/Portfolio/';
// Public ownership token supplied by Google Search Console; keep it across rebuilds.
export const googleSiteVerification = 'M5WOC_8Zdg4E7V9PKAb1myIbdTkiQGeYHysiH55Br38';
export const canonicalUrl = file => new URL(file === 'index.html' ? '' : file, siteUrl).href;

export function identityData({ file, title, description }) {
  const url = canonicalUrl(file);
  const personId = `${siteUrl}#person`;
  const page = {
    '@type': file === 'about.html' ? 'ProfilePage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'en',
    about: { '@id': personId },
    author: { '@id': personId }
  };
  if (file === 'about.html' || file === 'index.html') page.mainEntity = { '@id': personId };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: profile.fullName,
        alternateName: profile.shortName,
        url: canonicalUrl('about.html'),
        jobTitle: profile.role,
        description: profile.summary,
        sameAs: [profile.github, profile.linkedin]
      },
      page
    ]
  };
}

export function sitemapXml(files) {
  const escapeXml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files.map(file => `  <url><loc>${escapeXml(canonicalUrl(file))}</loc></url>`).join('\n')}\n</urlset>\n`;
}
