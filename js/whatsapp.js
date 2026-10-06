/* ==========================================================================
   SCENTAVELLE — WhatsApp helpers
   Builds pre-filled, correctly URL-encoded messages and opens
   https://wa.me/917569403967?text=...
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Scentavelle;
  var cfg = S.config;
  var OWNER = cfg.owner;

  function link(message) {
    return 'https://wa.me/' + cfg.whatsapp + (message ? '?text=' + encodeURIComponent(message) : '');
  }

  /** Opens WhatsApp in a new tab (falls back to same-tab if a popup blocker interferes). */
  function open(message) {
    var url = link(message);
    var w = null;
    try { w = window.open(url, '_blank', 'noopener'); } catch (e) { w = null; }
    if (!w) window.location.href = url;
    return url;
  }

  function line(label, value) { return value ? label + ': ' + value : null; }
  /* null/undefined/false lines are dropped; '' is kept as an intentional blank line */
  function compact(lines) { return lines.filter(function (l) { return l !== null && l !== undefined && l !== false; }).join('\n'); }
  function prettyDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  var M = {};

  M.generic = function () {
    return 'Hello ' + OWNER + ',\nI would like to know more about Scentavelle candles.\nThank you.';
  };

  /** Single product quick order */
  M.quickOrder = function (p, qty) {
    return compact([
      'Hello ' + OWNER + ',',
      'I am interested in:',
      'Product: ' + p.name,
      'Price: ' + S.formatPrice(p.price),
      'Quantity: ' + (qty || 1),
      'Please share availability and delivery details.',
      'Thank you.'
    ]);
  };

  /** Full cart order */
  M.cartOrder = function (items, info) {
    info = info || {};
    var sub = items.reduce(function (n, i) { return n + i.lineTotal; }, 0);
    var shipLine = sub >= cfg.freeShippingAbove ? 'Shipping: Free' : 'Shipping: To be confirmed (free above ' + S.formatPrice(cfg.freeShippingAbove) + ')';
    var rows = items.map(function (i) {
      var each = S.formatPrice(i.product.price);
      return i.qty + ' × ' + i.product.name + ' — ' + each + (i.qty > 1 ? ' each (' + S.formatPrice(i.lineTotal) + ')' : '');
    });
    var delivery = compact([
      line('Address', info.address),
      line('City', info.city),
      line('Pincode', info.pincode)
    ]);
    return compact([
      'Hello ' + OWNER + ',',
      'I would like to place an order from Scentavelle.',
      '',
      line('Name', info.name),
      line('Phone', info.phone),
      info.name || info.phone ? '' : null,
      'Order:',
      rows.join('\n'),
      '',
      'Subtotal: ' + S.formatPrice(sub),
      shipLine,
      'Total: ' + S.formatPrice(sub),
      delivery ? '\nDelivery details:\n' + delivery : null,
      info.giftMessage ? '\nGift message: ' + info.giftMessage : null,
      info.note ? '\nNote: ' + info.note : null,
      '',
      'Please confirm availability and delivery details.',
      'Thank you.'
    ]);
  };

  M.bulk = function (d) {
    return compact([
      'Hello ' + OWNER + ',',
      'I am interested in a bulk candle order.',
      '',
      line('Name', d.name),
      line('Company', d.company),
      line('Phone', d.phone),
      line('Email', d.email),
      line('Order Type', d.orderType),
      line('Quantity', d.quantity),
      line('Preferred Candle', d.candle),
      line('Budget Range', d.budget),
      line('Required Date', prettyDate(d.date)),
      line('Message', d.message),
      '',
      'Please share the bulk pricing and available options.',
      'Thank you.'
    ]);
  };

  M.contact = function (d) {
    return compact([
      'Hello ' + OWNER + ',',
      d.subject ? 'Subject: ' + d.subject : 'I have an enquiry for Scentavelle.',
      '',
      line('Name', d.name),
      line('Phone', d.phone),
      line('Email', d.email),
      line('Message', d.message),
      '',
      'Thank you.'
    ]);
  };

  M.customGift = function (d) {
    return compact([
      'Hello ' + OWNER + ',',
      'I would like to create a custom Scentavelle gift.',
      '',
      line('Name', d.name),
      line('Phone', d.phone),
      line('Occasion', d.occasion),
      line('Number of gifts', d.quantity),
      line('Preferred scents', d.candle),
      line('Budget', d.budget),
      line('Personalised message', d.giftMessage),
      line('Needed by', prettyDate(d.date)),
      '',
      'Please share options and pricing.',
      'Thank you.'
    ]);
  };

  S.wa = { link: link, open: open, messages: M };

  /* ----- Wire up generic WhatsApp links ----- */
  document.querySelectorAll('[data-wa-generic]').forEach(function (a) { a.href = link(M.generic()); });

  /* ----- Product "Buy on WhatsApp" links rendered later get this handler ----- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-wa-product]');
    if (!a) return;
    var p = S.getProduct(a.getAttribute('data-wa-product'));
    if (!p) return;
    var qtyEl = document.querySelector('[data-qty-input]');
    var qty = a.hasAttribute('data-use-qty') && qtyEl ? parseInt(qtyEl.value, 10) || 1 : 1;
    a.href = link(M.quickOrder(p, qty));
  });

  /* ----- Enquiry forms: bulk / contact / custom gift ----- */
  function formData(form) {
    var d = {};
    new FormData(form).forEach(function (v, k) { d[k] = String(v).trim(); });
    return d;
  }

  document.querySelectorAll('form[data-wa-form]').forEach(function (form) {
    var kind = form.getAttribute('data-wa-form');
    var status = form.querySelector('[data-form-status]');
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var d = formData(form);
      var msg = kind === 'bulk' ? M.bulk(d) : kind === 'gift' ? M.customGift(d) : M.contact(d);
      var url = open(msg);
      if (status) {
        status.hidden = false;
        status.innerHTML = '<strong>Thank you' + (d.name ? ', ' + S.esc(d.name.split(' ')[0]) : '') + '.</strong> WhatsApp is opening with your enquiry pre-filled. ' +
          'If nothing opened, <a href="' + url + '" target="_blank" rel="noopener">tap here to continue on WhatsApp</a>.';
      }
    });
  });
})();
