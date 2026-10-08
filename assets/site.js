const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-nav');
function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('is-open');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 861px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('[data-category]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  projectCards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  const visibleCount = projectCards.filter(card => !card.hidden).length;
  document.querySelector('#filter-status').textContent = `${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'} shown`;
}));

document.querySelector('[data-copy-email]')?.addEventListener('click', async event => {
  const button = event.currentTarget;
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(button.dataset.copyEmail);
    status.textContent = 'Email address copied.';
    button.textContent = 'Copied ✓';
  } catch {
    status.textContent = 'Select the email address above to copy it, or use the email link.';
  }
});
