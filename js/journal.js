/* ==========================================================================
   SCENTAVELLE — journal (articles data + rendering)
   Journal page grid, single article page (article.html?a=slug) and the
   home-page teaser all read from this one list.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Scentavelle;
  var esc = S.esc;
  var IMG = 'assets/images/';

  var ARTICLES = [
    {
      slug: 'how-to-choose-the-right-scent-for-your-home', title: 'How to Choose the Right Scent for Your Home', cat: 'Scent Guide', read: 5, date: '2026-09-28',
      image: IMG + 'hero_1.jpg', pos: '78% 50%',
      excerpt: 'A room-by-room way to think about fragrance, so every space smells the way it feels.',
      body: [
        ['p', 'Choosing a candle is less about finding the “best” scent and more about matching the feeling of a room. Start by asking what you do in the space — and how you want to feel while you do it.'],
        ['h', 'Living room: warm and welcoming'],
        ['p', 'Shared spaces suit rounded, warm fragrances — vanilla, amber, sandalwood and soft spice. They feel familiar and inviting, which is exactly what a room full of people needs. Velvet Oud and Vanilla Dusk are popular here.'],
        ['h', 'Bedroom: soft and quiet'],
        ['p', 'Think gentle florals and creamy woods. Lavender, white tea and soft musk keep a bedroom feeling calm without being overpowering.'],
        ['h', 'Study or work corner: clear and fresh'],
        ['p', 'Citrus, eucalyptus and pine feel crisp and clear-headed. A fresh scent is a lovely signal that it’s time to focus.'],
        ['h', 'A simple rule'],
        ['p', 'Smaller rooms need less fragrance; larger rooms can handle richer, deeper scents. Not sure? Our Scent Discovery Set lets you live with six fragrances before you commit to a full-size candle.']
      ]
    },
    {
      slug: '5-candle-care-mistakes-you-should-avoid', title: '5 Candle Care Mistakes You Should Avoid', cat: 'Candle Care', read: 4, date: '2026-09-20',
      image: IMG + 'studio_amber.jpg', pos: '50% 60%',
      excerpt: 'Small habits that make a big difference to how evenly — and how long — your candle burns.',
      body: [
        ['p', 'A well-made candle still needs a little care. These five mistakes are the most common reasons candles tunnel, smoke or lose their fragrance early.'],
        ['h', '1. Skipping the wick trim'],
        ['p', 'Trim the wick to about 5 mm before every burn. A long wick makes a larger flame, which can smoke and burn the wax unevenly.'],
        ['h', '2. Blowing out the first burn too early'],
        ['p', 'On the first burn, let the wax melt all the way to the edge of the jar. This sets a “memory” so the candle burns evenly from then on.'],
        ['h', '3. Burning for too long at a time'],
        ['p', 'Burning for several hours at a stretch overheats the vessel and the wax. Two to four hours at a time is a sensible window for most candles.'],
        ['h', '4. Moving the candle while the wax is liquid'],
        ['p', 'Let the candle cool and the wax set before moving it, so debris doesn’t drift into the melt pool.'],
        ['h', '5. Leaving it unattended'],
        ['p', 'Never leave a burning candle unattended, and keep it away from children, pets and anything flammable. It’s the most important rule of all.']
      ]
    },
    {
      slug: 'soy-wax-vs-other-candle-waxes', title: 'Soy Wax vs Other Candle Waxes', cat: 'Craft', read: 5, date: '2026-09-12',
      image: IMG + 'studio_cream.jpg', pos: '50% 55%',
      excerpt: 'What candle wax is made from, and why we pour with a premium soy wax blend.',
      body: [
        ['p', 'Wax is the foundation of every candle. It affects how a candle looks, how it burns and how its fragrance travels through a room.'],
        ['h', 'Paraffin'],
        ['p', 'A petroleum-derived wax that is widely used because it is inexpensive and carries fragrance strongly. It burns a little hotter and is often used in mass-produced candles.'],
        ['h', 'Soy wax'],
        ['p', 'Made from soybean oil, soy wax has a creamy, soft finish and tends to burn slower and cooler. That slower burn is one reason soy candles are loved for long, steady fragrance.'],
        ['h', 'Beeswax and coconut blends'],
        ['p', 'Beeswax has a naturally honeyed scent and burns beautifully but is costlier. Coconut blends add smoothness and a clean burn.'],
        ['h', 'Why we pour with a soy wax blend'],
        ['p', 'Our premium soy wax blend gives a smooth surface, an even melt and a pleasant throw of fragrance. Every candle is hand-poured with a cotton wick and premium fragrance oil.']
      ]
    },
    {
      slug: 'how-to-make-your-candle-last-longer', title: 'How to Make Your Candle Last Longer', cat: 'Candle Care', read: 4, date: '2026-09-05',
      image: IMG + 'mood_fresh.jpg', pos: '50% 50%',
      excerpt: 'Five simple rituals that help you get every hour out of your candle.',
      body: [
        ['p', 'A candle is a small luxury — and a few easy habits help it last longer and burn more beautifully.'],
        ['h', 'Let the first burn do the work'],
        ['p', 'Allow the first burn to reach the edges of the jar so the wax melts evenly. Do this once and the candle will thank you for the rest of its life.'],
        ['h', 'Trim, every time'],
        ['p', 'Trim the cotton wick to about 5 mm before lighting. It keeps the flame steady and reduces smoke.'],
        ['h', 'Keep burns to a sensible length'],
        ['p', 'Two to four hours at a time is plenty. Longer burns heat the jar and the wax more than necessary.'],
        ['h', 'Keep it away from drafts'],
        ['p', 'A flickering flame burns unevenly. Place your candle away from fans, open windows and air vents.'],
        ['h', 'Store it well'],
        ['p', 'Keep the candle in a cool, dry place away from direct sunlight, and cover it with its lid when it isn’t in use to keep dust out and fragrance in.']
      ]
    },
    {
      slug: 'best-candle-scents-for-bedrooms', title: 'Best Candle Scents for Bedrooms', cat: 'Scent Guide', read: 4, date: '2026-08-28',
      image: IMG + 'hero_2.jpg', pos: '80% 50%',
      excerpt: 'Soft, quiet fragrances for the room where your day begins and ends.',
      body: [
        ['p', 'The bedroom is where scent should be softest. The best bedroom fragrances are gentle, rounded and never sharp.'],
        ['h', 'Lavender and soft musk'],
        ['p', 'Lavender has long been associated with winding down. Lavender Veil pairs it with vanilla and musk for a soft, creamy finish.'],
        ['h', 'Sandalwood and creamy woods'],
        ['p', 'Sandalwood feels grounded and warm. It makes a bedroom feel like a calm, private retreat.'],
        ['h', 'White tea'],
        ['p', 'Light and clean, white tea suits smaller rooms and anyone who prefers a subtle fragrance.'],
        ['h', 'A little advice'],
        ['p', 'Light your candle earlier in the evening, enjoy the fragrance while you read or get ready, and extinguish it safely before you sleep. Never sleep with a burning candle.']
      ]
    },
    {
      slug: 'how-to-choose-candles-for-gifting', title: 'How to Choose Candles for Gifting', cat: 'Gifting', read: 5, date: '2026-08-20',
      image: IMG + 'hero_3.jpg', pos: '85% 50%',
      excerpt: 'A thoughtful way to choose a candle that feels personal — even when you’re unsure of their taste.',
      body: [
        ['p', 'A candle is one of the most universal gifts — warm, useful and quietly personal. The trick is choosing a fragrance that suits the person, not just the occasion.'],
        ['h', 'Think about their mood, not just their taste'],
        ['p', 'Is this someone who loves slow evenings? Reach for Lavender Veil. A friend who always has a cup of chai in hand? Amber Chai. Someone who loves fresh air and plants? Forest Mist.'],
        ['h', 'When in doubt, go for a crowd-pleaser'],
        ['p', 'Vanilla, soft musk and gentle florals are rarely divisive. Vanilla Dusk is one of our most-loved gifts for exactly that reason.'],
        ['h', 'Choose a set'],
        ['p', 'Our gift sets come boxed with a wick trimmer, matchbox and note card. If you’d like them to discover their favourite, the Scent Discovery Set holds six miniature candles.'],
        ['h', 'Add a personal note'],
        ['p', 'We can include a handwritten-style message with your gift — just tell us when you order.']
      ]
    },
    {
      slug: 'candles-for-weddings-and-return-gifts', title: 'Candles for Weddings & Return Gifts', cat: 'Gifting', read: 6, date: '2026-08-10',
      image: IMG + 'mood_romance.jpg', pos: '50% 50%',
      excerpt: 'Planning wedding favours or return gifts? Here’s how candles can make them memorable.',
      body: [
        ['p', 'A candle is a keepsake that lasts well beyond the day itself — which is why it’s become such a popular choice for wedding favours and return gifts.'],
        ['h', 'Choose a scent that suits the celebration'],
        ['p', 'Rose, amber and vanilla feel romantic and warm; citrus and eucalyptus suit day weddings and outdoor celebrations.'],
        ['h', 'Personalise it'],
        ['p', 'Custom labels, names, dates and monograms turn a candle into a favour guests actually keep. We also offer custom packaging for larger orders.'],
        ['h', 'Plan ahead'],
        ['p', 'Bulk orders involve labels, packaging and hand-pouring. Share your quantity and date with us early so we can confirm options and timelines.'],
        ['h', 'Start an enquiry'],
        ['p', 'Tell us about your event on our Bulk & Corporate page and Mahesh will reply on WhatsApp with options and pricing.']
      ]
    },
    {
      slug: 'the-psychology-of-fragrance-and-mood', title: 'The Psychology of Fragrance and Mood', cat: 'Scent Guide', read: 6, date: '2026-07-30',
      image: IMG + 'mood_calm.jpg', pos: '50% 50%',
      excerpt: 'Why a single scent can bring back a memory — and how to use fragrance to shape your day.',
      body: [
        ['p', 'Scent is closely tied to memory and emotion, which is why a single fragrance can bring back a summer afternoon or a grandmother’s kitchen in an instant.'],
        ['h', 'Why scent feels so personal'],
        ['p', 'Our sense of smell is wired close to the parts of the brain involved in memory and feeling. That’s why fragrance tends to feel instinctive rather than analytical — you know when something simply feels right.'],
        ['h', 'Creating small rituals'],
        ['p', 'Using the same scent at the same time every day — a morning citrus, an evening vanilla — can turn ordinary routines into small rituals that mark the beginning and end of a day.'],
        ['h', 'Matching scent to moment'],
        ['p', 'Choose fresh and citrus notes for mornings and focus, warm and woody notes for gatherings, and soft florals and musk for winding down.'],
        ['p', 'This is a feeling-led guide rather than a medical one — fragrance is about enjoyment, atmosphere and ritual.']
      ]
    }
  ];

  S.articles = ARTICLES;
  function get(slug) { return ARTICLES.filter(function (a) { return a.slug === slug; })[0]; }
  function fmtDate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function url(a) { return 'article.html?a=' + a.slug; }
  function arrow() { return '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>'; }

  function card(a, i, big) {
    return '<article class="j-card' + (big ? ' j-card--big' : '') + '" data-reveal style="--i:' + (i % 4) + '">' +
      '<a class="j-card__media" href="' + url(a) + '" tabindex="-1" aria-hidden="true"><img src="' + a.image + '" alt="" loading="lazy" decoding="async" style="object-position:' + a.pos + '"></a>' +
      '<div class="j-card__body">' +
        '<p class="j-card__meta">' + esc(a.cat) + ' <span aria-hidden="true">•</span> ' + a.read + ' min read</p>' +
        '<h3 class="j-card__title"><a href="' + url(a) + '">' + esc(a.title) + '</a></h3>' +
        '<p class="j-card__excerpt">' + esc(a.excerpt) + '</p>' +
        '<a class="link-arrow" href="' + url(a) + '" aria-label="Read ' + esc(a.title) + '">Read article ' + arrow() + '</a>' +
      '</div></article>';
  }

  /* Journal listing */
  var list = document.querySelector('[data-journal-grid]');
  if (list) {
    var limit = parseInt(list.getAttribute('data-limit'), 10) || ARTICLES.length;
    var feat = list.hasAttribute('data-featured');
    var html = '';
    ARTICLES.slice(0, limit).forEach(function (a, i) { html += card(a, i, feat && i === 0); });
    list.innerHTML = html;
    if (S.reveal) S.reveal(list);
  }

  /* Single article */
  var root = document.querySelector('[data-article-page]');
  if (root) {
    var a = get(new URLSearchParams(location.search).get('a'));
    if (!a) {
      root.innerHTML = '<div class="container section"><div class="empty"><h1 class="h-section">Article not found</h1><p>Browse the Journal for more reading.</p><a class="btn btn--primary" href="journal.html">Back to the Journal ' + arrow() + '</a></div></div>';
    } else {
      var abs = function (r) { return new URL(r, location.href).href; };
      var u = abs(url(a));
      document.title = a.title + ' | Scentavelle Journal';
      var set = function (sel, v) { var el = document.querySelector(sel); if (el) el.setAttribute('content', v); };
      set('meta[name="description"]', a.excerpt);
      set('meta[property="og:title"]', document.title); set('meta[property="og:description"]', a.excerpt);
      set('meta[property="og:image"]', abs(a.image)); set('meta[property="og:url"]', u);
      set('meta[name="twitter:title"]', document.title); set('meta[name="twitter:description"]', a.excerpt); set('meta[name="twitter:image"]', abs(a.image));
      var can = document.querySelector('link[rel="canonical"]'); if (can) can.setAttribute('href', u);
      var sc = document.createElement('script'); sc.type = 'application/ld+json';
      sc.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, image: abs(a.image), datePublished: a.date, author: { '@type': 'Organization', name: 'Scentavelle' }, publisher: { '@type': 'Organization', name: 'Scentavelle' }, mainEntityOfPage: u });
      document.head.appendChild(sc);

      var body = a.body.map(function (b) { return b[0] === 'h' ? '<h2>' + esc(b[1]) + '</h2>' : '<p>' + esc(b[1]) + '</p>'; }).join('');
      var others = ARTICLES.filter(function (x) { return x.slug !== a.slug; }).slice(0, 3);
      root.innerHTML =
        '<header class="article-hero"><div class="container container--narrow">' +
          '<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="journal.html">Journal</a></li><li aria-current="page">' + esc(a.cat) + '</li></ol></nav>' +
          '<p class="eyebrow">' + esc(a.cat) + ' • ' + a.read + ' min read</p>' +
          '<h1 class="h-display h-display--dark">' + esc(a.title) + '</h1>' +
          '<p class="lede">' + esc(a.excerpt) + '</p>' +
          '<p class="article-hero__date">By the Scentavelle team · ' + fmtDate(a.date) + '</p>' +
        '</div></header>' +
        '<div class="container"><figure class="article-figure img-reveal" data-reveal><img src="' + a.image + '" alt="' + esc(a.title) + '" style="object-position:' + a.pos + '"></figure></div>' +
        '<div class="container container--narrow"><div class="prose">' + body + '</div>' +
          '<aside class="article-cta"><p class="eyebrow">Find your scent</p><h2>Ready to light something beautiful?</h2><div class="btn-row"><a class="btn btn--primary" href="shop.html">Shop candles ' + arrow() + '</a><a class="btn btn--outline" href="index.html#find-your-scent">Take the scent quiz</a></div></aside>' +
        '</div>' +
        '<section class="section section--cream"><div class="container"><div class="sec-head"><h2 class="sec-head__title">Keep reading</h2><span class="sec-head__line"></span><a class="sec-head__link" href="journal.html">All articles ' + arrow() + '</a></div>' +
        '<div class="grid grid--journal">' + others.map(function (x, i) { return card(x, i); }).join('') + '</div></div></section>';
      if (S.reveal) S.reveal(root);
    }
  }
})();
