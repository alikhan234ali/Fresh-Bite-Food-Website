/**
 * Fresh Bite — Main JavaScript
 * Loads reusable components, navbar, filters, and form handling.
 */
(function () {
  'use strict';

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* ── Load navbar & footer components ── */
  async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Failed to load ${filePath}`);
      container.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
      container.innerHTML = `<p class="p-4 text-center text-red-600">Could not load ${filePath}. Use a local server (e.g. Live Server).</p>`;
      return;
    }

    if (containerId === 'navbar-container') initNavbar();
  }

  /* ── Navbar ── */
  function initNavbar() {
    const navbar = document.querySelector('[data-navbar]');
    const drawer = document.querySelector('[data-nav-drawer]');
    const backdrop = document.querySelector('[data-nav-backdrop]');
    const hamburger = document.querySelector('[data-nav-hamburger]');
    const closeBtn = document.querySelector('[data-nav-close]');
    const logoIcon = document.querySelector('[data-nav-logo-icon]');
    const logoText = document.querySelector('[data-nav-logo-text]');
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const mobileLinks = document.querySelectorAll('[data-mobile-nav]');
    const isHome = document.body.dataset.page === 'home';
    const currentPage = document.body.dataset.page || '';

    const scrolledClasses = ['bg-neutral-50/95', 'backdrop-blur-md', 'shadow-sm'];
    const lightText = ['text-white/90', 'hover:text-accent-gold-light'];
    const darkText = ['text-neutral-800', 'hover:text-primary-500'];

    function setNavbarScrolled(scrolled) {
      if (!navbar) return;

      scrolledClasses.forEach((c) => navbar.classList.toggle(c, scrolled));

      const useDark = scrolled || !isHome;

      logoIcon?.classList.toggle('text-white', !useDark);
      logoIcon?.classList.toggle('text-primary-500', useDark);
      logoText?.classList.toggle('text-white', !useDark);
      logoText?.classList.toggle('text-neutral-900', useDark);
      hamburger?.classList.toggle('text-white', !useDark);
      hamburger?.classList.toggle('text-neutral-900', useDark);

      navLinks.forEach((link) => {
        lightText.forEach((c) => link.classList.toggle(c, !useDark));
        darkText.forEach((c) => link.classList.toggle(c, useDark));
      });
    }

    function highlightActiveLink() {
      const setActive = (link, page) => {
        const active = page === currentPage;
        link.classList.toggle('text-accent-gold', active && isHome && !navbar.classList.contains('bg-neutral-50/95'));
        link.classList.toggle('text-primary-500', active && (navbar.classList.contains('bg-neutral-50/95') || !isHome));
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      };

      navLinks.forEach((link) => setActive(link, link.dataset.navLink));
      mobileLinks.forEach((link) => setActive(link, link.dataset.mobileNav));
    }

    function onScroll() {
      setNavbarScrolled(window.scrollY > 48);
      highlightActiveLink();
    }

    if (!isHome) setNavbarScrolled(true);
    else onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    highlightActiveLink();

    function openDrawer() {
      drawer?.classList.remove('translate-x-full');
      drawer?.removeAttribute('inert');
      drawer?.setAttribute('aria-hidden', 'false');
      backdrop?.classList.remove('hidden');
      hamburger?.setAttribute('aria-expanded', 'true');
      document.body.classList.add('overflow-hidden');
    }

    function closeDrawer() {
      drawer?.classList.add('translate-x-full');
      drawer?.setAttribute('inert', '');
      drawer?.setAttribute('aria-hidden', 'true');
      backdrop?.classList.add('hidden');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overflow-hidden');
    }

    hamburger?.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);
    mobileLinks.forEach((link) => link.addEventListener('click', closeDrawer));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer?.classList.contains('translate-x-full')) {
        closeDrawer();
        hamburger?.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeDrawer();
    });
  }

  /* ── Menu category filter (menu.html) ── */
  function initMenuFilter() {
    const buttons = document.querySelectorAll('[data-filter]');
    const items = document.querySelectorAll('[data-category]');
    if (!buttons.length || !items.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('bg-primary-900', active);
          b.classList.toggle('text-white', active);
          b.classList.toggle('border-primary-900', active);
          b.classList.toggle('bg-white', !active);
          b.classList.toggle('text-neutral-800', !active);
          b.classList.toggle('border-neutral-200', !active);
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        items.forEach((item) => {
          const show = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('hidden', !show);
          item.setAttribute('aria-hidden', show ? 'false' : 'true');
        });
      });
    });
  }

  /* ── Contact form (contact.html) ── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');
    if (!form) return;

    function validateField(field) {
      const value = field.value.trim();
      const errorEl = document.getElementById(`${field.id}-error`);
      let valid = value.length > 0;

      if (field.type === 'email' && value) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      field.classList.toggle('border-accent-terracotta', !valid);
      field.classList.toggle('ring-accent-terracotta/20', !valid);
      field.setAttribute('aria-invalid', valid ? 'false' : 'true');
      errorEl?.classList.toggle('hidden', valid);
      return valid;
    }

    form.querySelectorAll('[data-validate]').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      let firstInvalid = null;

      form.querySelectorAll('[data-validate]').forEach((field) => {
        if (!validateField(field)) {
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!valid) {
        firstInvalid?.focus();
        return;
      }

      form.classList.add('hidden');
      success?.classList.remove('hidden');
      success?.focus();
    });
  }

  /* ── Stat counters (about.html) ── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1500;
          const start = performance.now();

          function animate(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          }

          requestAnimationFrame(animate);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('navbar-container', 'components/navbar.html');
    await loadComponent('footer-container', 'components/footer.html');
    initMenuFilter();
    initContactForm();
    initCounters();
  });
})();
