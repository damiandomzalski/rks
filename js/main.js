(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var backdrop = document.getElementById('navBackdrop');

  // Sticky nav background on scroll
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    links.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    document.body.classList.toggle('no-scroll', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    if (open) {
      backdrop.hidden = false;
      requestAnimationFrame(function () { backdrop.classList.add('show'); });
    } else {
      backdrop.classList.remove('show');
      setTimeout(function () { if (!menuOpen) backdrop.hidden = true; }, 320);
    }
  }

  toggle.addEventListener('click', function () { setMenu(!menuOpen); });
  backdrop.addEventListener('click', function () { setMenu(false); });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (menuOpen && window.innerWidth > 760) setMenu(false);
  });

  // Scroll-reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Current year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
