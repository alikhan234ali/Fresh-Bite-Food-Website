/**
 * Fresh Bite — Main JavaScript
 * Loads reusable components, navbar, filters, and form handling.
 */
(function () {
  'use strict';

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const NAVBAR_FALLBACK = `
    <header id="site-navbar" class="fixed inset-x-0 top-0 z-50 bg-neutral-50/95 shadow-sm backdrop-blur-md" data-navbar>
      <div class="mx-auto flex h-16 max-w-8xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:h-20 lg:px-8">
        <a href="index.html" class="group flex shrink-0 items-center gap-2.5" aria-label="Fresh Bite — Home">
          <svg class="h-8 w-8 text-primary-500" data-nav-logo-icon viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M16 4C12 4 9 7 9 11c0 2 .5 3.5 1.5 5L16 28l5.5-12c1-1.5 1.5-3 1.5-5 0-4-3-7-7-7z" fill="currentColor" opacity="0.9" />
          </svg>
          <span class="font-display text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl" data-nav-logo-text>Fresh Bite</span>
        </a>
        <nav class="hidden flex-1 items-center justify-center gap-1 md:flex lg:gap-2" aria-label="Main navigation">
          <a href="index.html" data-nav-link="home" class="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-800 transition-colors hover:text-primary-500">Home</a>
          <a href="menu.html" data-nav-link="menu" class="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-800 transition-colors hover:text-primary-500">Menu</a>
          <a href="about.html" data-nav-link="about" class="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-800 transition-colors hover:text-primary-500">About</a>
          <a href="contact.html" data-nav-link="contact" class="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-800 transition-colors hover:text-primary-500">Contact</a>
        </nav>
        <a href="contact.html#reserve" class="hidden shrink-0 items-center justify-center rounded-full bg-accent-terracotta px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg md:inline-flex">Reserve Table</a>
      </div>
    </header>`;

  const FOOTER_FALLBACK = `
    <footer class="bg-gradient-to-b from-primary-700 to-primary-900 text-neutral-50" aria-label="Site footer">
      <div class="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div class="sm:col-span-2 lg:col-span-1">
            <a href="index.html" class="inline-flex items-center gap-2.5">
              <svg class="h-8 w-8 text-accent-gold-light" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 4C12 4 9 7 9 11c0 2 .5 3.5 1.5 5L16 28l5.5-12c1-1.5 1.5-3 1.5-5 0-4-3-7-7-7z" fill="currentColor" opacity="0.9" />
              </svg>
              <span class="font-display text-2xl font-bold text-white">Fresh Bite</span>
            </a>
            <p class="mt-3 max-w-xs text-sm leading-relaxed text-white/70">Farm-to-table dining crafted with passion.</p>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-accent-gold-light">Explore</h3>
            <ul class="mt-4 space-y-3">
              <li><a href="index.html" class="text-sm text-white/70 transition-colors hover:text-white">Home</a></li>
              <li><a href="menu.html" class="text-sm text-white/70 transition-colors hover:text-white">Menu</a></li>
              <li><a href="about.html" class="text-sm text-white/70 transition-colors hover:text-white">About</a></li>
              <li><a href="contact.html" class="text-sm text-white/70 transition-colors hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-accent-gold-light">Hours</h3>
            <ul class="mt-4 space-y-2 text-sm text-white/70">
              <li>Mon – Fri: 11 AM – 10 PM</li>
              <li>Sat – Sun: 10 AM – 11 PM</li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-accent-gold-light">Contact</h3>
            <p class="mt-4 text-sm text-white/70">123 Gourmet Avenue<br />Downtown, Your City</p>
          </div>
        </div>
      </div>
    </footer>`;

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
      container.innerHTML = containerId === 'navbar-container' ? NAVBAR_FALLBACK : FOOTER_FALLBACK;
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

    function setNavbarScrolled(scrolled) {
      if (!navbar) return;

      scrolledClasses.forEach((c) => navbar.classList.toggle(c, scrolled));

      // White text when transparent, dark text when scrolled
      logoIcon?.classList.toggle('text-white', !scrolled);
      logoIcon?.classList.toggle('text-primary-500', scrolled);
      logoText?.classList.toggle('text-white', !scrolled);
      logoText?.classList.toggle('text-neutral-900', scrolled);
      hamburger?.classList.toggle('text-white', !scrolled);
      hamburger?.classList.toggle('text-neutral-900', scrolled);

      navLinks.forEach((link) => {
        link.classList.toggle('text-white/90', !scrolled);
        link.classList.toggle('hover:text-accent-gold-light', !scrolled);
        link.classList.toggle('text-neutral-800', scrolled);
        link.classList.toggle('hover:text-primary-500', scrolled);
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

    onScroll();

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
