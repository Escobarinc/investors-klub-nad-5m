/* Investors Klub nad 5M — Private Investor Profile (dotazník pro členy).
   Zadání: „Investiční profily obou investorských klubů“, varianta 02 ALVEDOR (od 5 mil. Kč).
   Pravidla: jedna odpověď (01–03, 06–08, 10–11), 1–3 odpovědi (04, 05, 09), libovolně mnoho (12–15).
   Odpovědi se zatím ukládají jen v prohlížeči (napojení na CRM je samostatný krok). */
(() => {
  'use strict';

  const STORE = window.IC_PROFILE.STORE;
  const card = document.getElementById('q-card');

  const blocks = window.IC_PROFILE.blocks;

  let answers = {};
  try { answers = JSON.parse(localStorage.getItem(STORE) || '{}').answers || {}; } catch (e) { answers = {}; }
  const save = (done) => { try { localStorage.setItem(STORE, JSON.stringify({ answers, done: !!done, updated: new Date().toISOString() })); } catch (e) { /* storage blocked */ } };

  let isMember = false;
  try { isMember = localStorage.getItem('ik5m-access-granted') === '1'; } catch (e) { isMember = false; }

  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const arrow = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>';
  const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

  function show(html) {
    card.classList.remove('is-in');
    card.innerHTML = html;
    void card.offsetWidth;
    card.classList.add('is-in');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const h = card.querySelector('h1, h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  function renderLocked() {
    show(`
      <p class="q-eyebrow">Privátní investiční klub od 5 mil. Kč</p>
      <h1 class="q-title">Dotazník je určen členům klubu.</h1>
      <p class="q-text">Pro vyplnění investičního profilu se nejprve přihlaste do klubu.</p>
      <div class="q-nav"><a class="cta q-next" href="index.html">Přejít na přihlášení ${arrow}</a></div>`);
  }

  const allQuestions = blocks.flatMap((b) => b.questions);

  function questionHtml(q) {
    const sel = answers[q.id] || [];
    const inputType = q.type === 'single' ? 'radio' : 'checkbox';
    const opts = q.options.map((o) => `
      <label class="q-opt">
        <input type="${inputType}" name="${q.id}" value="${esc(o)}" ${sel.includes(o) ? 'checked' : ''}>
        <span class="q-box">${check}</span><span class="q-opt-label">${esc(o)}</span>
      </label>`).join('');
    return `
      <fieldset class="q-question" data-q="${q.id}">
        <legend><span class="q-num">${q.id.slice(1)}</span>${esc(q.text)}</legend>
        ${q.hint ? `<p class="q-hint">${esc(q.hint)}</p>` : ''}
        <div class="q-opts">${opts}</div>
        <p class="q-error" role="alert"></p>
      </fieldset>`;
  }

  function countDone() {
    const n = allQuestions.filter((q) => (answers[q.id] || []).length).length;
    const el = card.querySelector('.q-count');
    if (el) el.textContent = `Zodpovězeno ${n} z ${allQuestions.length}`;
    const bar = card.querySelector('.q-bar span');
    if (bar) bar.style.width = `${(n / allQuestions.length) * 100}%`;
  }

  // Vše na jedné stránce: úvod, 15 otázek, odeslání.
  function renderForm() {
    show(`
      <p class="q-eyebrow">Private Investor Profile</p>
      <h1 class="q-title">Individuální přístup začíná <span class="q-accent">porozuměním.</span></h1>
      <p class="q-text">Významnější investiční rozhodnutí vyžadují odpovídající úroveň informací, profesionality a individuální komunikace.</p>
      <p class="q-text">Abychom vám mohli představovat relevantní investiční příležitosti v kontextu vašich osobních preferencí, potřebujeme nejprve porozumět vašim investičním cílům, časovému horizontu, zkušenostem a očekáváním.</p>
      <p class="q-text">Váš investiční profil tvoří základ našeho individuálního přístupu. Pomáhá nám zaměřit pozornost na příležitosti, jejich parametry a projektové informace, které jsou pro vás skutečně podstatné.</p>
      <p class="q-motto">Váš kapitál. Váš pohled. Náš přístup.</p>
      <p class="q-small">Vyplnění probíhá jednoduše, výběrem odpovědí. Své preference můžete v budoucnu kdykoli aktualizovat.</p>
      <div class="q-progress q-sticky"><span class="q-count"></span><span class="q-bar"><span></span></span></div>
      <form class="q-form" novalidate>
        ${allQuestions.map(questionHtml).join('')}
        <div class="q-nav">
          <button type="submit" class="cta q-next">Vytvořit Private Investor Profile ${arrow}</button>
        </div>
      </form>`);
    countDone();
  }

  function renderDone() {
    show(`
      <div class="q-done-icon">${check}</div>
      <p class="q-eyebrow">Private Investor Profile Completed</p>
      <p class="q-text">Děkujeme za vyplnění. Vaše odpovědi nám pomohou lépe porozumět vašim preferencím a zaměřit následné představení investičních projektů na relevantní oblasti.</p>
      <p class="q-small">Konkrétní nabídky a jejich podmínky budou posuzovány samostatně.</p>
      <div class="q-nav">
        <button type="button" class="q-prev" data-edit>Upravit odpovědi</button>
        <a class="cta q-next" href="profil.html">Zobrazit můj profil ${arrow}</a>
      </div>`);
  }

  // Výběr odpovědí: limit u „max“, vylučující volba u „multi“.
  card.addEventListener('change', (e) => {
    const input = e.target;
    if (!input.matches('.q-opt input')) return;
    const fs = input.closest('.q-question');
    const q = blocks.flatMap((b) => b.questions).find((x) => x.id === fs.dataset.q);
    const boxes = Array.from(fs.querySelectorAll('input'));
    if (q.type === 'max' && input.checked && boxes.filter((b) => b.checked).length > q.max) {
      input.checked = false;
      fs.querySelector('.q-error').textContent = `Vyberte maximálně ${({ 2: 'dvě', 3: 'tři' })[q.max] || q.max} možnosti.`;
      return;
    }
    if (q.exclusive && input.checked) {
      if (input.value === q.exclusive) boxes.forEach((b) => { if (b !== input) b.checked = false; });
      else boxes.forEach((b) => { if (b.value === q.exclusive) b.checked = false; });
    }
    answers[q.id] = boxes.filter((b) => b.checked).map((b) => b.value);
    fs.querySelector('.q-error').textContent = '';
    fs.classList.remove('is-missing');
    save(false);
    countDone();
  });

  card.addEventListener('submit', (e) => {
    const form = e.target.closest('.q-form');
    if (!form) return;
    e.preventDefault();
    let firstMissing = null;
    allQuestions.forEach((q) => {
      const fs = form.querySelector(`[data-q="${q.id}"]`);
      const ok = (answers[q.id] || []).length > 0;
      fs.classList.toggle('is-missing', !ok);
      fs.querySelector('.q-error').textContent = ok ? '' : 'Vyberte prosím odpověď.';
      if (!ok && !firstMissing) firstMissing = fs;
    });
    if (firstMissing) { firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    save(true);
    renderDone();
  });

  card.addEventListener('click', (e) => {
    if (e.target.closest('[data-edit]')) { e.preventDefault(); renderForm(); }
  });

  if (isMember) renderForm(); else renderLocked();
})();
