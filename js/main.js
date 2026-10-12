/* ==========================================================================
   SCENTAVELLE — main interactions
   Header, menu, search, dialogs, reveals, parallax, hero slider,
   page transitions, newsletter, bulk-quote dialog.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Scentavelle;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = S.esc;

  /* ---------------- Sticky header state ---------------- */
  var header = $('#site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile menu ---------------- */
  var menu = $('#mobile-menu');
  var scrim = $('.scrim');
  var menuToggle = $('[data-menu-open]');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    if (scrim) { scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.toggle('is-open', open); }); if (!open) setTimeout(function () { if (!menu.classList.contains('is-open')) scrim.hidden = true; }, 500); }
    document.body.classList.toggle('menu-open', open);
    if (menuToggle) menuToggle.setAttribute('aria-expanded', String(open));
    if (open) { var c = $('[data-menu-close]', menu); if (c) c.focus(); } else if (menuToggle) menuToggle.focus({ preventScroll: true });
  }
  $$('[data-menu-open]').forEach(function (b) { b.addEventListener('click', function () { setMenu(true); }); });
  $$('[data-menu-close]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); }); });
  if (menu) $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { if (menu.classList.contains('is-open')) { menu.classList.remove('is-open'); document.body.classList.remove('menu-open'); } }); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1120 && menu && menu.classList.contains('is-open')) setMenu(false); });

  /* ---------------- Search panel ---------------- */
  var panel = $('#search-panel');
  var searchInput = $('#site-search');
  var resultsEl = $('[data-search-results]');
  function openSearch() {
    if (!panel) return;
    panel.hidden = false;
    requestAnimationFrame(function () { panel.classList.add('is-open'); });
    renderSearch('');
    setTimeout(function () { searchInput.focus(); }, 60);
  }
  function closeSearch() {
    if (!panel || panel.hidden) return;
    panel.classList.remove('is-open');
    setTimeout(function () { panel.hidden = true; }, 350);
    var b = $('[data-search-open]'); if (b) b.focus({ preventScroll: true });
  }
  function renderSearch(q) {
    q = q.trim();
    if (q.length < 2) {
      resultsEl.innerHTML = '<p class="search-panel__hint">Popular searches</p><p class="search-panel__tags">' +
        ['Lavender', 'Vanilla', 'Rose', 'Oud', 'Citrus', 'Gift set'].map(function (t) { return '<a href="shop.html?q=' + encodeURIComponent(t) + '">' + t + '</a>'; }).join('') + '</p>';
      return;
    }
    var hits = S.searchProducts(q);
    if (!hits.length) {
      resultsEl.innerHTML = '<p class="search-panel__hint">No candles match “' + esc(q) + '”. <a href="' + S.wa.link('Hello Mahesh,\nI am looking for a candle: ' + q) + '" target="_blank" rel="noopener">Ask Mahesh on WhatsApp</a> or <a href="shop.html">browse everything</a>.</p>';
      return;
    }
    resultsEl.innerHTML = '<p class="search-panel__hint">' + hits.length + (hits.length === 1 ? ' result' : ' results') + '</p><ul class="search-results">' +
      hits.slice(0, 6).map(function (p) {
        return '<li><a href="' + S.productUrl(p) + '"><img src="' + p.images[0] + '" alt="" loading="lazy" style="object-position:' + ((p.imagePos && p.imagePos[0]) || '50% 50%') + '"><span><strong>' + esc(p.name) + '</strong><small>' + esc(p.notes.join(' • ')) + '</small></span><em>' + S.formatPrice(p.price) + '</em></a></li>';
      }).join('') + '</ul>' +
      (hits.length > 6 ? '<p class="search-panel__more"><a href="shop.html?q=' + encodeURIComponent(q) + '">View all ' + hits.length + ' results →</a></p>' : '');
  }
  $$('[data-search-open]').forEach(function (b) { b.addEventListener('click', function () { panel && !panel.hidden ? closeSearch() : openSearch(); }); });
  $$('[data-search-close]').forEach(function (b) { b.addEventListener('click', closeSearch); });
  if (searchInput) searchInput.addEventListener('input', function () { renderSearch(searchInput.value); });

  /* ---------------- Global Escape ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menu && menu.classList.contains('is-open')) setMenu(false);
    closeSearch();
  });

  /* ---------------- Dialogs ---------------- */
  function openDialog(d) { if (!d) return; if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', ''); document.body.classList.add('modal-open'); }
  function closeDialog(d) { if (!d) return; if (typeof d.close === 'function') d.close(); else d.removeAttribute('open'); }
  $$('dialog.modal').forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target === d) closeDialog(d); });
    d.addEventListener('close', function () { document.body.classList.remove('modal-open'); });
    $$('[data-modal-close]', d).forEach(function (b) { b.addEventListener('click', function () { closeDialog(d); }); });
  });
  $$('[data-account-open]').forEach(function (b) { b.addEventListener('click', function () { openDialog($('#account-dialog')); }); });

  /* Bulk quote dialog */
  var bulk = $('#bulk-dialog');
  function fillCandleSelects() {
    $$('[data-candle-select]').forEach(function (sel) {
      var opts = '<option value="">Choose a candle (optional)</option>' +
        S.products.filter(function (p) { return p.category === 'Candle'; }).map(function (p) { return '<option>' + esc(p.name) + '</option>'; }).join('') +
        '<option>Gift sets</option><option>Discovery Set minis</option><option>Not sure yet — need guidance</option>';
      sel.innerHTML = opts;
    });
  }
  fillCandleSelects();
  function openBulk() {
    if (!bulk) return;
    var cand = new URLSearchParams(location.search).get('candle');
    var p = cand && S.getProduct(cand);
    var sel = $('[data-candle-select]', bulk);
    if (p && sel) sel.value = p.name;
    openDialog(bulk);
  }
  $$('[data-open-bulk]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openBulk(); }); });
  if (bulk && location.hash === '#quote') setTimeout(openBulk, 450);
  window.addEventListener('hashchange', function () { if (bulk && location.hash === '#quote') openBulk(); });

  /* ---------------- Scroll reveals ---------------- */
  var io = null;
  if ('IntersectionObserver' in window && !reduceMotion) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }
  S.reveal = function (scope) {
    $$('[data-reveal]:not(.is-visible)', scope || document).forEach(function (el) {
      if (io) io.observe(el); else el.classList.add('is-visible');
    });
  };
  S.reveal();

  /* ---------------- Gentle parallax ---------------- */
  var px = $$('[data-parallax]');
  if (px.length && !reduceMotion) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      px.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.06;
        var offset = (r.top + r.height / 2 - vh / 2) * speed * -1;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0) scale(1.12)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------- Hero slider ---------------- */
  $$('[data-hero]').forEach(function (hero) {
    var slides = $$('.hero__slide', hero);
    var cur = $('[data-hero-current]', hero);
    var bar = $('[data-hero-progress]', hero);
    var i = 0, timer = null, DELAY = 8000;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', String(!on));
        if (on) s.removeAttribute('inert'); else s.setAttribute('inert', '');
      });
      if (cur) cur.textContent = pad(i + 1);
      if (bar) { bar.style.setProperty('--step', i / (slides.length - 1)); }
    }
    function play() { if (reduceMotion || slides.length < 2) return; stop(); timer = setTimeout(function () { go(i + 1); play(); }, DELAY); }
    function stop() { clearTimeout(timer); }
    $('[data-hero-prev]', hero).addEventListener('click', function () { go(i - 1); play(); });
    $('[data-hero-next]', hero).addEventListener('click', function () { go(i + 1); play(); });
    hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', play);
    hero.addEventListener('focusin', stop); hero.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
    var x0 = null;
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { go(dx < 0 ? i + 1 : i - 1); play(); }
    }, { passive: true });
    go(0); play();
  });

  /* ---------------- Page transitions ---------------- */
  window.addEventListener('pageshow', function (e) { if (e.persisted) document.body.classList.remove('is-leaving'); });
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (!/^(https?|file):$/.test(a.protocol) || a.protocol !== location.protocol || a.host !== location.host) return;
    if (a.pathname === location.pathname && a.search === location.search && a.hash) return; // same-page anchor
    if (reduceMotion) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(function () { window.location.href = a.href; }, 260);
  });

  /* ---------------- Newsletter ---------------- */
  $$('[data-newsletter]').forEach(function (form) {
    var msg = $('.newsletter__msg', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.elements.email.value.trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      form.classList.remove('is-success', 'is-error');
      if (!ok) { form.classList.add('is-error'); msg.textContent = 'Please enter a valid email address.'; form.elements.email.focus(); return; }
      try {
        var list = JSON.parse(localStorage.getItem('scentavelle_newsletter') || '[]');
        if (list.indexOf(email) < 0) list.push(email);
        localStorage.setItem('scentavelle_newsletter', JSON.stringify(list));
      } catch (err) { /* ignore */ }
      if (S.config.newsletterEndpoint) {
        fetch(S.config.newsletterEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email: email, source: 'scentavelle-website' }) }).catch(function () { });
      }
      form.classList.add('is-success');
      msg.textContent = 'Welcome to the Lume Nest Circle ✓ Thank you for joining.';
      form.reset();
    });
  });

  /* ---------------- Contact page: "Send an enquiry" scroll + focus ---------------- */
  $$('[data-scroll-to]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = $(a.getAttribute('data-scroll-to'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      var f = t.querySelector('input,textarea,select'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 500);
    });
  });

  /* ---------------- FAQ: one open at a time + filter ---------------- */
  var faqs = $$('details.faq-item');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; }); });
  });
})();
