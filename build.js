/**
 * SCENTAVELLE — tiny static page builder (optional, no dependencies)
 * ---------------------------------------------------------------
 * The website in this folder is plain HTML/CSS/JS and works as-is.
 * Because every page shares the same header, footer and <head> tags,
 * those parts live once in /_src/partials and each page's unique content
 * lives in /_src/pages. Running
 *
 *     node build.js
 *
 * stitches them together and writes the finished .html files to the
 * project root. You only need to run it if you edit something in /_src.
 *
 * BEFORE LAUNCH: change SITE.url below to your real domain (used for
 * canonical links, social cards, sitemap.xml and structured data).
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, '_src');

const SITE = {
  name: 'Scentavelle',
  tagline: 'Scents for a softer life.',
  url: 'https://www.scentavelle.in', // <-- CHANGE to your live domain
  whatsapp: '917569403967',
  phoneDisplay: '+91 75694 03967',
  phoneE164: '+917569403967',
  defaultImage: 'assets/images/hero_1.jpg',
};

const NAV = [
  ['Home', 'index.html', 'home'],
  ['Shop', 'shop.html', 'shop'],
  ['Collections', 'collections.html', 'collections'],
  ['Gifting', 'gifts.html', 'gifts'],
  ['Bulk Orders', 'bulk-orders.html', 'bulk'],
  ['Our Story', 'our-story.html', 'story'],
  ['Journal', 'journal.html', 'journal'],
  ['Contact', 'contact.html', 'contact'],
];

const read = (p) => fs.readFileSync(p, 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function parsePage(file) {
  const raw = read(file).replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('Missing front matter in ' + file);
  const meta = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return { meta, body: m[2] };
}

function navHtml(active, mobile) {
  return NAV.map(([label, href, key]) => {
    const cur = key === active ? ' aria-current="page"' : '';
    return `<li><a href="${href}"${cur}>${label}</a></li>`;
  }).join('\n          ');
}

function faqSchema(body) {
  const re = /<summary[^>]*>([\s\S]*?)<\/summary>\s*<div class="faq-a">([\s\S]*?)<\/div>/g;
  const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const items = [];
  let m;
  while ((m = re.exec(body))) {
    items.push({
      '@type': 'Question',
      name: strip(m[1]),
      acceptedAnswer: { '@type': 'Answer', text: strip(m[2]) },
    });
  }
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items };
}

function build() {
  const partial = (n) => read(path.join(SRC, 'partials', n));
  const icons = partial('icons.html');
  const headerT = partial('header.html');
  const footerT = partial('footer.html');
  const overlays = partial('overlays.html');
  const pagesDir = path.join(SRC, 'pages');
  const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html'));
  const sitemap = [];

  files.forEach((f) => {
    const { meta, body } = parsePage(path.join(pagesDir, f));
    const url = `${SITE.url}/${f === 'index.html' ? '' : f}`;
    const image = `${SITE.url}/${meta.image || SITE.defaultImage}`;
    const title = meta.title;
    const desc = meta.description;
    const active = meta.nav || '';

    const org = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE.name,
      slogan: SITE.tagline,
      url: SITE.url + '/',
      logo: SITE.url + '/assets/icons/favicon.svg',
      contactPoint: [{
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: SITE.phoneE164,
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      }],
    };
    const schemas = [org];
    if (f === 'index.html') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE.name,
        url: SITE.url + '/',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE.url}/shop.html?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      });
    } else if (meta.crumb) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
          { '@type': 'ListItem', position: 2, name: meta.crumb, item: url },
        ],
      });
    }
    if (meta.faqSchema) schemas.push(faqSchema(body));

    const head = `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
${meta.noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}<meta name="theme-color" content="#2a211a">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${image}">
<link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/animations.css">
<link rel="stylesheet" href="css/responsive.css">
<script>document.documentElement.classList.add('js');</script>
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
</head>`;

    const header = headerT.replace('{{NAV}}', navHtml(active)).replace('{{NAV_MOBILE}}', navHtml(active));
    const footer = footerT.replace('{{YEAR}}', '2026');

    const html = `${head}
<body class="${meta.body || ''}">
<a class="skip-link" href="#main">Skip to content</a>
${icons}
${header}
<main id="main" tabindex="-1">
${body.trim()}
</main>
${footer}
${overlays}
<script src="js/products.js" defer></script>
<script src="js/cart.js" defer></script>
<script src="js/whatsapp.js" defer></script>
<script src="js/product-ui.js" defer></script>
<script src="js/journal.js" defer></script>
<script src="js/scent-finder.js" defer></script>
<script src="js/filters.js" defer></script>
<script src="js/main.js" defer></script>
</body>
</html>
`;
    fs.writeFileSync(path.join(ROOT, f), html);
    if (!meta.noindex) sitemap.push(url);
    console.log('built', f);
  });

  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(
    path.join(ROOT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      sitemap.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
      `\n</urlset>\n`
  );
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
}

build();
