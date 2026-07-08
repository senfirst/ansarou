/* =========================================================
   AN'SAROUD DINE BAMBILOR — Script principal
   ========================================================= */

/* Image fallback helper */
function ph(el){ el.style.display='none'; var sib = el.nextElementSibling; if(sib && sib.classList.contains('ph-fallback')) sib.style.display='flex'; }

document.addEventListener('DOMContentLoaded', function () {

  /* Header scroll shadow */
  var header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* Mobile nav */
  var burger = document.getElementById('burgerBtn');
  var mobileNav = document.getElementById('mobileNav');
  var mobileClose = document.getElementById('mobileClose');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () { mobileNav.classList.add('open'); });
    if (mobileClose) mobileClose.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    });
  }

  /* Reveal on scroll */
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });

  /* Counter animation */
  function animateCount(el, target, dur) {
    dur = dur || 1500;
    var start = performance.now();
    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(step); else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  document.querySelectorAll('.hero .count').forEach(function (el) { animateCount(el, +el.dataset.target); });

  var statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.count-stat').forEach(function (num) { animateCount(num, +num.dataset.target); });
          statObs.unobserve(e.target);
        }
      });
    }, { threshold: .25 });
    statObs.observe(statsSection);
  }

  /* Gallery filter */
  var gfBtns = document.querySelectorAll('.gf-btn');
  var galleryItems = document.querySelectorAll('.masonry-item');
  gfBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      gfBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.dataset.filter;
      galleryItems.forEach(function (it) { it.style.display = (f === 'all' || it.dataset.cat === f) ? '' : 'none'; });
    });
  });

  /* Lightbox */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = document.getElementById('lbImg');
    var lbIdx = 0;
    function visItems() { return Array.from(galleryItems).filter(function (it) { return it.style.display !== 'none'; }); }
    function openLb(idx) {
      var vis = visItems();
      if (!vis.length) return;
      lbIdx = ((idx % vis.length) + vis.length) % vis.length;
      lbImg.src = vis[lbIdx].dataset.full || '';
      lbImg.alt = (vis[lbIdx].querySelector('img') && vis[lbIdx].querySelector('img').alt) || '';
      lb.classList.add('open');
    }
    galleryItems.forEach(function (it, idx) { it.addEventListener('click', function () { openLb(idx); }); });
    var lbClose = document.getElementById('lbClose');
    var lbPrev = document.getElementById('lbPrev');
    var lbNext = document.getElementById('lbNext');
    if (lbClose) lbClose.addEventListener('click', function () { lb.classList.remove('open'); });
    if (lbPrev) lbPrev.addEventListener('click', function () { openLb(lbIdx - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { openLb(lbIdx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') lb.classList.remove('open');
      if (e.key === 'ArrowRight') openLb(lbIdx + 1);
      if (e.key === 'ArrowLeft') openLb(lbIdx - 1);
    });
  }

  /* Testimonials carousel */
  var testiTrack = document.getElementById('testiTrack');
  if (testiTrack) {
    var testiSlides = document.querySelectorAll('.testi-slide');
    var testiDots = document.getElementById('testiDots');
    var testiIdx = 0, testiAuto;
    testiSlides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Témoignage ' + (i + 1));
      dot.addEventListener('click', function () { goToTesti(i); restartAuto(); });
      testiDots.appendChild(dot);
    });
    function goToTesti(i) {
      testiIdx = ((i % testiSlides.length) + testiSlides.length) % testiSlides.length;
      testiTrack.style.transform = 'translateX(-' + (testiIdx * 100) + '%)';
      testiDots.querySelectorAll('.testi-dot').forEach(function (d, di) { d.classList.toggle('active', di === testiIdx); });
    }
    var tPrev = document.getElementById('testiPrev');
    var tNext = document.getElementById('testiNext');
    if (tPrev) tPrev.addEventListener('click', function () { goToTesti(testiIdx - 1); restartAuto(); });
    if (tNext) tNext.addEventListener('click', function () { goToTesti(testiIdx + 1); restartAuto(); });
    function restartAuto() { clearInterval(testiAuto); testiAuto = setInterval(function () { goToTesti(testiIdx + 1); }, 6000); }
    restartAuto();
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (q) q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* Donation amount chips */
  document.querySelectorAll('.amount-row').forEach(function (row) {
    var chips = row.querySelectorAll('.amount-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var input = row.parentElement.querySelector('input[name="montant"]');
        if (input) input.value = chip.dataset.amount || '';
      });
    });
  });

  /* Generic form submit success (contact, adhésion, don, newsletter) */
  document.querySelectorAll('form[data-success-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var successBox = form.parentElement.querySelector('.form-success') || form.querySelector('.form-success');
      if (successBox) successBox.classList.add('show');
      var btn = form.querySelector('[type=submit]');
      if (btn) { btn.disabled = true; var original = btn.textContent; btn.textContent = 'Envoyé ✓'; setTimeout(function(){ btn.disabled=false; btn.textContent=original; },4000); }
      setTimeout(function () { form.reset(); }, 600);
    });
  });

  /* Newsletter mini-form in footer band */
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button');
      if (btn) { var orig = btn.textContent; btn.textContent = 'Merci ✓'; setTimeout(function () { btn.textContent = orig; }, 3000); }
      form.reset();
    });
  });

  /* Back to top */
  var fabTop = document.getElementById('fabTop');
  if (fabTop) {
    window.addEventListener('scroll', function () { fabTop.classList.toggle('show', window.scrollY > 600); }, { passive: true });
    fabTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* Active nav link (based on current page file name) */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

});
