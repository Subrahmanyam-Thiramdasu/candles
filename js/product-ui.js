/* ==========================================================================
   SCENTAVELLE — product UI
   Product cards, carousels, quick view, add-to-cart, product page,
   cart page and collections page. All driven by products.js data.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Scentavelle;
  var esc = S.esc;
  var ABS = location.href.replace(/[^/]*([?#].*)?$/, '');

  var UI = (S.ui = {});

  function reveal(el) { if (S.reveal) S.reveal(el); }
  function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
  function icon(name, cls) { return '<svg class="icon ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }

  /* ------------------------------ Toast ------------------------------ */
  var toastTimer;
  S.toast = function (html) {
    var t = document.querySelector('[data-toast]');
    if (!t) return;
    t.innerHTML = html;
    t.hidden = false;
    requestAnimationFrame(function () { t.classList.add('is-visible'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove('is-visible');
      setTimeout(function () { t.hidden = true; }, 500);
    }, 4200);
  };

  /* ------------------------------ Card ------------------------------ */
  UI.card = function (p, i) {
    var pos = p.imagePos || [];
    var url = S.productUrl(p);
    var altText = p.name + ' scented candle — ' + p.notes.join(', ');
    var second = p.images[1]
      ? '<img class="p-card__img p-card__img--alt" src="' + p.images[1] + '" alt="" aria-hidden="true" loading="lazy" decoding="async" style="object-position:' + (pos[1] || '50% 50%') + '">'
      : '';
    var badge = p.badge ? '<span class="badge badge--' + slugify(p.badge) + '">' + esc(p.badge) + '</span>' : '';
    var old = p.oldPrice ? ' <s class="p-card__old" aria-label="was ' + S.formatPrice(p.oldPrice) + '">' + S.formatPrice(p.oldPrice) + '</s>' : '';
    var wa = S.wa.link(S.wa.messages.quickOrder(p, 1));
    return '<article class="p-card" data-reveal style="--i:' + (i || 0) + '">' +
      '<div class="p-card__media">' +
        '<a class="p-card__link" href="' + url + '" aria-label="View ' + esc(p.name) + '">' +
          '<img class="p-card__img p-card__img--main" src="' + p.images[0] + '" alt="' + esc(altText) + '" loading="lazy" decoding="async" width="928" height="1152" style="object-position:' + (pos[0] || '50% 50%') + '">' +
          second +
        '</a>' + badge +
        '<button class="p-card__quick" type="button" data-quick-view="' + p.id + '" aria-label="Quick view ' + esc(p.name) + '">Quick View</button>' +
      '</div>' +
      '<div class="p-card__body">' +
        '<p class="p-card__family">' + esc(p.family) + ' • ' + esc(p.mood.join(' • ')) + '</p>' +
        '<h3 class="p-card__name"><a href="' + url + '">' + esc(p.name) + '</a></h3>' +
        '<p class="p-card__desc">' + esc(p.shortDesc) + '</p>' +
        '<p class="p-card__notes">' + esc(p.notes.join(' • ')) + '</p>' +
        '<div class="p-card__meta">' +
          '<p class="p-card__price">' + S.formatPrice(p.price) + old + '</p>' +
          '<p class="p-card__rating">' + S.stars(p.rating) + '<span class="p-card__count">(' + p.reviews + ')</span></p>' +
        '</div>' +
        '<div class="p-card__actions">' +
          '<button class="btn-add" type="button" data-add-to-cart data-id="' + p.id + '">' + icon('bag') + '<span data-label>Add<span class="btn-add__more"> to Cart</span></span></button>' +
          '<a class="btn-wa" href="' + wa + '" target="_blank" rel="noopener" data-wa-product="' + p.id + '" aria-label="Buy ' + esc(p.name) + ' on WhatsApp" title="Buy on WhatsApp">' + icon('whatsapp') + '<span class="sr-only">Buy on WhatsApp</span></a>' +
        '</div>' +
      '</div>' +
    '</article>';
  };

  UI.renderGrid = function (el, list) {
    el.innerHTML = list.map(function (p, i) { return UI.card(p, i % 6); }).join('');
    reveal(el);
  };

  /* Declarative grids: <div data-product-grid="bestsellers|featured|collection:calm|related" data-limit="4"> */
  function resolveSource(src, limit) {
    var list;
    if (src === 'featured') list = S.products.filter(function (p) { return p.featured && p.category === 'Candle'; });
    else if (src === 'bestsellers') list = S.sortProducts(S.products.filter(function (p) { return p.bestseller; }), 'best');
    else if (src === 'gifts') list = S.products.filter(function (p) { return p.category === 'Gift Set'; });
    else if (src === 'new') list = S.products.filter(function (p) { return p.newArrival; });
    else if (src.indexOf('collection:') === 0) {
      var c = S.collections.filter(function (x) { return x.id === src.split(':')[1]; })[0];
      list = c ? c.slugs.map(S.getProduct) : [];
    } else if (src === 'all') list = S.products.slice();
    else list = [];
    return limit ? list.slice(0, limit) : list;
  }
  document.querySelectorAll('[data-product-grid]').forEach(function (el) {
    var src = el.getAttribute('data-product-grid');
    if (src === 'related') return; // handled by product page
    UI.renderGrid(el, resolveSource(src, parseInt(el.getAttribute('data-limit'), 10) || 0));
  });

  /* Horizontal carousels with arrow buttons */
  document.querySelectorAll('[data-carousel]').forEach(function (wrap) {
    var track = wrap.querySelector('[data-carousel-track]');
    var prev = wrap.querySelector('[data-carousel-prev]');
    var next = wrap.querySelector('[data-carousel-next]');
    if (!track) return;
    function step() {
      var first = track.firstElementChild;
      return first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 24) : 300;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 4;
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step() * 2, behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step() * 2, behavior: 'smooth' }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    setTimeout(update, 200);
  });

  /* ------------------------------ Add to cart ------------------------------ */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var p = S.getProduct(id);
    if (!p) return;
    var qty = 1;
    if (btn.hasAttribute('data-use-qty')) {
      var q = document.querySelector('[data-qty-input]');
      qty = q ? Math.max(1, parseInt(q.value, 10) || 1) : 1;
    }
    S.cart.add(id, qty);
    S.bumpCartIcon();

    var label = btn.querySelector('[data-label]');
    if (label && !btn.classList.contains('is-added')) {
      var original = label.innerHTML;
      btn.classList.add('is-added');
      label.innerHTML = btn.hasAttribute('data-long-label') ? 'Added to your cart ✓' : 'Added ✓';
      setTimeout(function () { label.innerHTML = original; btn.classList.remove('is-added'); }, 2200);
    }
    S.toast('<span class="toast__check">' + icon('check') + '</span><span>Added to your cart ✓<small>' + esc(p.name) + (qty > 1 ? ' × ' + qty : '') + '</small></span><a href="cart.html">View cart</a>');
  });

  /* ------------------------------ Quick view ------------------------------ */
  var qv = document.getElementById('quick-view');
  UI.notesLine = function (p) { return p.notes.join(' • '); };
  function openQuickView(id) {
    var p = S.getProduct(id);
    if (!p || !qv) return;
    var pos = (p.imagePos && p.imagePos[0]) || '50% 50%';
    qv.querySelector('[data-quick-view-body]').innerHTML =
      '<div class="quick-view__media"><img src="' + p.images[0] + '" alt="' + esc(p.name + ' scented candle') + '" style="object-position:' + pos + '"></div>' +
      '<div class="quick-view__info">' +
        '<p class="eyebrow">' + esc(p.family) + ' • ' + esc(p.mood.join(' • ')) + '</p>' +
        '<h2 class="quick-view__title">' + esc(p.name) + '</h2>' +
        '<p class="quick-view__rating">' + S.stars(p.rating) + '<span>' + p.rating.toFixed(1) + ' (' + p.reviews + ')</span></p>' +
        '<p class="quick-view__price">' + S.formatPrice(p.price) + '</p>' +
        '<p>' + esc(p.description) + '</p>' +
        '<p class="quick-view__notes"><strong>Notes</strong> ' + esc(UI.notesLine(p)) + '</p>' +
        '<ul class="quick-view__facts"><li>' + esc(p.weight) + '</li><li>' + esc(p.burnTime) + '</li><li>' + esc(p.wax) + '</li></ul>' +
        '<div class="quick-view__actions">' +
          '<button class="btn btn--primary" type="button" data-add-to-cart data-long-label data-id="' + p.id + '">' + icon('bag') + '<span data-label>Add to Cart</span></button>' +
          '<a class="btn btn--outline" href="' + S.wa.link(S.wa.messages.quickOrder(p, 1)) + '" target="_blank" rel="noopener">' + icon('whatsapp') + 'Buy on WhatsApp</a>' +
        '</div>' +
        '<a class="link-arrow" href="' + S.productUrl(p) + '">View full details ' + icon('arrow') + '</a>' +
      '</div>';
    if (typeof qv.showModal === 'function') qv.showModal(); else qv.setAttribute('open', '');
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-quick-view]');
    if (b) openQuickView(b.getAttribute('data-quick-view'));
  });

  /* ------------------------------ Product page ------------------------------ */
  var pdpRoot = document.querySelector('[data-product-page]');
  if (pdpRoot) {
    var params = new URLSearchParams(location.search);
    var p = S.getProduct(params.get('p')) || S.getProduct(params.get('slug'));
    if (!p) {
      pdpRoot.innerHTML = '<div class="container section"><div class="empty"><h1 class="h-section">We couldn’t find that candle.</h1><p>It may have moved. Explore the full collection instead.</p><a class="btn btn--primary" href="shop.html">Shop all candles ' + icon('arrow') + '</a></div></div>';
    } else {
      renderProduct(p);
    }
  }

  function setMeta(sel, attr, val) { var el = document.querySelector(sel); if (el) el.setAttribute(attr, val); }
  function absUrl(rel) { return new URL(rel, location.href).href; }

  function renderProduct(p) {
    var url = absUrl(S.productUrl(p));
    document.title = p.name + ' Scented Candle | Scentavelle';
    var desc = p.name + ' — ' + p.shortDesc + ' Hand-poured ' + p.weight + ' candle with ' + p.notes.join(', ') + '. Order online or on WhatsApp.';
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', document.title);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:image"]', 'content', absUrl(p.images[0]));
    setMeta('meta[name="twitter:title"]', 'content', document.title);
    setMeta('meta[name="twitter:description"]', 'content', desc);
    setMeta('meta[name="twitter:image"]', 'content', absUrl(p.images[0]));

    var ld = [{
      '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: p.id,
      description: p.description, image: p.images.map(absUrl),
      brand: { '@type': 'Brand', name: 'Scentavelle' },
      category: p.category === 'Gift Set' ? 'Gift Sets' : 'Scented Candles',
      weight: p.weight,
      offers: { '@type': 'Offer', priceCurrency: 'INR', price: p.price, availability: 'https://schema.org/InStock', url: url, itemCondition: 'https://schema.org/NewCondition' }
    }, {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('index.html') },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: absUrl('shop.html') },
        { '@type': 'ListItem', position: 3, name: p.name, item: url }
      ]
    }];
    ld.forEach(function (o) {
      var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(o); document.head.appendChild(s);
    });

    var pos = p.imagePos || [];
    var thumbs = p.images.length > 1 ? '<div class="pdp__thumbs" role="tablist" aria-label="Product images">' + p.images.map(function (src, i) {
      return '<button class="pdp__thumb' + (i === 0 ? ' is-active' : '') + '" type="button" role="tab" aria-selected="' + (i === 0) + '" aria-label="Show image ' + (i + 1) + '" data-thumb="' + i + '"><img src="' + src + '" alt="" loading="lazy" style="object-position:' + (pos[i] || '50% 50%') + '"></button>';
    }).join('') + '</div>' : '';

    var story;
    if (p.pyramid) {
      story = '<div class="notes-pyramid"><h2 class="sr-only">Fragrance notes</h2>' +
        [['Top Notes', p.pyramid.top], ['Heart Notes', p.pyramid.heart], ['Base Notes', p.pyramid.base]].map(function (r) {
          return '<div class="notes-pyramid__col"><h3>' + r[0] + '</h3><p>' + esc(r[1].join(' • ')) + '</p></div>';
        }).join('') + '</div>';
    } else {
      story = '<div class="inside"><h2 class="inside__title">What’s inside</h2><ul>' + (p.includes || []).map(function (x) { return '<li>' + icon('check') + esc(x) + '</li>'; }).join('') + '</ul></div>';
    }

    var specs = [['Wax', p.wax], ['Burn Time', p.burnTime], ['Net Weight', p.weight], ['Fragrance Strength', p.strength], ['Wick', p.wick], ['Fragrance', p.fragrance]];
    var old = p.oldPrice ? ' <s>' + S.formatPrice(p.oldPrice) + '</s>' : '';

    pdpRoot.innerHTML =
      '<div class="container">' +
        '<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="shop.html">Shop</a></li><li aria-current="page">' + esc(p.name) + '</li></ol></nav>' +
        '<div class="pdp">' +
          '<div class="pdp__gallery">' +
            '<div class="pdp__stage" data-zoom-stage>' + (p.badge ? '<span class="badge badge--' + slugify(p.badge) + '">' + esc(p.badge) + '</span>' : '') +
              '<img id="pdp-main-img" src="' + p.images[0] + '" alt="' + esc(p.name + ' scented candle — ' + p.notes.join(', ')) + '" width="928" height="1152" fetchpriority="high" style="object-position:' + (pos[0] || '50% 50%') + '">' +
            '</div>' + thumbs +
          '</div>' +
          '<div class="pdp__info">' +
            '<p class="eyebrow">' + esc(p.family) + ' • ' + esc(p.mood.join(' • ')) + '</p>' +
            '<h1 class="pdp__title">' + esc(p.name) + '</h1>' +
            '<p class="pdp__rating">' + S.stars(p.rating) + '<span>' + p.rating.toFixed(1) + ' · ' + p.reviews + ' reviews</span></p>' +
            '<p class="pdp__price">' + S.formatPrice(p.price) + old + '<small>Inclusive of taxes</small></p>' +
            '<p class="pdp__desc">' + esc(p.description) + '</p>' +
            story +
            '<dl class="specs">' + specs.map(function (s) { return '<div><dt>' + s[0] + '</dt><dd>' + esc(s[1]) + '</dd></div>'; }).join('') + '</dl>' +
            '<div class="pdp__buy" id="pdp-buy">' +
              '<div class="qty" role="group" aria-label="Quantity">' +
                '<button type="button" data-qty-minus aria-label="Decrease quantity">' + icon('minus') + '</button>' +
                '<input type="number" inputmode="numeric" min="1" max="99" value="1" data-qty-input aria-label="Quantity">' +
                '<button type="button" data-qty-plus aria-label="Increase quantity">' + icon('plus') + '</button>' +
              '</div>' +
              '<button class="btn btn--primary btn--grow" type="button" data-add-to-cart data-use-qty data-long-label data-id="' + p.id + '">' + icon('bag') + '<span data-label>Add to Cart</span></button>' +
            '</div>' +
            '<a class="btn btn--outline btn--block pdp__wa" href="' + S.wa.link(S.wa.messages.quickOrder(p, 1)) + '" target="_blank" rel="noopener" data-wa-product="' + p.id + '" data-use-qty>' + icon('whatsapp') + 'Order on WhatsApp</a>' +
            '<p class="pdp__bulk">Need 50+ pieces? <a href="bulk-orders.html?candle=' + encodeURIComponent(p.slug) + '#quote">Request Bulk Pricing</a></p>' +
            '<ul class="pdp__assure">' +
              '<li>' + icon('truck') + '<span>Free shipping above ₹999</span></li>' +
              '<li>' + icon('gift') + '<span>Gift-ready packaging</span></li>' +
              '<li>' + icon('drop') + '<span>Hand-poured in India</span></li>' +
            '</ul>' +
            '<details class="pdp__more"><summary>How to enjoy your candle</summary><div><p>Trim the wick to about 5 mm before every burn. Let the first burn last until the wax melts evenly to the edge, and never leave a burning candle unattended. <a href="candle-care.html">Read the full candle care guide</a>.</p></div></details>' +
          '</div>' +
        '</div>' +
      '</div>';

    /* sticky mobile bar */
    var bar = document.createElement('div');
    bar.className = 'pdp-bar'; bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<div><strong>' + esc(p.name) + '</strong><span>' + S.formatPrice(p.price) + '</span></div><button class="btn btn--primary btn--sm" type="button" data-add-to-cart data-id="' + p.id + '" tabindex="-1">' + icon('bag') + '<span data-label>Add to Cart</span></button>';
    document.body.appendChild(bar);
    var buy = document.getElementById('pdp-buy');
    if ('IntersectionObserver' in window && buy) {
      new IntersectionObserver(function (en) {
        var out = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
        bar.classList.toggle('is-visible', out);
        document.body.classList.toggle('has-sticky-bar', out);
        bar.setAttribute('aria-hidden', String(!out));
        bar.querySelector('button').tabIndex = out ? 0 : -1;
      }).observe(buy);
    }

    /* gallery */
    var main = document.getElementById('pdp-main-img');
    pdpRoot.querySelectorAll('[data-thumb]').forEach(function (t) {
      t.addEventListener('click', function () {
        var i = parseInt(t.getAttribute('data-thumb'), 10);
        main.style.opacity = 0;
        setTimeout(function () { main.src = p.images[i]; main.style.objectPosition = pos[i] || '50% 50%'; main.style.opacity = 1; }, 220);
        pdpRoot.querySelectorAll('[data-thumb]').forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
        t.classList.add('is-active'); t.setAttribute('aria-selected', 'true');
      });
    });
    var stage = pdpRoot.querySelector('[data-zoom-stage]');
    if (stage && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      stage.addEventListener('mousemove', function (e) {
        var r = stage.getBoundingClientRect();
        main.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
        stage.classList.add('is-zoomed');
      });
      stage.addEventListener('mouseleave', function () { stage.classList.remove('is-zoomed'); });
    }

    /* quantity */
    var qin = pdpRoot.querySelector('[data-qty-input]');
    function clampQ() { var v = parseInt(qin.value, 10); qin.value = isNaN(v) || v < 1 ? 1 : Math.min(99, v); }
    pdpRoot.querySelector('[data-qty-minus]').addEventListener('click', function () { clampQ(); qin.value = Math.max(1, +qin.value - 1); });
    pdpRoot.querySelector('[data-qty-plus]').addEventListener('click', function () { clampQ(); qin.value = Math.min(99, +qin.value + 1); });
    qin.addEventListener('change', clampQ);

    /* related */
    var rel = document.querySelector('[data-product-grid="related"]');
    if (rel) {
      var list = S.products.filter(function (x) { return x.id !== p.id && x.category === p.category && (x.collection === p.collection || x.family === p.family); });
      if (list.length < 4) list = list.concat(S.sortProducts(S.products.filter(function (x) { return x.id !== p.id && list.indexOf(x) < 0 && x.category === 'Candle'; }), 'best'));
      UI.renderGrid(rel, list.slice(0, 4));
    }
    reveal(pdpRoot);
  }

  /* ------------------------------ Cart page ------------------------------ */
  var cartRoot = document.querySelector('[data-cart-page]');
  if (cartRoot) {
    var itemsEl = cartRoot.querySelector('[data-cart-items]');
    var layout = cartRoot.querySelector('[data-cart-layout]');
    var emptyEl = cartRoot.querySelector('[data-cart-empty]');
    var subEl = cartRoot.querySelector('[data-cart-subtotal]');
    var totEl = cartRoot.querySelector('[data-cart-total]');
    var shipEl = cartRoot.querySelector('[data-cart-shipping]');
    var progEl = cartRoot.querySelector('[data-cart-progress]');
    var progTxt = cartRoot.querySelector('[data-cart-progress-text]');
    var countEl = cartRoot.querySelector('[data-cart-count-text]');
    var waBtn = cartRoot.querySelector('[data-cart-whatsapp]');
    var form = cartRoot.querySelector('[data-cart-form]');

    var renderCart = function () {
      var items = S.cart.items();
      var empty = items.length === 0;
      layout.hidden = empty; emptyEl.hidden = !empty;
      if (empty) return;
      itemsEl.innerHTML = items.map(function (it) {
        var p = it.product, pos = (p.imagePos && p.imagePos[0]) || '50% 50%';
        return '<li class="cart-line" data-line="' + p.id + '">' +
          '<a class="cart-line__img" href="' + S.productUrl(p) + '"><img src="' + p.images[0] + '" alt="' + esc(p.name) + ' candle" loading="lazy" style="object-position:' + pos + '"></a>' +
          '<div class="cart-line__info">' +
            '<h3 class="cart-line__name"><a href="' + S.productUrl(p) + '">' + esc(p.name) + '</a></h3>' +
            '<p class="cart-line__meta">' + esc(p.notes.join(' • ')) + '</p>' +
            '<p class="cart-line__price">' + S.formatPrice(p.price) + ' each</p>' +
            '<div class="cart-line__controls">' +
              '<div class="qty qty--sm" role="group" aria-label="Quantity for ' + esc(p.name) + '">' +
                '<button type="button" data-cart-dec="' + p.id + '" aria-label="Decrease quantity of ' + esc(p.name) + '">' + icon('minus') + '</button>' +
                '<span class="qty__value" aria-live="polite">' + it.qty + '</span>' +
                '<button type="button" data-cart-inc="' + p.id + '" aria-label="Increase quantity of ' + esc(p.name) + '">' + icon('plus') + '</button>' +
              '</div>' +
              '<button class="link-remove" type="button" data-cart-remove="' + p.id + '">Remove</button>' +
            '</div>' +
          '</div>' +
          '<p class="cart-line__total">' + S.formatPrice(it.lineTotal) + '</p>' +
        '</li>';
      }).join('');

      var sum = S.cart.summary(), min = S.config.freeShippingAbove;
      subEl.textContent = S.formatPrice(sum.subtotal);
      totEl.textContent = S.formatPrice(sum.total);
      shipEl.textContent = sum.freeShipping ? 'Free' : 'Confirmed on WhatsApp';
      countEl.textContent = sum.count + (sum.count === 1 ? ' item' : ' items');
      var pct = Math.min(100, Math.round(sum.subtotal / min * 100));
      progEl.style.setProperty('--p', pct + '%');
      progTxt.innerHTML = sum.freeShipping ? 'You’ve unlocked <strong>free shipping</strong> ✓' : 'Add <strong>' + S.formatPrice(min - sum.subtotal) + '</strong> more for free shipping';
    };
    renderCart();
    document.addEventListener('cart:change', renderCart);

    cartRoot.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-cart-inc]'))) S.cart.increase(t.getAttribute('data-cart-inc'));
      else if ((t = e.target.closest('[data-cart-dec]'))) S.cart.decrease(t.getAttribute('data-cart-dec'));
      else if ((t = e.target.closest('[data-cart-remove]'))) S.cart.remove(t.getAttribute('data-cart-remove'));
      else if (e.target.closest('[data-cart-clear]')) {
        if (window.confirm('Remove everything from your cart?')) S.cart.clear();
      }
    });

    /* remember delivery details locally so a refresh doesn't lose them */
    var DKEY = 'scentavelle_delivery_v1';
    try {
      var saved = JSON.parse(localStorage.getItem(DKEY) || '{}');
      Object.keys(saved).forEach(function (k) { if (form.elements[k]) form.elements[k].value = saved[k]; });
    } catch (err) { /* ignore */ }
    form.addEventListener('input', function () {
      var d = {}; new FormData(form).forEach(function (v, k) { d[k] = v; });
      try { localStorage.setItem(DKEY, JSON.stringify(d)); } catch (err) { /* ignore */ }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var items = S.cart.items();
      if (!items.length) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var d = {}; new FormData(form).forEach(function (v, k) { d[k] = String(v).trim(); });
      S.wa.open(S.wa.messages.cartOrder(items, d));
      var st = cartRoot.querySelector('[data-form-status]');
      st.hidden = false;
      st.textContent = 'WhatsApp is opening with your order pre-filled. Send the message to Mahesh to confirm — your cart stays saved until you clear it.';
    });
    if (waBtn) waBtn.disabled = false;
  }

  /* ------------------------------ Collections page ------------------------------ */
  var colRoot = document.querySelector('[data-collections-list]');
  if (colRoot) {
    colRoot.innerHTML = S.collections.map(function (c, idx) {
      var list = c.slugs.map(S.getProduct);
      return '<section class="collection" id="' + c.id + '" aria-labelledby="col-' + c.id + '">' +
        '<div class="container">' +
          '<div class="collection__head' + (idx % 2 ? ' is-flip' : '') + '">' +
            '<div class="collection__img img-reveal" data-reveal><img src="' + c.image + '" alt="' + esc(c.name) + ' candles" loading="lazy" style="object-position:' + c.pos + '"></div>' +
            '<div class="collection__intro" data-reveal>' +
              '<p class="eyebrow">' + esc(c.tagline) + '</p>' +
              '<h2 class="h-section" id="col-' + c.id + '">' + esc(c.name) + '</h2>' +
              '<p class="lede">' + esc(c.desc) + '</p>' +
              '<a class="link-arrow" href="shop.html?filter=' + (c.id === 'gifts' ? 'gifts' : c.id === 'calm' ? 'relaxing' : c.id === 'romance' ? 'romantic' : c.id) + '">Shop ' + esc(c.name.replace(' Collection', '')) + ' ' + icon('arrow') + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="grid grid--products" data-col-grid>' + list.map(function (p, i) { return UI.card(p, i); }).join('') + '</div>' +
        '</div>' +
      '</section>';
    }).join('');
    reveal(colRoot);
  }

  /* ------------------------------ Discovery set dynamic bits ------------------------------ */
  document.querySelectorAll('[data-discovery-price]').forEach(function (el) { el.textContent = S.formatPrice(S.getProduct('discovery-set').price); });
  document.querySelectorAll('[data-discovery-link]').forEach(function (a) { a.href = S.productUrl(S.getProduct('discovery-set')); });
})();
