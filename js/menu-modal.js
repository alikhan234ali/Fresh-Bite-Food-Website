/**
 * Fresh Bite — Menu item detail modal (menu.html)
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
  const ingredientsList = document.getElementById('menu-modal-ingredients');
  const cards = document.querySelectorAll('[data-menu-card]');

  if (!cards.length) return;

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let lastFocused = null;

  function getFocusable(container) {
    return [...container.querySelectorAll(FOCUSABLE)].filter((el) => !el.hasAttribute('disabled'));
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
    return src ? src.replace(/w=\d+/, 'w=1200') : '';
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
          'inline-flex rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700';
        li.textContent = item;
        ingredientsList.appendChild(li);
      });
  }

  function openModal(card) {
    const img = card.querySelector('img');
    const name = card.dataset.name || '';
    const price = card.dataset.price || '';
    const description = card.dataset.description || '';
    const ingredients = card.dataset.ingredients || '';

    imageEl.src = largeImageUrl(img?.src || '');
    imageEl.alt = name;
    titleEl.textContent = name;
    priceEl.textContent = price;
    descriptionEl.textContent = description;
    renderIngredients(ingredients);

    lastFocused = document.activeElement;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');

    requestAnimationFrame(() => {
      backdrop.classList.remove('opacity-0');
      dialog.classList.remove('opacity-0', 'scale-95', 'translate-y-4');
      dialog.classList.add('opacity-100', 'scale-100', 'translate-y-0');
      modal.querySelector('button[data-modal-close]')?.focus();
    });

    document.addEventListener('keydown', onKeydown);
    document.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    backdrop.classList.add('opacity-0');
    dialog.classList.add('opacity-0', 'scale-95', 'translate-y-4');
    dialog.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
    document.body.classList.remove('overflow-hidden');
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('keydown', trapFocus);

    setTimeout(() => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      imageEl.removeAttribute('src');
      lastFocused?.focus();
      lastFocused = null;
    }, 300);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeModal();
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  closeButtons.forEach((btn) => btn.addEventListener('click', closeModal));
})();
