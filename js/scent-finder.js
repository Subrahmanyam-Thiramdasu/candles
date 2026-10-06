/* ==========================================================================
   SCENTAVELLE — "Find Your Scent" quiz
   Two questions (mood + fragrance family) -> best matching candle.
   Drop <div data-scent-finder></div> on any page to use it.
   ========================================================================== */
(function () {
  'use strict';
  var S = window.Scentavelle;
  var esc = S.esc;

  var MOODS = [['relaxation', 'Relaxation'], ['romance', 'Romance'], ['freshness', 'Freshness'], ['warmth', 'Warmth'], ['focus', 'Focus'], ['luxury', 'Luxury']];
  var FAMILIES = [['floral', 'Floral'], ['woody', 'Woody'], ['fresh', 'Fresh'], ['citrus', 'Citrus'], ['sweet', 'Sweet'], ['earthy', 'Earthy']];

  function chips(name, list) {
    return list.map(function (o, i) {
      return '<label class="chip"><input type="radio" name="' + name + '" value="' + o[0] + '" required><span>' + o[1] + '</span></label>';
    }).join('');
  }

  function score(p, mood, fam) {
    var s = 0;
    if (p.finder.mood.indexOf(mood) > -1) s += 3;
    if (p.finder.family.indexOf(fam) > -1) s += 2;
    // first-listed mood/family is the product's strongest match
    if (p.finder.mood[0] === mood) s += 1;
    if (p.finder.family[0] === fam) s += 1;
    return s + p.popularity / 1000;
  }

  function match(mood, fam) {
    return S.products
      .filter(function (p) { return p.category === 'Candle'; })
      .map(function (p) { return { p: p, s: score(p, mood, fam) }; })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (x) { return x.p; });
  }

  S.matchScents = match;
  S.findScent = function (opts) {
    var mood = opts && opts.mood ? opts.mood : opts;
    var fam = opts && opts.family ? opts.family : arguments[1];
    var list = match(mood, fam);
    return list[0] || null;
  };

  var roots = document.querySelectorAll('[data-scent-finder]');
  if (!roots.length) return;

  roots.forEach(function (root, n) {
    var uid = 'finder' + n;
    root.innerHTML =
      '<div class="finder">' +
        '<form class="finder__form" data-finder-form novalidate>' +
          '<fieldset class="finder__group"><legend><span class="finder__num">01</span> What mood are you looking for?</legend><div class="chips">' + chips(uid + '-mood', MOODS) + '</div></fieldset>' +
          '<fieldset class="finder__group"><legend><span class="finder__num">02</span> Preferred fragrance family</legend><div class="chips">' + chips(uid + '-fam', FAMILIES) + '</div></fieldset>' +
          '<p class="finder__error" role="alert" hidden>Choose a mood and a fragrance family to find your match.</p>' +
          '<button class="btn btn--primary" type="submit">Reveal my scent match <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></button>' +
        '</form>' +
        '<div class="finder__result" data-finder-result tabindex="-1" aria-live="polite" hidden></div>' +
      '</div>';

    var form = root.querySelector('[data-finder-form]');
    var result = root.querySelector('[data-finder-result]');
    var err = root.querySelector('.finder__error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var mood = (form.querySelector('input[name="' + uid + '-mood"]:checked') || {}).value;
      var fam = (form.querySelector('input[name="' + uid + '-fam"]:checked') || {}).value;
      if (!mood || !fam) { err.hidden = false; return; }
      err.hidden = true;
      var list = match(mood, fam);
      var best = list[0], alts = list.slice(1, 3);
      var pos = (best.imagePos && best.imagePos[0]) || '50% 50%';
      result.innerHTML =
        '<div class="finder__match">' +
          '<div class="finder__img"><img src="' + best.images[0] + '" alt="' + esc(best.name) + ' scented candle" loading="lazy" style="object-position:' + pos + '"></div>' +
          '<div class="finder__info">' +
            '<p class="eyebrow">Your Scent Match</p>' +
            '<h3 class="finder__name">' + esc(best.name) + '</h3>' +
            '<p class="finder__line">“' + esc(best.finderLine) + '”</p>' +
            '<p class="finder__notes">' + esc(best.notes.join(' • ')) + '</p>' +
            '<p class="finder__price">' + S.formatPrice(best.price) + '</p>' +
            '<div class="btn-row">' +
              '<a class="btn btn--primary" href="' + S.productUrl(best) + '">Shop ' + esc(best.name) + ' <svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></a>' +
              '<button class="btn btn--outline" type="button" data-add-to-cart data-id="' + best.id + '"><span data-label>Add to cart</span></button>' +
            '</div>' +
            '<p class="finder__alts">Also consider: ' + alts.map(function (a) { return '<a href="' + S.productUrl(a) + '">' + esc(a.name) + '</a>'; }).join(' · ') + '</p>' +
            '<button class="finder__reset" type="button" data-finder-reset>Start again</button>' +
          '</div>' +
        '</div>';
      form.hidden = true; result.hidden = false;
      result.classList.remove('is-in'); void result.offsetWidth; result.classList.add('is-in');
      result.focus({ preventScroll: true });
    });

    result.addEventListener('click', function (e) {
      if (e.target.closest('[data-finder-reset]')) {
        form.reset(); result.hidden = true; form.hidden = false;
        form.querySelector('input').focus();
      }
    });
  });
})();
