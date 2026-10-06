const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('   SCENTAVELLE — COMPREHENSIVE PRODUCTION QA AUDIT  ');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
    console.log('  [PASS]', message);
  } else {
    failCount++;
    console.error('  [FAIL]', message);
  }
}

// -----------------------------------------------------------------------------
// 1. ALL 17 PAGES EXISTENCE & BUILD VERIFICATION
// -----------------------------------------------------------------------------
console.log('--- 1. PAGES EXISTENCE & SOURCE SYNC ---');
const EXPECTED_PAGES = [
  'index.html',
  'shop.html',
  'collections.html',
  'product.html',
  'cart.html',
  'gifts.html',
  'bulk-orders.html',
  'our-story.html',
  'candle-care.html',
  'journal.html',
  'article.html',
  'contact.html',
  'faq.html',
  'privacy-policy.html',
  'terms.html',
  'shipping-policy.html',
  'refund-policy.html'
];

EXPECTED_PAGES.forEach(page => {
  const rootExists = fs.existsSync(path.join(__dirname, page));
  const srcExists = fs.existsSync(path.join(__dirname, '_src', 'pages', page));
  assert(rootExists, `Root page exists: ${page}`);
  assert(srcExists, `Source page exists: _src/pages/${page}`);
});

// -----------------------------------------------------------------------------
// 2. SEO & METADATA AUDIT (TITLES, DESCRIPTIONS, H1s, CANONICALS, OPEN GRAPH)
// -----------------------------------------------------------------------------
console.log('\n--- 2. SEO & METADATA AUDIT ---');
const titles = new Set();
const descriptions = new Set();

EXPECTED_PAGES.forEach(page => {
  const content = fs.readFileSync(path.join(__dirname, page), 'utf8');

  // Title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  assert(titleMatch && titleMatch[1].length > 0, `${page} has a non-empty <title>`);
  if (titleMatch) {
    const title = titleMatch[1];
    assert(!titles.has(title), `${page} title is unique: "${title.slice(0, 40)}..."`);
    titles.add(title);
    assert(title.includes('Scentavelle'), `${page} title contains brand name "Scentavelle"`);
  }

  // Meta Description
  const descMatch = content.match(/<meta name="description" content="([^"]+)">/);
  assert(descMatch && descMatch[1].length > 0, `${page} has a meta description`);
  if (descMatch) {
    const desc = descMatch[1];
    assert(!descriptions.has(desc), `${page} description is unique`);
    descriptions.add(desc);
  }

  // Single H1 per page
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/g);
  assert(h1Matches && h1Matches.length === 1, `${page} has exactly one <h1> tag`);

  // Canonical URL
  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)">/);
  assert(canonicalMatch && canonicalMatch[1].startsWith('https://www.scentavelle.in'), `${page} has valid canonical link`);

  // Open Graph
  assert(content.includes('<meta property="og:title"'), `${page} has og:title`);
  assert(content.includes('<meta property="og:image"'), `${page} has og:image`);
  assert(content.includes('<meta property="og:description"'), `${page} has og:description`);

  // Stylesheets inclusion
  assert(content.includes('<link rel="stylesheet" href="css/style.css">'), `${page} includes css/style.css`);
  assert(content.includes('<link rel="stylesheet" href="css/animations.css">'), `${page} includes css/animations.css`);
  assert(content.includes('<link rel="stylesheet" href="css/responsive.css">'), `${page} includes css/responsive.css`);

  // Defer Scripts
  assert(content.includes('<script src="js/main.js" defer></script>'), `${page} includes main.js`);
  assert(content.includes('<script src="js/whatsapp.js" defer></script>'), `${page} includes whatsapp.js`);
  assert(content.includes('<script src="js/cart.js" defer></script>'), `${page} includes cart.js`);
});

// -----------------------------------------------------------------------------
// 3. INTERNAL LINK INTEGRITY & ASSET REFERENCES
// -----------------------------------------------------------------------------
console.log('\n--- 3. INTERNAL LINK INTEGRITY & ASSET REFERENCES ---');
const linkRegex = /href="([^"#?]+)(?:[#?][^"]*)?"/g;
const imageRegex = /src="([^"?]+)(?:[?][^"]*)?"/g;

EXPECTED_PAGES.forEach(page => {
  const content = fs.readFileSync(path.join(__dirname, page), 'utf8');

  // Check internal links
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('data:')) {
      continue;
    }
    const targetFile = path.join(__dirname, href);
    assert(fs.existsSync(targetFile), `${page} -> valid internal link: "${href}"`);
  }

  // Check images
  while ((match = imageRegex.exec(content)) !== null) {
    const src = match[1];
    if (src.startsWith('http') || src.startsWith('data:')) continue;
    const targetImg = path.join(__dirname, src);
    assert(fs.existsSync(targetImg), `${page} -> valid image asset: "${src}"`);
  }
});

// -----------------------------------------------------------------------------
// 4. JAVASCRIPT ARCHITECTURE & MODULE EXECUTION
// -----------------------------------------------------------------------------
console.log('\n--- 4. JAVASCRIPT MODULE EXECUTION TESTS ---');

const sandbox = {
  window: {
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { href: 'http://localhost:8080/' },
    matchMedia: () => ({ matches: false })
  },
  document: {
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    dispatchEvent: () => {},
    readyState: 'complete'
  },
  CustomEvent: function (event, params) { this.event = event; this.detail = params ? params.detail : null; },
  localStorage: {
    _data: {},
    getItem: function (k) { return this._data[k] || null; },
    setItem: function (k, v) { this._data[k] = String(v); },
    removeItem: function (k) { delete this._data[k]; }
  },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;
sandbox.window.localStorage = sandbox.localStorage;
sandbox.window.CustomEvent = sandbox.CustomEvent;
vm.createContext(sandbox);

// 1. products.js
const productsJs = fs.readFileSync(path.join(__dirname, 'js', 'products.js'), 'utf8');
vm.runInContext(productsJs, sandbox);
const S = sandbox.window.Scentavelle;
assert(S && Array.isArray(S.products), 'products.js initializes Scentavelle.products');
assert(S.products.length === 19, `All 19 products defined (Found: ${S.products.length})`);
assert(S.collections.length === 6, `All 6 collections defined (Found: ${S.collections.length})`);

// Test product getter & formatter
const lavender = S.getProduct('lavender-veil');
assert(lavender && lavender.name === 'Lavender Veil', 'S.getProduct finds Lavender Veil');
assert(S.formatPrice(lavender.price) === '₹499', 'S.formatPrice outputs ₹499');
assert(lavender.rating === 4.8 && lavender.reviews === 124, 'Lavender Veil has ratings (4.8) and reviews (124)');

// 2. cart.js
const cartJs = fs.readFileSync(path.join(__dirname, 'js', 'cart.js'), 'utf8');
vm.runInContext(cartJs, sandbox);
const Cart = S.cart;
assert(Cart && typeof Cart.add === 'function', 'cart.js initializes Cart system');

// Test Cart operations
Cart.clear();
assert(Cart.count() === 0, 'Cart starts empty');
Cart.add('lavender-veil', 2);
assert(Cart.count() === 2, 'Added 2x Lavender Veil (count === 2)');
assert(Cart.subtotal() === 499 * 2, `Cart subtotal calculates ₹${499 * 2}`);

Cart.add('vanilla-dusk', 1);
assert(Cart.count() === 3, 'Added 1x Vanilla Dusk (count === 3)');
assert(Cart.summary().freeShipping === true, 'Subtotal > ₹999 unlocks freeShipping');

Cart.increase('vanilla-dusk');
assert(Cart.count() === 4, 'Increased Vanilla Dusk quantity to 2');

Cart.decrease('vanilla-dusk');
assert(Cart.count() === 3, 'Decreased Vanilla Dusk quantity back to 1');

Cart.remove('lavender-veil');
assert(Cart.count() === 1, 'Removed Lavender Veil, only 1 item remaining');

// Test persistence
const stored = JSON.parse(sandbox.localStorage.getItem('scentavelle_cart_v1'));
assert(stored && stored.length === 1 && stored[0].id === S.getProduct('vanilla-dusk').id, 'Cart state properly persisted to localStorage');

// 3. whatsapp.js
const waJs = fs.readFileSync(path.join(__dirname, 'js', 'whatsapp.js'), 'utf8');
vm.runInContext(waJs, sandbox);
assert(S.wa && S.wa.link && S.wa.messages, 'whatsapp.js initializes S.wa and message builders');

// Test quick order URL
const quickLink = S.wa.link(S.wa.messages.quickOrder(lavender, 2));
assert(quickLink.startsWith('https://wa.me/917569403967?text='), 'Quick Order link targets +91 75694 03967');
const decodedQuick = decodeURIComponent(quickLink);
assert(decodedQuick.includes('Hello Mahesh') && decodedQuick.includes('Lavender Veil') && decodedQuick.includes('Quantity: 2'), 'Quick Order message correctly formatted for Mahesh');

// Test cart order message
const cartMsg = S.wa.messages.cartOrder(Cart.items(), { name: 'Aarav Mehta', phone: '9876543210', city: 'Mumbai', pincode: '400001' });
assert(cartMsg.includes('Hello Mahesh') && cartMsg.includes('Vanilla Dusk') && cartMsg.includes('Aarav Mehta') && cartMsg.includes('400001'), 'Cart order message contains customer info and line items');

// Test bulk quote message
const bulkMsg = S.wa.messages.bulk({ name: 'Rohit Verma', company: 'Acme Corp', phone: '9811122233', orderType: 'Corporate Gifting', quantity: '150', budget: '₹50,000 – ₹1,00,000' });
assert(bulkMsg.includes('Corporate Gifting') && bulkMsg.includes('Quantity: 150') && bulkMsg.includes('Acme Corp'), 'Bulk quote message properly structured');

// 4. journal.js
const journalJs = fs.readFileSync(path.join(__dirname, 'js', 'journal.js'), 'utf8');
vm.runInContext(journalJs, sandbox);
assert(Array.isArray(S.articles) && S.articles.length === 8, `journal.js defines 8 articles (Found: ${S.articles.length})`);
const article1 = S.articles[0];
assert(article1.slug && article1.title && article1.cat && article1.read && article1.body.length > 0, 'Articles contain full editorial content');

// 5. scent-finder.js
const quizJs = fs.readFileSync(path.join(__dirname, 'js', 'scent-finder.js'), 'utf8');
vm.runInContext(quizJs, sandbox);
assert(typeof S.findScent === 'function', 'scent-finder.js defines S.findScent recommendation algorithm');

const matchRelax = S.findScent({ mood: 'relaxation', family: 'floral' });
assert(matchRelax && matchRelax.slug === 'lavender-veil', 'Scent finder maps Relaxing + Floral to Lavender Veil');

const matchRomantic = S.findScent({ mood: 'romance', family: 'woody' });
assert(matchRomantic && matchRomantic.slug === 'velvet-oud', 'Scent finder maps Romance + Woody to Velvet Oud');

const matchWarm = S.findScent({ mood: 'warmth', family: 'sweet' });
assert(matchWarm && matchWarm.slug === 'vanilla-dusk', 'Scent finder maps Warmth + Sweet to Vanilla Dusk');

// 6. filters.js
const filtersJs = fs.readFileSync(path.join(__dirname, 'js', 'filters.js'), 'utf8');
vm.runInContext(filtersJs, sandbox);
assert(typeof S.filterProducts === 'function' && typeof S.sortProducts === 'function', 'filters.js defines filter and sort functions');

const bestSellers = S.filterProducts(S.products, { filter: 'bestsellers' });
assert(bestSellers.length >= 4, `Bestseller filter returns active products (Found: ${bestSellers.length})`);

const searchHits = S.searchProducts('vanilla');
assert(searchHits.some(p => p.slug === 'vanilla-dusk'), 'Search for "vanilla" finds Vanilla Dusk');

// -----------------------------------------------------------------------------
// 5. SITEMAP & ROBOTS.TXT VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- 5. SITEMAP & ROBOTS.TXT VERIFICATION ---');
const sitemapContent = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
assert(sitemapContent.includes('https://www.scentavelle.in/'), 'Sitemap includes homepage');
assert(sitemapContent.includes('https://www.scentavelle.in/shop.html'), 'Sitemap includes shop.html');
assert(sitemapContent.includes('https://www.scentavelle.in/candle-care.html'), 'Sitemap includes candle-care.html');
assert(sitemapContent.includes('https://www.scentavelle.in/journal.html'), 'Sitemap includes journal.html');
assert(sitemapContent.includes('https://www.scentavelle.in/contact.html'), 'Sitemap includes contact.html');
assert(sitemapContent.includes('https://www.scentavelle.in/faq.html'), 'Sitemap includes faq.html');
assert(!sitemapContent.includes('cart.html'), 'Cart page correctly omitted from sitemap (noindex)');

const robotsContent = fs.readFileSync(path.join(__dirname, 'robots.txt'), 'utf8');
assert(robotsContent.includes('User-agent: *'), 'robots.txt allows all user agents');
assert(robotsContent.includes('Sitemap: https://www.scentavelle.in/sitemap.xml'), 'robots.txt declares sitemap location');

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n====================================================');
console.log(`AUDIT RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
}
