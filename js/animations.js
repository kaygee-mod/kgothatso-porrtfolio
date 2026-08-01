/* =============================================
   ANIMATIONS.JS — Scroll reveals, skill bars,
   project filter, modals, ripple, counters
   ============================================= */

(function () {
  'use strict';

  /* ---- Scroll Reveal ---- */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => obs.observe(el));
  }

  /* ---- Skill Bars ---- */
  function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill  = entry.target;
          const width = fill.getAttribute('data-width') + '%';
          // Small delay so transition is visible
          setTimeout(() => { fill.style.width = width; }, 200);
          obs.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(f => obs.observe(f));
  }

  /* ---- Counter Animation ---- */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => obs.observe(c));
  }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ---- Project Filter ---- */
  function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        cards.forEach(card => {
          const cats = card.getAttribute('data-category') || '';
          const show = filter === 'all' || cats.includes(filter);

          if (show) {
            card.classList.remove('hidden');
            // Tiny stagger fade-in
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96)';
            requestAnimationFrame(() => {
              setTimeout(() => {
                card.style.opacity = '';
                card.style.transform = '';
              }, 40);
            });
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---- Project Modals ---- */
  const modalData = {
    cyber: {
      title: 'Cybersecurity Mini Projects',
      meta:  ['Python', 'Security', 'Beginner Portfolio'],
      overview: 'A collection of beginner-friendly cybersecurity applications built in Python to demonstrate understanding of core security concepts and programming fundamentals.',
      problem:  'Learning cybersecurity concepts is most effective through hands-on implementation. The challenge was to build practical tools that demonstrate real security concepts while practising Python programming.',
      solution: 'Built three focused tools: a Password Generator using Python\'s secrets module, a Password Strength Checker with scoring logic, and a File Encryption Tool using the cryptography library.',
      features: ['Strong password generation with customisable length', 'Password strength evaluation with detailed feedback', 'File encryption and decryption using Fernet (symmetric encryption)', 'Input validation and error handling', 'Console-based user interface'],
      tech:     ['Python', 'cryptography library', 'secrets module', 'File I/O', 'Input validation'],
      challenges: 'Understanding cryptographic principles and implementing them correctly in Python. Balancing security best practices with beginner-friendly code structure.',
      lessons: 'Gained solid understanding of symmetric encryption, the importance of randomness in password generation, and how to provide meaningful security feedback to users.',
      future: 'Add a GUI using Tkinter, implement asymmetric encryption options, and extend the password strength checker with breach database lookups.',
    },
    pyfund: {
      title: 'Python Fundamentals Projects',
      meta:  ['Python', 'FNB Academy', 'Programming Fundamentals'],
      overview: 'A collection of beginner Python applications created during and after the FNB App Academy Certification Masterclass, demonstrating programming logic, user interaction, and string manipulation.',
      problem:  'Needed to solidify Python fundamentals through practical application — moving from syntax knowledge to building working programs that solve real problems.',
      solution: 'Built three practical tools: a Password & Email Generator, a Petrol Cost Calculator, and a Tip Calculator — each focusing on specific programming concepts.',
      features: ['Username generation from initials and surname', 'Email format generation', 'Road trip fuel cost estimation', 'Restaurant tip calculation with formatted output', 'Input validation and rounding logic'],
      tech:     ['Python', 'String manipulation', 'Mathematical operations', 'Input/Output', 'Conditional logic'],
      challenges: 'Structuring logic cleanly without using advanced features — keeping code readable and well-commented while handling edge cases in user input.',
      lessons: 'Strengthened understanding of Python basics — variables, data types, string formatting, mathematical operations, and writing clean, readable code.',
      future: 'Package all tools into a unified CLI menu, add unit tests using pytest, and extend the calculators with more configuration options.',
    },
    foods: {
      title: 'WPR261 — Unusual Foods Around Us',
      meta:  ['HTML', 'CSS', 'JavaScript', 'Belgium Campus'],
      overview: 'An interactive web application developed for the WPR261 module, exploring unusual and traditional foods found across South Africa and neighbouring countries.',
      problem:  'Required a dynamic, interactive web application that allows users to explore, search, compare, and save information about unusual foods — built entirely with vanilla HTML, CSS, and JavaScript.',
      solution: 'Designed a responsive single-page application with a dynamic food database, live search functionality, and a comparison feature, all powered by DOM manipulation.',
      features: ['Dynamic food search with instant filtering', 'Detailed food information display', 'Favourite foods list with local storage persistence', 'Side-by-side food comparison feature', 'Printable food listings', 'Responsive design for all screen sizes'],
      tech:     ['HTML5', 'CSS3', 'JavaScript (ES6)', 'DOM Manipulation', 'Local Storage', 'Responsive Design'],
      challenges: 'Implementing smooth DOM manipulation for real-time filtering without a framework, and designing a comparison UI that works across different screen sizes.',
      lessons: 'Deepened understanding of DOM manipulation, event-driven programming, local storage, and building interactive UIs from scratch without any libraries.',
      future: 'Add an API backend with a larger food database, user accounts, ratings, and an image gallery for each food entry.',
    },
    lecturer: {
      title: 'INL261 — AI-Assisted Animated Lecturer Portfolio',
      meta:  ['HTML', 'CSS', 'JavaScript', 'Group Project', 'GitHub Pages'],
      overview: 'An animated single-page portfolio website built as a group project for Belgium Campus, developed using AI-assisted code generation and deployed via GitHub Pages.',
      problem:  'Needed to collaboratively build a polished, animated web portfolio for a lecturer — coordinating a team, using Git for version control, and delivering a professional final product.',
      solution: 'Used AI-assisted development (Claude Artifacts) to accelerate prototyping while maintaining code quality. Applied Git workflows for collaboration and deployed to GitHub Pages.',
      features: ['Modern animated single-page layout', 'Smooth scrolling navigation', 'Interactive animations and transitions', 'Responsive UI for all devices', 'AI-assisted code generation workflow', 'Version controlled with Git'],
      tech:     ['HTML5', 'CSS3', 'JavaScript', 'Claude AI (Artifacts)', 'Git', 'GitHub Pages'],
      challenges: 'Coordinating team members with different skill levels, merging code from multiple contributors without conflicts, and integrating AI-generated code with custom improvements.',
      lessons: 'Gained experience in team collaboration, Git workflows for group projects, AI-assisted development practices, and static website deployment via GitHub Pages.',
      future: 'Extend with a CMS for content updates, add more interactive sections, and implement a blog for research publications.',
    },
  };

  function openModal(projectKey) {
    const data    = modalData[projectKey];
    if (!data) return;

    const overlay = document.getElementById('modalOverlay');
    const body    = document.getElementById('modalBody');
    if (!overlay || !body) return;

    body.innerHTML = `
      <h2>${data.title}</h2>
      <div class="modal-meta">
        ${data.meta.map(m => `<span><i class="fas fa-tag" style="color:var(--accent-blue);margin-right:4px"></i>${m}</span>`).join('')}
      </div>
      <h4>Overview</h4><p>${data.overview}</p>
      <h4>Problem</h4><p>${data.problem}</p>
      <h4>Solution</h4><p>${data.solution}</p>
      <h4>Key Features</h4>
      <ul>${data.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <h4>Technologies Used</h4>
      <div class="modal-tech-tags">${data.tech.map(t => `<span>${t}</span>`).join('')}</div>
      <h4>Challenges</h4><p>${data.challenges}</p>
      <h4>Lessons Learned</h4><p>${data.lessons}</p>
      <h4>Future Improvements</h4><p>${data.future}</p>
    `;

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    overlay.setAttribute('aria-hidden', 'false');

    // Focus the close button
    setTimeout(() => {
      const closeBtn = document.getElementById('modalClose');
      if (closeBtn) closeBtn.focus();
    }, 50);
  }

  function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    overlay.setAttribute('aria-hidden', 'true');
  }

  function initModals() {
    // All "Read More" buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.read-more-btn');
      if (btn) {
        e.preventDefault();
        openModal(btn.getAttribute('data-project'));
      }
    });

    // Close button
    const closeBtn = document.getElementById('modalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Click overlay to close
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ---- Ripple Effect ---- */
  function initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.ripple');
      if (!btn) return;

      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  }

  /* ---- Journey Timeline Stagger ---- */
  function initJourneyTimeline() {
    const items = document.querySelectorAll('.htimeline-item');
    if (!items.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const allItems = document.querySelectorAll('.htimeline-item');
          allItems.forEach((item, i) => {
            setTimeout(() => item.classList.add('visible'), i * 120);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 });

    obs.observe(items[0]);
  }

  /* ---- Init all ---- */
  function init() {
    initScrollReveal();
    initSkillBars();
    initCounters();
    initProjectFilter();
    initModals();
    initRipple();
    initJourneyTimeline();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
