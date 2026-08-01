/* =============================================
   MAIN.JS — Loading, nav, cursor, dark mode,
   smooth scroll, back-to-top, contact form
   ============================================= */

(function () {
  'use strict';

  /* ---- Loading Screen ---- */
  function initLoading() {
    const screen = document.getElementById('loadingScreen');
    if (!screen) return;

    document.body.classList.add('loading');

    window.addEventListener('load', () => {
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 2200);
    });

    // Fallback in case 'load' already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 2200);
    }
  }

  /* ---- Navbar ---- */
  function initNavbar() {
    const navbar   = document.getElementById('navbar');
    const toggle   = document.getElementById('navToggle');
    const menu     = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    // Scroll glass effect
    function onScroll() {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      updateActiveLink();
      toggleBackToTop();
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile toggle
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });

      // Close on link click
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Active link on scroll
    function updateActiveLink() {
      const sections = document.querySelectorAll('section[id]');
      const scrollY  = window.scrollY + 100;

      sections.forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }
  }

  /* ---- Custom Cursor ---- */
  function initCursor() {
    // Only on pointer-fine (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth follower
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.14;
      followerY += (mouseY - followerY) * 0.14;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover state on interactive elements
    const interactives = 'a, button, .filter-btn, .project-card, .nav-link, .skill-tag, .contact-item, .cert-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactives)) {
        cursor.classList.add('hovered');
        follower.classList.add('hovered');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactives)) {
        cursor.classList.remove('hovered');
        follower.classList.remove('hovered');
      }
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity   = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity   = '1';
      follower.style.opacity = '1';
    });
  }

  /* ---- Dark / Light Mode ---- */
  function initTheme() {
    const toggle  = document.getElementById('themeToggle');
    const icon    = document.getElementById('themeIcon');
    const htmlEl  = document.documentElement;

    const STORAGE_KEY = 'km-theme';
    const saved = localStorage.getItem(STORAGE_KEY);

    function applyTheme(theme) {
      htmlEl.setAttribute('data-theme', theme);
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
      localStorage.setItem(STORAGE_KEY, theme);
    }

    // Apply saved or system preference
    if (saved) {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }

    if (toggle) {
      toggle.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme');
        const next    = current === 'dark' ? 'light' : 'dark';
        document.body.classList.add('theme-transitioning');
        applyTheme(next);
        setTimeout(() => document.body.classList.remove('theme-transitioning'), 450);
      });
    }
  }

  /* ---- Smooth Scroll (for older browsers without native smooth) ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 70; // navbar height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ---- Back to Top ---- */
  function toggleBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Contact Form ---- */
  function initContactForm() {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    if (!form) return;

    function showError(id, msg) {
      const el = document.getElementById(id);
      const input = document.getElementById(id.replace('Error', '').replace('contact', 'contact'));
      if (el)    { el.textContent = msg; }
    }
    function clearErrors() {
      ['nameError','emailError','subjectError','messageError'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
      });
      form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('error'));
    }

    function validate() {
      clearErrors();
      let valid = true;

      const name    = document.getElementById('contactName');
      const email   = document.getElementById('contactEmail');
      const subject = document.getElementById('contactSubject');
      const message = document.getElementById('contactMessage');

      if (!name.value.trim()) {
        showError('nameError', 'Please enter your name.');
        name.classList.add('error'); valid = false;
      }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError('emailError', 'Please enter a valid email address.');
        email.classList.add('error'); valid = false;
      }
      if (!subject.value.trim()) {
        showError('subjectError', 'Please enter a subject.');
        subject.classList.add('error'); valid = false;
      }
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError('messageError', 'Please enter a message (min 10 characters).');
        message.classList.add('error'); valid = false;
      }
      return valid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;

      // Simulate send (no backend)
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      setTimeout(() => {
        form.reset();
        clearErrors();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        if (success) {
          success.hidden = false;
          setTimeout(() => { success.hidden = true; }, 5000);
        }
      }, 1800);
    });

    // Real-time validation clear
    const errorMap = {
      contactName:    'nameError',
      contactEmail:   'emailError',
      contactSubject: 'subjectError',
      contactMessage: 'messageError',
    };
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errId = errorMap[input.id];
        if (errId) {
          const errEl = document.getElementById(errId);
          if (errEl) errEl.textContent = '';
        }
      });
    });
  }

  /* ---- Keyboard nav close menu ---- */
  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const menu   = document.getElementById('navMenu');
        const toggle = document.getElementById('navToggle');
        if (menu && menu.classList.contains('open')) {
          menu.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      }
    });
  }

  /* ---- Init ---- */
  function init() {
    initLoading();
    initNavbar();
    initCursor();
    initTheme();
    initSmoothScroll();
    initBackToTop();
    initContactForm();
    initKeyboardNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
