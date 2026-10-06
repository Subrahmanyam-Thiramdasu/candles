/* ==========================================================================
   SCENTAVELLE — product data + shared helpers
   Single source of truth for every product on the site.
   To add a product: copy one entry in PRODUCTS, give it a new id/slug.
   Images live in /assets/images (replace the files to update photography).
   ========================================================================== */
(function () {
  'use strict';

  var S = (window.Scentavelle = window.Scentavelle || {});

  S.config = {
    brand: 'Scentavelle',
    owner: 'Mahesh',
    whatsapp: '917569403967', // used ONLY for wa.me links
    phoneDisplay: '+91 75694 03967',
    freeShippingAbove: 999,
    // Optional: paste a Formspree / Mailchimp / Google Apps Script URL to receive newsletter emails.
    newsletterEndpoint: ''
  };

  var IMG = 'assets/images/';

  /* Defaults shared by most candles */
  var DEFAULTS = {
    oldPrice: null,
    category: 'Candle',
    weight: '180g',
    burnTime: '35–45 hours',
    wax: 'Premium Soy Wax Blend',
    wick: 'Cotton Wick',
    fragrance: 'Premium Fragrance Oil',
    strength: 'Medium–Strong',
    badge: '',
    featured: false,
    newArrival: false,
    bestseller: false,
    popularity: 50,
    added: '2026-01-01',
    imagePos: ['50% 50%', '50% 50%']
  };

  function P(o) {
    var p = {};
    Object.keys(DEFAULTS).forEach(function (k) { p[k] = DEFAULTS[k]; });
    Object.keys(o).forEach(function (k) { p[k] = o[k]; });
    return p;
  }

  var PRODUCTS = [
    /* ---------- The six most-loved ---------- */
    P({
      id: 'SV-001', name: 'Lavender Veil', slug: 'lavender-veil', price: 499,
      collection: 'calm', family: 'Floral',
      notes: ['Lavender', 'Vanilla', 'Soft Musk'],
      pyramid: { top: ['Lavender', 'Bergamot'], heart: ['Soft Musk', 'Lavender Bud'], base: ['Vanilla', 'White Musk'] },
      mood: ['Calm', 'Relaxing'], tags: ['floral', 'relaxing', 'calm'],
      finder: { mood: ['relaxation'], family: ['floral', 'sweet'] },
      shortDesc: 'Soft lavender wrapped in creamy vanilla and musk.',
      finderLine: 'Soft, calming and perfect for slow evenings.',
      description: 'A quiet, soft-focus lavender — lifted with a touch of bergamot and settled into warm vanilla and musk. Made for the hour when the day finally slows down.',
      rating: 4.8, reviews: 124, images: [IMG + 'mood_calm.jpg', IMG + 'studio_cream.jpg'],
      badge: 'Bestseller', featured: true, bestseller: true, popularity: 96, added: '2026-01-10'
    }),
    P({
      id: 'SV-002', name: 'Velvet Oud', slug: 'velvet-oud', price: 699,
      collection: 'romance', family: 'Woody',
      notes: ['Oud', 'Amber', 'Sandalwood'],
      pyramid: { top: ['Saffron', 'Cardamom'], heart: ['Oud', 'Rose Petal'], base: ['Amber', 'Sandalwood', 'Vanilla'] },
      mood: ['Warm', 'Luxurious'], tags: ['woody', 'romantic', 'luxury'],
      finder: { mood: ['luxury', 'romance'], family: ['woody', 'earthy'] },
      shortDesc: 'Deep oud and amber softened by sandalwood.',
      finderLine: 'Rich, warm and quietly luxurious — made for evenings that linger.',
      description: 'Dark, smooth and a little mysterious. Oud and amber glow against creamy sandalwood for a fragrance that makes any room feel like a private lounge.',
      rating: 4.9, reviews: 98, images: [IMG + 'product_oud.jpg', IMG + 'studio_smoke.jpg'],
      badge: 'Bestseller', featured: true, bestseller: true, popularity: 92, added: '2026-01-14', weight: '200g', burnTime: '40–50 hours'
    }),
    P({
      id: 'SV-003', name: 'Rose Ember', slug: 'rose-ember', price: 549,
      collection: 'romance', family: 'Floral',
      notes: ['Rose', 'Amber', 'Vanilla'],
      pyramid: { top: ['Pink Pepper', 'Rose Petal'], heart: ['Damask Rose', 'Peony'], base: ['Amber', 'Vanilla'] },
      mood: ['Romantic', 'Elegant'], tags: ['floral', 'romantic'],
      finder: { mood: ['romance'], family: ['floral', 'sweet'] },
      shortDesc: 'Velvety rose warmed by amber and vanilla.',
      finderLine: 'Romantic, rosy and glowing — made for candlelit dinners.',
      description: 'Rose the way it smells after dusk — petal-soft, with a warm amber glow underneath. Elegant without being old-fashioned.',
      rating: 4.7, reviews: 76, images: [IMG + 'mood_romance.jpg', IMG + 'studio_smoke.jpg'],
      badge: 'Bestseller', featured: true, bestseller: true, popularity: 90, added: '2026-01-20'
    }),
    P({
      id: 'SV-004', name: 'Citrus Bloom', slug: 'citrus-bloom', price: 499,
      collection: 'fresh', family: 'Citrus',
      notes: ['Bergamot', 'Orange Blossom', 'Lemon'],
      pyramid: { top: ['Bergamot', 'Lemon Zest'], heart: ['Orange Blossom', 'Neroli'], base: ['White Cedar', 'Light Musk'] },
      mood: ['Fresh', 'Energizing'], tags: ['citrus', 'fresh'],
      finder: { mood: ['freshness', 'focus'], family: ['citrus', 'fresh', 'floral'] },
      shortDesc: 'Sun-bright bergamot and orange blossom.',
      finderLine: 'Bright, clean and energising — a window thrown open.',
      description: 'A bright burst of bergamot and lemon, softened with orange blossom. It smells like morning light and freshly squeezed possibility.',
      rating: 4.6, reviews: 64, images: [IMG + 'mood_fresh.jpg', IMG + 'studio_cream.jpg'],
      badge: 'New', featured: true, newArrival: true, popularity: 78, added: '2026-09-02'
    }),
    P({
      id: 'SV-005', name: 'Vanilla Dusk', slug: 'vanilla-dusk', price: 599,
      collection: 'cozy', family: 'Gourmand',
      notes: ['Vanilla', 'Tonka', 'Cedarwood'],
      pyramid: { top: ['Warm Spice', 'Bergamot'], heart: ['Tonka Bean', 'Cinnamon Bark'], base: ['Vanilla', 'Cedarwood', 'Amber'] },
      mood: ['Cozy', 'Comforting'], tags: ['gourmand', 'cozy', 'relaxing'],
      finder: { mood: ['warmth'], family: ['sweet', 'woody'] },
      shortDesc: 'Golden vanilla, tonka and soft cedarwood.',
      finderLine: 'Cosy, comforting and golden — like a blanket you can smell.',
      description: 'Warm vanilla and tonka bean resting on a base of dry cedarwood. Familiar, comforting and never too sweet — the scent of an unhurried evening in.',
      rating: 4.9, reviews: 112, images: [IMG + 'mood_cozy.jpg', IMG + 'studio_amber.jpg'],
      badge: 'Bestseller', featured: true, bestseller: true, popularity: 94, added: '2026-02-03'
    }),
    P({
      id: 'SV-006', name: 'Forest Mist', slug: 'forest-mist', price: 649,
      collection: 'fresh', family: 'Fresh',
      notes: ['Eucalyptus', 'Pine', 'Cedar'],
      pyramid: { top: ['Eucalyptus', 'Juniper'], heart: ['Pine Needle', 'Green Leaves'], base: ['Cedar', 'Oakmoss'] },
      mood: ['Fresh', 'Grounding'], tags: ['fresh', 'woody'],
      finder: { mood: ['freshness', 'focus'], family: ['fresh', 'earthy', 'woody'] },
      shortDesc: 'Eucalyptus and pine on a bed of cedar.',
      finderLine: 'Crisp, green and grounding — a walk in the hills.',
      description: 'Cool eucalyptus and pine needles drifting over cedar and moss. A clear-headed, green fragrance for work-from-home mornings and open windows.',
      rating: 4.7, reviews: 58, images: [IMG + 'product_forest.jpg', IMG + 'studio_smoke.jpg'],
      badge: 'New', featured: true, newArrival: true, popularity: 80, added: '2026-09-10'
    }),

    /* ---------- Calm collection ---------- */
    P({
      id: 'SV-007', name: 'White Tea Serenity', slug: 'white-tea-serenity', price: 549,
      collection: 'calm', family: 'Fresh',
      notes: ['White Tea', 'Pear', 'Soft Musk'],
      pyramid: { top: ['Pear', 'Green Tea Leaf'], heart: ['White Tea', 'Jasmine Tea'], base: ['Soft Musk', 'Blonde Woods'] },
      mood: ['Calm', 'Clean'], tags: ['fresh', 'relaxing', 'calm'],
      finder: { mood: ['relaxation', 'focus'], family: ['fresh', 'floral'] },
      shortDesc: 'Delicate white tea with a whisper of pear.',
      finderLine: 'Light, clean and clear — a deep breath in a jar.',
      description: 'Airy white tea and crisp pear over a clean musk. A soft, spa-like scent that keeps a room feeling open and light.',
      rating: 4.6, reviews: 41, images: [IMG + 'studio_cream.jpg'], popularity: 70, added: '2026-03-05', imagePos: ['30% 50%']
    }),
    P({
      id: 'SV-008', name: 'Sandalwood Calm', slug: 'sandalwood-calm', price: 599,
      collection: 'calm', family: 'Woody',
      notes: ['Sandalwood', 'Cashmere', 'Fig'],
      pyramid: { top: ['Fig Leaf', 'Cardamom'], heart: ['Cashmere Woods', 'Iris'], base: ['Sandalwood', 'Soft Musk'] },
      mood: ['Calm', 'Grounding'], tags: ['woody', 'relaxing', 'calm'],
      finder: { mood: ['relaxation', 'focus'], family: ['woody', 'earthy'] },
      shortDesc: 'Creamy sandalwood with a soft fig note.',
      finderLine: 'Smooth, grounded and still — made for meditation corners and bedside tables.',
      description: 'Creamy sandalwood, cashmere woods and a green hint of fig. Grounding and gentle, it suits quiet corners and slow starts.',
      rating: 4.7, reviews: 52, images: [IMG + 'studio_smoke.jpg'], popularity: 72, added: '2026-03-12', imagePos: ['60% 50%']
    }),

    /* ---------- Romance collection ---------- */
    P({
      id: 'SV-009', name: 'Midnight Rose', slug: 'midnight-rose', price: 649,
      collection: 'romance', family: 'Floral',
      notes: ['Black Rose', 'Patchouli', 'Plum'],
      pyramid: { top: ['Plum', 'Black Pepper'], heart: ['Black Rose', 'Violet'], base: ['Patchouli', 'Dark Amber'] },
      mood: ['Romantic', 'Mysterious'], tags: ['floral', 'romantic', 'luxury'],
      finder: { mood: ['romance', 'luxury'], family: ['floral', 'woody'] },
      shortDesc: 'Dark rose, plum and a little patchouli.',
      finderLine: 'Dark, velvety and a little mysterious.',
      description: 'A moodier rose — deep plum and black pepper over dark petals and patchouli. For late evenings and slow conversations.',
      rating: 4.8, reviews: 47, images: [IMG + 'studio_smoke.jpg'], popularity: 74, added: '2026-04-02', imagePos: ['40% 50%']
    }),

    /* ---------- Cozy collection ---------- */
    P({
      id: 'SV-010', name: 'Warm Cinnamon', slug: 'warm-cinnamon', price: 499,
      collection: 'cozy', family: 'Gourmand',
      notes: ['Cinnamon', 'Clove', 'Orange Peel'],
      pyramid: { top: ['Orange Peel', 'Clove'], heart: ['Cinnamon Bark', 'Nutmeg'], base: ['Vanilla', 'Cedar'] },
      mood: ['Cozy', 'Festive'], tags: ['gourmand', 'cozy'],
      finder: { mood: ['warmth'], family: ['sweet', 'earthy'] },
      shortDesc: 'Cinnamon bark, clove and orange peel.',
      finderLine: 'Spiced, snug and festive.',
      description: 'Sweet cinnamon bark and clove brightened with orange peel. Smells like festive kitchens and long chats over chai.',
      rating: 4.6, reviews: 39, images: [IMG + 'studio_amber.jpg'], badge: 'New', newArrival: true, popularity: 68, added: '2026-09-18', imagePos: ['50% 50%']
    }),
    P({
      id: 'SV-011', name: 'Amber Chai', slug: 'amber-chai', price: 549,
      collection: 'cozy', family: 'Gourmand',
      notes: ['Cardamom', 'Black Tea', 'Amber'],
      pyramid: { top: ['Cardamom', 'Ginger'], heart: ['Black Tea', 'Cinnamon'], base: ['Amber', 'Warm Milk', 'Vanilla'] },
      mood: ['Cozy', 'Comforting'], tags: ['gourmand', 'cozy'],
      finder: { mood: ['warmth', 'luxury'], family: ['sweet', 'earthy'] },
      shortDesc: 'Cardamom-spiced tea over glowing amber.',
      finderLine: 'Spiced, creamy and wonderfully familiar.',
      description: 'Cardamom, ginger and black tea poured over warm amber and milky vanilla. A little nostalgia for a monsoon evening.',
      rating: 4.8, reviews: 43, images: [IMG + 'studio_amber.jpg'], badge: 'New', newArrival: true, popularity: 71, added: '2026-09-22', imagePos: ['65% 50%']
    }),

    /* ---------- Fresh collection ---------- */
    P({
      id: 'SV-012', name: 'Eucalyptus Rain', slug: 'eucalyptus-rain', price: 549,
      collection: 'fresh', family: 'Fresh',
      notes: ['Eucalyptus', 'Rain Accord', 'Mint Leaf'],
      pyramid: { top: ['Mint Leaf', 'Eucalyptus'], heart: ['Rain Accord', 'Green Tea'], base: ['Clean Musk', 'Driftwood'] },
      mood: ['Fresh', 'Clean'], tags: ['fresh', 'relaxing'],
      finder: { mood: ['freshness', 'focus'], family: ['fresh', 'earthy'] },
      shortDesc: 'Eucalyptus, mint leaf and a fresh rain accord.',
      finderLine: 'Cool, clean and wonderfully clear.',
      description: 'Cool eucalyptus and mint over a clean, rain-washed musk. Brings the feeling of the first monsoon breeze indoors.',
      rating: 4.7, reviews: 36, images: [IMG + 'studio_smoke.jpg'], badge: 'New', newArrival: true, popularity: 66, added: '2026-09-25', imagePos: ['70% 50%']
    }),

    /* ---------- Gourmand collection ---------- */
    P({
      id: 'SV-013', name: 'Vanilla Bean', slug: 'vanilla-bean', price: 599,
      collection: 'gourmand', family: 'Gourmand',
      notes: ['Vanilla Bean', 'Cream', 'Sugar Musk'],
      pyramid: { top: ['Almond Milk', 'Bergamot'], heart: ['Vanilla Bean', 'Cream'], base: ['Sugar Musk', 'Sandalwood'] },
      mood: ['Cozy', 'Sweet'], tags: ['gourmand'],
      finder: { mood: ['warmth'], family: ['sweet'] },
      shortDesc: 'Creamy vanilla bean with sugared musk.',
      finderLine: 'Pure, creamy vanilla — simple and endlessly comforting.',
      description: 'Pure vanilla bean, cream and a dusting of sugared musk. The kind of simple comfort that never goes out of style.',
      rating: 4.8, reviews: 55, images: [IMG + 'studio_cream.jpg'], popularity: 73, added: '2026-05-10', imagePos: ['70% 50%']
    }),
    P({
      id: 'SV-014', name: 'Coffee & Cream', slug: 'coffee-and-cream', price: 599,
      collection: 'gourmand', family: 'Gourmand',
      notes: ['Roasted Coffee', 'Cream', 'Hazelnut'],
      pyramid: { top: ['Espresso', 'Hazelnut'], heart: ['Roasted Coffee', 'Cream'], base: ['Vanilla', 'Cocoa'] },
      mood: ['Cozy', 'Energizing'], tags: ['gourmand', 'cozy'],
      finder: { mood: ['focus', 'warmth'], family: ['sweet', 'earthy'] },
      shortDesc: 'Roasted coffee softened with cream and hazelnut.',
      finderLine: 'Rich, roasted and cosy — your favourite café, at home.',
      description: 'Freshly roasted coffee with a swirl of cream and a little hazelnut. Smells like the best corner table of your favourite café.',
      rating: 4.7, reviews: 44, images: [IMG + 'studio_amber.jpg'], popularity: 69, added: '2026-05-18', imagePos: ['35% 50%']
    }),
    P({
      id: 'SV-015', name: 'Caramel Woods', slug: 'caramel-woods', price: 649,
      collection: 'gourmand', family: 'Gourmand',
      notes: ['Caramel', 'Cedarwood', 'Tonka'],
      pyramid: { top: ['Salted Caramel', 'Pear'], heart: ['Tonka Bean', 'Praline'], base: ['Cedarwood', 'Amber'] },
      mood: ['Warm', 'Indulgent'], tags: ['gourmand', 'woody'],
      finder: { mood: ['warmth', 'luxury'], family: ['sweet', 'woody'] },
      shortDesc: 'Burnt caramel and tonka over warm cedarwood.',
      finderLine: 'Sweet, smoky and indulgent, grounded by warm woods.',
      description: 'Slow-cooked caramel and tonka bean grounded by dry cedarwood. Indulgent, but with enough woodiness to keep it grown-up.',
      rating: 4.7, reviews: 33, images: [IMG + 'studio_amber.jpg'], badge: 'New', newArrival: true, popularity: 65, added: '2026-09-28', imagePos: ['80% 50%']
    }),

    /* ---------- Gift sets ---------- */
    P({
      id: 'SV-101', name: 'The Calm Set', slug: 'the-calm-set', price: 1199, category: 'Gift Set',
      collection: 'gifts', family: 'Floral',
      notes: ['Lavender Veil', 'White Tea Serenity', 'Matchbox'],
      includes: ['Lavender Veil — 180g candle', 'White Tea Serenity — 180g candle', 'Wick trimmer', 'Matchbox & gift box', 'Handwritten-style note card'],
      pyramid: null,
      mood: ['Calm', 'Thoughtful'], tags: ['gifts', 'relaxing'],
      finder: { mood: [], family: [] },
      shortDesc: 'Two calming candles in a keepsake gift box.',
      description: 'A gentle pairing of Lavender Veil and White Tea Serenity, boxed with a wick trimmer, matches and a note card — ready to give for housewarmings, birthdays and thank-yous.',
      weight: '2 × 180g', burnTime: '35–45 hours each',
      rating: 4.9, reviews: 29, images: [IMG + 'hero_3.jpg'], imagePos: ['88% 50%'],
      badge: 'Gift Set', popularity: 82, added: '2026-06-01'
    }),
    P({
      id: 'SV-102', name: 'The Romance Set', slug: 'the-romance-set', price: 1399, category: 'Gift Set',
      collection: 'gifts', family: 'Floral',
      notes: ['Rose Ember', 'Velvet Oud', 'Matchbox'],
      includes: ['Rose Ember — 180g candle', 'Velvet Oud — 200g candle', 'Wick trimmer', 'Matchbox & gift box', 'Handwritten-style note card'],
      pyramid: null,
      mood: ['Romantic', 'Luxurious'], tags: ['gifts', 'romantic'],
      finder: { mood: [], family: [] },
      shortDesc: 'Rose and oud for anniversaries and evenings in.',
      description: 'Rose Ember and Velvet Oud, boxed together with a wick trimmer, matches and a note card. A romantic gift for anniversaries, weddings and just-because evenings.',
      weight: '180g + 200g', burnTime: '35–50 hours each',
      rating: 4.9, reviews: 31, images: [IMG + 'hero_3.jpg'], imagePos: ['70% 50%'],
      badge: 'Gift Set', popularity: 84, added: '2026-06-05'
    }),
    P({
      id: 'SV-103', name: 'The Weekend Ritual Set', slug: 'the-weekend-ritual-set', price: 1449, category: 'Gift Set',
      collection: 'gifts', family: 'Gourmand',
      notes: ['Vanilla Dusk', 'Forest Mist', 'Matchbox'],
      includes: ['Vanilla Dusk — 180g candle', 'Forest Mist — 180g candle', 'Wick trimmer', 'Matchbox & gift box', 'Handwritten-style note card'],
      pyramid: null,
      mood: ['Cozy', 'Fresh'], tags: ['gifts', 'cozy'],
      finder: { mood: [], family: [] },
      shortDesc: 'One cosy scent, one fresh scent — for slow weekends.',
      description: 'Vanilla Dusk for lazy Sunday evenings and Forest Mist for fresh Saturday mornings. Boxed with a wick trimmer, matches and a note card.',
      weight: '2 × 180g', burnTime: '35–45 hours each',
      rating: 4.8, reviews: 22, images: [IMG + 'hero_3.jpg'], imagePos: ['100% 50%'],
      badge: 'Gift Set', popularity: 76, added: '2026-06-12'
    }),
    P({
      id: 'SV-104', name: 'The Scent Discovery Set', slug: 'discovery-set', price: 899, category: 'Gift Set',
      collection: 'gifts', family: 'Floral',
      notes: ['6 miniature candles', 'Scent guide', 'Gift box'],
      includes: ['Lavender Veil — mini', 'Velvet Oud — mini', 'Rose Ember — mini', 'Citrus Bloom — mini', 'Vanilla Dusk — mini', 'Forest Mist — mini', 'Scent guide card & gift box'],
      pyramid: null,
      mood: ['Discover', 'Gifting'], tags: ['gifts'],
      finder: { mood: [], family: [] },
      shortDesc: 'Six miniature candles to find your favourite scent.',
      description: 'Six miniature candles — one from each of our most-loved fragrances — in a single gift box. The easiest way to find the scent that feels like you before choosing a full-size candle.',
      weight: '6 × 40g', burnTime: '8–10 hours each', wick: 'Cotton Wick', strength: 'Medium',
      rating: 4.9, reviews: 67, images: [IMG + 'hero_3.jpg'], imagePos: ['82% 60%'],
      badge: 'Gift Set', featured: true, bestseller: true, popularity: 88, added: '2026-06-20'
    })
  ];

  var COLLECTIONS = [
    { id: 'calm', name: 'Calm Collection', tagline: 'Lavender • Soft Musk • Sandalwood', desc: 'Soothing, soft-focus fragrances for slow evenings, bedside tables and quiet corners.', image: IMG + 'mood_calm.jpg', pos: '50% 50%', slugs: ['lavender-veil', 'white-tea-serenity', 'sandalwood-calm'] },
    { id: 'romance', name: 'Romance Collection', tagline: 'Rose • Oud • Amber', desc: 'Warm, velvety and a little mysterious — for candlelit dinners and anniversaries.', image: IMG + 'mood_romance.jpg', pos: '50% 50%', slugs: ['rose-ember', 'velvet-oud', 'midnight-rose'] },
    { id: 'cozy', name: 'Cozy Collection', tagline: 'Vanilla • Cinnamon • Chai', desc: 'Comforting, spiced and golden — the scent of snug evenings and warm kitchens.', image: IMG + 'mood_cozy.jpg', pos: '50% 50%', slugs: ['vanilla-dusk', 'warm-cinnamon', 'amber-chai'] },
    { id: 'fresh', name: 'Fresh Collection', tagline: 'Citrus • Eucalyptus • Pine', desc: 'Crisp, bright and green fragrances that feel like an open window.', image: IMG + 'mood_fresh.jpg', pos: '50% 50%', slugs: ['citrus-bloom', 'forest-mist', 'eucalyptus-rain'] },
    { id: 'gourmand', name: 'Gourmand Collection', tagline: 'Vanilla • Coffee • Caramel', desc: 'Sweet, creamy and indulgent scents inspired by your favourite café and kitchen.', image: IMG + 'studio_amber.jpg', pos: '50% 50%', slugs: ['vanilla-bean', 'coffee-and-cream', 'caramel-woods'] },
    { id: 'gifts', name: 'Gift Collection', tagline: 'Boxed • Wrapped • Ready to give', desc: 'Beautifully boxed sets for birthdays, anniversaries, weddings and housewarmings.', image: IMG + 'hero_3.jpg', pos: '85% 50%', slugs: ['the-calm-set', 'the-romance-set', 'the-weekend-ritual-set', 'discovery-set'] }
  ];

  /* ------------------------------ Helpers ------------------------------ */
  var inr = new Intl.NumberFormat('en-IN');
  S.formatPrice = function (n) { return '₹' + inr.format(n); };
  S.products = PRODUCTS;
  S.collections = COLLECTIONS;

  S.getProduct = function (key) {
    if (!key) return null;
    key = String(key).toLowerCase();
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].slug === key || PRODUCTS[i].id.toLowerCase() === key) return PRODUCTS[i];
    }
    return null;
  };

  S.productUrl = function (p) { return 'product.html?p=' + encodeURIComponent(p.slug); };

  S.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  S.stars = function (rating) {
    var full = Math.round(rating * 2) / 2, html = '';
    for (var i = 1; i <= 5; i++) {
      var cls = i <= full ? 'star star--full' : (i - 0.5 === full ? 'star star--half' : 'star');
      html += '<svg class="icon ' + cls + '" aria-hidden="true"><use href="#i-star"/></svg>';
    }
    return '<span class="stars" role="img" aria-label="Rated ' + rating.toFixed(1) + ' out of 5">' + html + '</span>';
  };

  var FILTERS = [
    ['all', 'All'], ['floral', 'Floral'], ['woody', 'Woody'], ['fresh', 'Fresh'], ['gourmand', 'Gourmand'],
    ['citrus', 'Citrus'], ['romantic', 'Romantic'], ['relaxing', 'Relaxing'],
    ['bestsellers', 'Bestsellers'], ['new', 'New Arrivals'], ['gifts', 'Gift Sets']
  ];
  S.filters = FILTERS;

  S.matchesFilter = function (p, key) {
    switch (key) {
      case 'all': case '': case null: case undefined: return true;
      case 'bestsellers': return !!p.bestseller;
      case 'new': return !!p.newArrival;
      case 'gifts': return p.category === 'Gift Set';
      default: return p.tags.indexOf(key) > -1 || p.family.toLowerCase() === key;
    }
  };

  S.filterProducts = function (list, filterKey) {
    var key = typeof filterKey === 'object' && filterKey !== null ? filterKey.filter : filterKey;
    return (list || PRODUCTS).filter(function (p) { return S.matchesFilter(p, key); });
  };

  S.sortProducts = function (list, mode) {
    var a = list.slice();
    switch (mode) {
      case 'best': a.sort(function (x, y) { return y.popularity - x.popularity; }); break;
      case 'price-asc': a.sort(function (x, y) { return x.price - y.price; }); break;
      case 'price-desc': a.sort(function (x, y) { return y.price - x.price; }); break;
      case 'newest': a.sort(function (x, y) { return y.added < x.added ? -1 : y.added > x.added ? 1 : 0; }); break;
      default: a.sort(function (x, y) { return (y.featured ? 1 : 0) - (x.featured ? 1 : 0) || y.popularity - x.popularity; });
    }
    return a;
  };

  S.searchProducts = function (q) {
    q = (q || '').toLowerCase().trim();
    if (!q) return [];
    var words = q.split(/\s+/);
    return PRODUCTS.filter(function (p) {
      var hay = [p.name, p.family, p.notes.join(' '), p.mood.join(' '), p.tags.join(' '), p.shortDesc, p.category, p.collection].join(' ').toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    });
  };
})();
