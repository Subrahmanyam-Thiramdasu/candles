/* ==========================================================================
   SCENTAVELLE — cart (localStorage)
   Stores only [{ id, qty }]; prices always come from products.js.
   Fires a "cart:change" event on document whenever the cart changes.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Scentavelle;
  var KEY = 'scentavelle_cart_v1';
  var MAX_QTY = 99;

  function read() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter(function (l) { return l && S.getProduct(l.id) && l.qty > 0; }) : [];
    } catch (e) { return []; }
  }
  function write(lines) {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch (e) { /* storage unavailable — cart lives for this page only */ }
    emit();
  }
  var memoryFallback = null;
  function emit() { document.dispatchEvent(new CustomEvent('cart:change', { detail: Cart.summary() })); }

  var Cart = {
    lines: function () { return memoryFallback || read(); },

    /** Lines joined with product data */
    items: function () {
      return this.lines().map(function (l) {
        var p = S.getProduct(l.id);
        return { product: p, qty: l.qty, lineTotal: p.price * l.qty };
      });
    },
    count: function () { return this.lines().reduce(function (n, l) { return n + l.qty; }, 0); },
    subtotal: function () { return this.items().reduce(function (n, i) { return n + i.lineTotal; }, 0); },
    summary: function () {
      var sub = this.subtotal();
      return { count: this.count(), subtotal: sub, total: sub, freeShipping: sub >= S.config.freeShippingAbove };
    },

    add: function (id, qty) {
      var p = S.getProduct(id); if (!p) return false;
      qty = Math.max(1, parseInt(qty, 10) || 1);
      var lines = this.lines(), found = false;
      lines.forEach(function (l) { if (l.id === p.id) { l.qty = Math.min(MAX_QTY, l.qty + qty); found = true; } });
      if (!found) lines.push({ id: p.id, qty: Math.min(MAX_QTY, qty) });
      write(lines);
      return true;
    },
    setQty: function (id, qty) {
      var p = S.getProduct(id);
      var targetId = p ? p.id : id;
      qty = parseInt(qty, 10) || 0;
      var lines = this.lines();
      lines = lines.map(function (l) { return l.id === targetId ? { id: targetId, qty: Math.min(MAX_QTY, qty) } : l; })
                   .filter(function (l) { return l.qty > 0; });
      write(lines);
    },
    increase: function (id) {
      var p = S.getProduct(id);
      var targetId = p ? p.id : id;
      var l = this.lines().filter(function (x) { return x.id === targetId; })[0];
      if (l) this.setQty(targetId, l.qty + 1);
    },
    decrease: function (id) {
      var p = S.getProduct(id);
      var targetId = p ? p.id : id;
      var l = this.lines().filter(function (x) { return x.id === targetId; })[0];
      if (l) this.setQty(targetId, l.qty - 1);
    },
    remove: function (id) {
      var p = S.getProduct(id);
      var targetId = p ? p.id : id;
      write(this.lines().filter(function (l) { return l.id !== targetId; }));
    },
    clear: function () { write([]); }
  };

  S.cart = Cart;

  /* Header badge — shared by every page */
  function renderBadge() {
    var n = Cart.count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n > 99 ? '99+' : n;
      el.hidden = n === 0;
    });
    document.querySelectorAll('[data-cart-link]').forEach(function (el) {
      el.setAttribute('aria-label', 'Cart, ' + n + (n === 1 ? ' item' : ' items'));
    });
  }
  S.bumpCartIcon = function () {
    document.querySelectorAll('[data-cart-link]').forEach(function (el) {
      el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump');
    });
  };

  document.addEventListener('cart:change', renderBadge);
  window.addEventListener('storage', function (e) { if (e.key === KEY) { renderBadge(); emit(); } });
  document.addEventListener('DOMContentLoaded', renderBadge);
  if (document.readyState !== 'loading') renderBadge();
})();
