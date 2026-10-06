/* ==========================================================================
   SCENTAVELLE — shop filters, sorting and search
   Reads/writes ?filter=...&sort=...&q=... so views are shareable.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Scentavelle;
  var root = document.querySelector('[data-shop]');
  if (!root) return;

  var chipsEl = root.querySelector('[data-filter-chips]');
  var gridEl = root.querySelector('[data-shop-grid]');
  var sortEl = root.querySelector('[data-sort]');
  var countEl = root.querySelector('[data-result-count]');
  var emptyEl = root.querySelector('[data-shop-empty]');
  var qEl = root.querySelector('[data-shop-search]');
  var titleEl = root.querySelector('[data-shop-heading]');

  var params = new URLSearchParams(location.search);
  var VALID_SORT = ['featured', 'best', 'price-asc', 'price-desc', 'newest'];
  var state = {
    filter: S.filters.some(function (f) { return f[0] === params.get('filter'); }) ? params.get('filter') : 'all',
    sort: VALID_SORT.indexOf(params.get('sort')) > -1 ? params.get('sort') : 'featured',
    q: (params.get('q') || '').trim()
  };

  chipsEl.innerHTML = S.filters.map(function (f) {
    return '<button class="filter-chip" type="button" data-filter="' + f[0] + '" aria-pressed="false">' + f[1] + '</button>';
  }).join('');
  sortEl.value = state.sort;
  if (qEl) qEl.value = state.q;

  function syncUrl() {
    var u = new URLSearchParams();
    if (state.filter !== 'all') u.set('filter', state.filter);
    if (state.sort !== 'featured') u.set('sort', state.sort);
    if (state.q) u.set('q', state.q);
    var qs = u.toString();
    try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '')); } catch (e) { /* file:// restrictions */ }
  }

  function render() {
    var list = state.q ? S.searchProducts(state.q) : S.products.slice();
    list = list.filter(function (p) { return S.matchesFilter(p, state.filter); });
    list = S.sortProducts(list, state.sort);

    chipsEl.querySelectorAll('[data-filter]').forEach(function (b) {
      var on = b.getAttribute('data-filter') === state.filter;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    var label = S.filters.filter(function (f) { return f[0] === state.filter; })[0][1];
    countEl.textContent = list.length + (list.length === 1 ? ' candle' : ' candles') + (state.q ? ' for “' + state.q + '”' : '') + (state.filter !== 'all' ? ' · ' + label : '');
    emptyEl.hidden = list.length > 0;
    gridEl.hidden = list.length === 0;
    S.ui.renderGrid(gridEl, list);
    syncUrl();
  }

  chipsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]');
    if (!b) return;
    state.filter = b.getAttribute('data-filter');
    render();
  });
  sortEl.addEventListener('change', function () { state.sort = sortEl.value; render(); });
  if (qEl) {
    var t;
    qEl.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.q = qEl.value.trim(); render(); }, 180); });
    qEl.closest('form').addEventListener('submit', function (e) { e.preventDefault(); state.q = qEl.value.trim(); render(); });
  }
  var reset = root.querySelector('[data-shop-reset]');
  if (reset) reset.addEventListener('click', function () { state.filter = 'all'; state.q = ''; state.sort = 'featured'; sortEl.value = 'featured'; if (qEl) qEl.value = ''; render(); });

  render();
})();
