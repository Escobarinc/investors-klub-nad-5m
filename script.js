/* Investors Klub nad 5M — interakce webu.
 * Žádost o přístup se posílá jako lead do CRM (CLARIX) přes měřicí kód /api/t.js.
 * Klíč webu (site key) se získá v CRM: Nastavení → Weby a měření → Přidat web.
 * Dokud je klíč prázdný, formulář funguje jen jako ukázka a nic se neodesílá. */
(() => {
  'use strict';

  const CRM = { origin: 'https://clarix-crm.onrender.com', key: '' };
  const FORM_NAME = 'Investors Klub nad 5M – Žádost o privátní přístup';

  /* Přihlášení je zatím jen ukázkové (statický web nemá server pro účty).
   * Ukázkové údaje jsou v README.md. Skutečné přihlášení se napojí později. */
  const DEMO_LOGIN = { email: 'demo@investorsklub.cz', password: 'klub5m' };
  const ACCESS_KEY = 'ik5m-access-granted';

  const layer = document.getElementById('dialog-layer');
  const panel = document.getElementById('dialog-panel');
  const content = document.getElementById('dialog-content');
  const closeButton = document.getElementById('dialog-close');
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('main-nav');
  const heroShell = document.querySelector('.hero-shell');
  const INLINE = ['membership', 'login'];
  let previousFocus = null;

  function setLoggedIn(on) {
    document.body.classList.toggle('access-locked', !on);
    try { on ? localStorage.setItem(ACCESS_KEY, '1') : localStorage.removeItem(ACCESS_KEY); } catch (e) {}
  }
  try { if (localStorage.getItem(ACCESS_KEY) === '1') document.body.classList.remove('access-locked'); } catch (e) {}

  const icon = {
    person: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5h3.5l1.8 4.5-2.3 1.5a11 11 0 0 0 6.5 6.5l1.5-2.3 4.5 1.8V19a1.5 1.5 0 0 1-1.5 1.5C10.8 20.5 3.5 13.2 3.5 5A1.5 1.5 0 0 1 5 3.5z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6l8.5 7 8.5-7"/></svg>',
    coins: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v4c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 10v4c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-4M5 14v4c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-4"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    arrow: '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };
  const field = (id, name, type, ph, ico, extra = '') =>
    `<div class="field field-ico">${icon[ico]}<input id="${id}" name="${name}" type="${type}" placeholder="${ph}" aria-label="${ph}" required ${extra}><small data-error-for="${id}" aria-live="polite"></small></div>`;

  const dialogs = {
    about: `
      <h2 id="dialog-title">O Investors Klub</h2>
      <p>Privátní investiční klub od 5 mil. Kč. Projekty představujeme individuálně, s ohledem na investiční cíle a preference každého člena.</p>
      <ul class="facts"><li>Privátní investiční přístup</li><li>Individuální představení projektů</li><li>Diskrétnost a profesionalita</li></ul>`,
    projects: `
      <h2 id="dialog-title">Vybrané projekty</h2>
      <p>Konkrétní projekty, jejich podmínky a detailní informace vám představíme individuálně.</p>`,
    membershipInfo: `
      <h2 id="dialog-title">Členství</h2>
      <p>Členství je určeno investorům s investičním kapitálem od 5 mil. Kč. Každou žádost individuálně posuzujeme.</p>`,
    contact: `
      <h2 id="dialog-title">Kontakt</h2>
      <p>Kontaktní údaje doplníme.</p>`,
    membership: `
      <h2 id="dialog-title">Žádost o přístup</h2>
      <form id="membership-form" class="form-grid" novalidate>
        ${field('member-name', 'name', 'text', 'Jméno a příjmení', 'person', 'autocomplete="name" maxlength="100"')}
        ${field('member-phone', 'phone', 'tel', 'Telefonní číslo', 'phone', 'autocomplete="tel" maxlength="40"')}
        ${field('member-email', 'email', 'email', 'E-mail', 'mail', 'autocomplete="email" maxlength="200"')}
        <div class="field field-ico">${icon.coins}<select id="member-volume" name="volume" required aria-label="Investiční kapitál"><option value="">Investiční kapitál</option><option>5–10 mil. Kč</option><option>10–25 mil. Kč</option><option>25–50 mil. Kč</option><option>Více než 50 mil. Kč</option></select>${icon.chev}<small data-error-for="member-volume" aria-live="polite"></small></div>
        <label class="consent"><input type="checkbox" id="member-consent" name="consent" required><span>Souhlasím se zpracováním osobních údajů za účelem vyřízení žádosti.</span></label>
        <small class="consent-error" data-error-for="member-consent" aria-live="polite"></small>
        <button type="submit" class="cta dialog-submit"><span>Odeslat žádost</span>${icon.arrow}</button>
        <p class="fine-print">Každou žádost individuálně posuzujeme. Odeslání žádosti nezaručuje přijetí do klubu.</p>
      </form>`,
    login: `
      <h2 id="dialog-title">Přihlášení členů</h2>
      <form id="login-form" class="form-grid" novalidate>
        ${field('login-email', 'email', 'email', 'E-mail', 'mail', 'autocomplete="username" maxlength="200"')}
        ${field('login-password', 'password', 'password', 'Heslo', 'lock', 'autocomplete="current-password" maxlength="200"')}
        <p class="form-error" id="login-error" role="alert" hidden>Nesprávný e-mail nebo heslo.</p>
        <button type="submit" class="cta dialog-submit"><span>Přihlásit se</span>${icon.arrow}</button>
        <p class="fine-print">Přístup do členské sekce získáte po schválení vaší žádosti. <button type="button" class="link-btn" data-open="membership">Požádat o přístup</button></p>
      </form>`
  };

  function closeMenu() {
    menu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Otevřít navigaci');
  }
  function openDialog(type) {
    if (!Object.hasOwn(dialogs, type)) return;
    if (layer.hidden) previousFocus = document.activeElement;
    closeMenu();
    content.innerHTML = dialogs[type];
    panel.dataset.kind = type;
    // Žádost a login se zobrazí jako karta přímo na fotce (v místě křesla), bez zamlžení pozadí.
    const inline = INLINE.includes(type) && window.innerWidth > 820;
    layer.classList.toggle('is-inline', inline);
    (inline ? heroShell : document.body).appendChild(layer);
    layer.hidden = false;
    if (!inline) document.body.classList.add('modal-open');
    const first = content.querySelector('input,select');
    (first || panel).focus();
  }
  function closeDialog() {
    if (layer.hidden) return;
    layer.hidden = true;
    layer.classList.remove('is-inline');
    document.body.classList.remove('modal-open');
    content.replaceChildren();
    if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
    previousFocus = null;
  }

  function validate(form) {
    let firstBad = null;
    form.querySelectorAll('[required]').forEach((el) => {
      const v = el.type === 'checkbox' ? '' : el.value.trim();
      let msg = '';
      if (el.type === 'checkbox') { if (!el.checked) msg = 'Pro odeslání je potřeba souhlas.'; }
      else if (!v) msg = el.tagName === 'SELECT' ? 'Vyberte prosím možnost.' : 'Vyplňte prosím toto pole.';
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Zadejte platný e-mail.';
      else if (el.type === 'tel' && v.replace(/\D/g, '').length < 9) msg = 'Zadejte platné telefonní číslo.';
      else if (el.name === 'name' && v.split(/\s+/).length < 2) msg = 'Zadejte jméno i příjmení.';
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const err = form.querySelector(`[data-error-for="${el.id}"]`);
      if (err) err.textContent = msg;
      if (msg && !firstBad) firstBad = el;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  // Měřicí kód CRM se načte až při odeslání žádosti (ne při běžné návštěvě).
  function loadCrm() {
    if (!CRM.key) return Promise.resolve(null);
    if (window.clarixTrack) return Promise.resolve(window.clarixTrack);
    return new Promise((resolve, reject) => {
      const t = document.createElement('script');
      t.src = `${CRM.origin}/api/t.js?k=${encodeURIComponent(CRM.key)}`;
      t.onload = () => (window.clarixTrack ? resolve(window.clarixTrack) : reject(new Error('CRM nedostupné')));
      t.onerror = () => reject(new Error('CRM nedostupné'));
      document.head.appendChild(t);
    });
  }
  async function sendLead(data) {
    const crm = await loadCrm();
    if (!crm) return { demo: true };
    const r = await crm.lead(data);
    if (r && r.error) throw new Error(r.error);
    return r;
  }

  async function submitMembership(form) {
    const btn = form.querySelector('.dialog-submit');
    const v = (n) => form.elements[n].value.trim();
    btn.disabled = true;
    btn.textContent = 'Odesílám…';
    try {
      const res = await sendLead({
        name: v('name'),
        email: v('email'),
        phone: v('phone'),
        consent: true,
        formular: FORM_NAME,
        message: `Investiční kapitál: ${v('volume')}`
      });
      content.innerHTML = `<div class="success-icon">${icon.check}</div>
        <h2 id="dialog-title">Děkujeme za žádost</h2>
        <p>Vaši žádost individuálně posoudíme a ozveme se vám. Po schválení obdržíte přihlašovací údaje do členské sekce.</p>
        ${res && res.demo ? '<p class="fine-print">Ukázkový režim: CRM zatím není připojené, údaje nebyly odeslány.</p>' : ''}
        <button type="button" class="cta dialog-submit" id="close-success">Zavřít</button>`;
      content.querySelector('#close-success').addEventListener('click', closeDialog);
      panel.focus();
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = `<span>Odeslat žádost</span>${icon.arrow}`;
      let e = form.querySelector('.form-error');
      if (!e) { e = document.createElement('p'); e.className = 'form-error'; e.setAttribute('role', 'alert'); btn.before(e); }
      e.textContent = 'Žádost se nepodařilo odeslat. Zkuste to prosím znovu za chvíli.';
    }
  }

  function submitLogin(form) {
    const ok = form.elements.email.value.trim().toLowerCase() === DEMO_LOGIN.email && form.elements.password.value === DEMO_LOGIN.password;
    form.querySelector('#login-error').hidden = ok;
    if (!ok) { form.elements.password.focus(); return; }
    setLoggedIn(true);
    closeDialog();
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open]');
    if (trigger) { event.preventDefault(); openDialog(trigger.dataset.open); return; }
    if (event.target.closest('[data-dismiss]')) { closeDialog(); return; }
    if (!layer.hidden && layer.classList.contains('is-inline') && !event.composedPath().includes(panel)) closeDialog();
  });
  document.querySelectorAll('.js-logout').forEach((b) => b.addEventListener('click', () => { setLoggedIn(false); closeMenu(); }));

  content.addEventListener('submit', (event) => {
    const form = event.target;
    event.preventDefault();
    if (form.id === 'login-form') { submitLogin(form); return; }
    if (!validate(form)) return;
    if (form.id === 'membership-form') submitMembership(form);
  });
  content.addEventListener('input', (event) => {
    const el = event.target;
    if (!el.matches('input,select')) return;
    el.setAttribute('aria-invalid', 'false');
    const fb = content.querySelector(`[data-error-for="${el.id}"]`);
    if (fb) fb.textContent = '';
    const le = content.querySelector('#login-error');
    if (le) le.hidden = true;
  });
  content.addEventListener('change', (event) => {
    if (event.target.matches('select')) event.target.classList.toggle('has-value', !!event.target.value);
  });

  closeButton.addEventListener('click', closeDialog);
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Zavřít navigaci' : 'Otevřít navigaci');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { if (!layer.hidden) closeDialog(); else closeMenu(); return; }
    if (event.key !== 'Tab' || layer.hidden) return;
    const controls = Array.from(panel.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href]'));
    if (!controls.length) return;
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
})();
