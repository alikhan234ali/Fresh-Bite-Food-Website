/**
 * Fresh Bite — Menu item detail modal (menu.html)
 * Redesigned with side-by-side layout, category tag, and polished animations.
 */
(function () {
  'use strict';

  const modal = document.getElementById('menu-modal');
  if (!modal) return;

  const dialog = modal.querySelector('[data-modal-dialog]');
  const backdrop = modal.querySelector('[data-modal-backdrop]');
  const closeButtons = modal.querySelectorAll('[data-modal-close]');
  const imageEl = document.getElementById('menu-modal-image');
  const titleEl = document.getElementById('menu-modal-title');
  const priceEl = document.getElementById('menu-modal-price');
  const descriptionEl = document.getElementById('menu-modal-description');
  const categoryEl = document.getElementById('menu-modal-category');
  const ingredientsList = document.getElementById('menu-modal-ingredients');
  const orderBtn = modal.querySelector('[data-modal-order]');
  const cards = document.querySelectorAll('[data-menu-card]');

  if (!cards.length) return;

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let lastFocused = null;

  /* ── Helpers ─────────────────────────────────────────────── */

  function getFocusable(container) {
    return [...container.querySelectorAll(FOCUSABLE)].filter(
      (el) => !el.hasAttribute('disabled')
    );
  }

  function trapFocus(e) {
    if (modal.classList.contains('hidden') || e.key !== 'Tab') return;
    const focusable = getFocusable(dialog);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function largeImageUrl(src) {
    return src ? src.replace(/w=\d+&h=\d+/, 'w=1200&h=1600') : '';
  }

  function categoryLabel(cat) {
    const map = {
      starters: 'Starters',
      mains: 'Main Course',
      desserts: 'Desserts',
      drinks: 'Drinks',
    };
    return map[cat] || cat || '';
  }

  function renderIngredients(raw) {
    ingredientsList.innerHTML = '';
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((item) => {
        const li = document.createElement('li');
        li.className =
          'inline-flex items-center gap-1.5 rounded-full border border-accent-gold/15 bg-accent-gold/[0.06] px-3.5 py-1.5 text-[13px] font-medium text-neutral-700 transition-colors duration-200 hover:border-accent-gold/25 hover:bg-accent-gold/[0.1]';
        li.textContent = item;
        ingredientsList.appendChild(li);
      });
  }

  /* ── Open / Close ────────────────────────────────────────── */

  function openModal(card) {
    const img = card.querySelector('img');
    const name = card.dataset.name || '';
    const price = card.dataset.price || '';
    const description = card.dataset.description || '';
    const ingredients = card.dataset.ingredients || '';
    const category = card.dataset.category || '';

    // Populate content
    imageEl.src = largeImageUrl(img?.src || '');
    imageEl.alt = name;
    titleEl.textContent = name;
    priceEl.textContent = price;
    descriptionEl.textContent = description;
    categoryEl.textContent = categoryLabel(category);
    renderIngredients(ingredients);

    // Point order button to reservation
    if (orderBtn) {
      orderBtn.href = 'contact.html#reserve';
    }

    // Show modal
    lastFocused = document.activeElement;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');

    // Animate in (next frame so transitions fire)
    requestAnimationFrame(() => {
      backdrop.classList.remove('opacity-0');
      dialog.classList.remove('opacity-0', 'scale-[0.96]', 'translate-y-8');
      dialog.classList.add('opacity-100', 'scale-100', 'translate-y-0');
      modal.querySelector('button[data-modal-close]')?.focus();
    });

    document.addEventListener('keydown', onKeydown);
    document.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    // Animate out
    backdrop.classList.add('opacity-0');
    dialog.classList.add('opacity-0', 'scale-[0.96]', 'translate-y-8');
    dialog.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
    document.body.classList.remove('overflow-hidden');
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('keydown', trapFocus);

    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modal.setAttribute('aria-hidden', 'true');
      imageEl.removeAttribute('src');
      lastFocused?.focus();
      lastFocused = null;
    }, 350);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeModal();
  }

  /* ── Card click handlers ─────────────────────────────────── */

  cards.forEach((card) => {
    // Click anywhere on card (except Order Now button) opens modal
    card.addEventListener('click', (e) => {
      if (e.target.closest('.order-now-btn')) return;
      openModal(card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  // "Order Now" buttons / links inside cards → open modal instead of navigating
  document.querySelectorAll('[data-menu-card]').forEach((card) => {
    card.addEventListener('click', (e) => {
      const target = e.target;
      const orderEl = target && target.closest ? target.closest('a[href], button') : null;
      if (!orderEl) return;

      const text = (orderEl.textContent || '').trim().toLowerCase();
      if (text !== 'order now') return;

      e.preventDefault();
      e.stopPropagation();
      openModal(card);
    });
  });

  /* ── Close button handlers ───────────────────────────────── */

  closeButtons.forEach((btn) => btn.addEventListener('click', closeModal));

  // Close when clicking backdrop
  backdrop?.addEventListener('click', closeModal);
})();