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

  // Schedule switch (standard / holiday)
  var schedule = document.getElementById('schedule');
  if (schedule) {
    var switchBtns = schedule.querySelectorAll('.schedule-switch__btn');
    var panels = schedule.querySelectorAll('.schedule-panel');
    var ready = false;

    function showSchedule(target) {
      switchBtns.forEach(function (b) {
        var on = b.getAttribute('data-target') === target;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      panels.forEach(function (p) {
        var on = p.id === target;
        p.hidden = !on;
        // A panel hidden on load is never seen by IntersectionObserver,
        // so reveal its contents directly the first time it is shown.
        if (on && ready) {
          p.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
        }
      });
    }

    switchBtns.forEach(function (b) {
      b.addEventListener('click', function () { showSchedule(b.getAttribute('data-target')); });
    });

    // During the Polish summer break (Jun–Aug) open the holiday schedule by default.
    var month = new Date().getMonth();
    showSchedule(month >= 5 && month <= 7 ? 'schedule-holiday' : 'schedule-regular');
    ready = true;
  }

  var form = document.getElementById('signupForm');
  var status = document.getElementById('signupStatus');

  function showStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('form__status--error', !!isError);
    status.hidden = false;
  }

  if (form && status && window.fetch) {
    var submitBtn = form.querySelector('.form__submit');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wysyłanie…';
      fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        showStatus('Dziękujemy! Zgłoszenie zostało wysłane — odezwiemy się, aby potwierdzić zapis.');
      }).catch(function () {
        showStatus('Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub napisz do nas na Instagramie @rksreda.', true);
      }).then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Wyślij zgłoszenie';
      });
    });
  }

  if (window.location.search.indexOf('zapis=ok') !== -1) {
    showStatus('Dziękujemy! Zgłoszenie zostało wysłane — odezwiemy się, aby potwierdzić zapis.');
  }

  // Current year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
