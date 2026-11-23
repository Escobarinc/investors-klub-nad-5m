/* Private Capital Circle — hlavička na podstránkách: stav člena (menu / Login / Odhlásit) a mobilní menu. */
(() => {
  'use strict';
  const KEY = 'ik5m-access-granted';
  let member = false;
  try { member = localStorage.getItem(KEY) === '1'; } catch (e) { /* storage blocked */ }
  document.body.classList.toggle('access-locked', !member);
  document.body.classList.toggle('is-member', member);

  document.querySelectorAll('.js-logout').forEach((b) => b.addEventListener('click', () => {
    try { localStorage.removeItem(KEY); } catch (e) { /* storage blocked */ }
    location.href = 'index.html';
  }));

  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('main-nav');
  if (!toggle || !menu) return;
  const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Otevřít navigaci'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zavřít navigaci' : 'Otevřít navigaci');
  });
  document.addEventListener('click', (e) => { if (!menu.contains(e.target) && !toggle.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  addEventListener('resize', () => { if (innerWidth > 820) close(); });
})();
