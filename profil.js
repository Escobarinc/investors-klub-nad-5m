/* Private Capital Circle — přehled investičního profilu (co člen odpověděl v dotazníku). */
(() => {
  'use strict';

  const { blocks, STORE } = window.IC_PROFILE;
  const card = document.getElementById('q-card');
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const arrow = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>';

  let isMember = false;
  let data = null;
  try {
    isMember = localStorage.getItem('ik5m-access-granted') === '1';
    data = JSON.parse(localStorage.getItem(STORE) || 'null');
  } catch (e) { /* storage blocked */ }

  const answers = (data && data.answers) || {};
  const all = blocks.flatMap((b) => b.questions);
  const answered = all.filter((q) => (answers[q.id] || []).length).length;

  function render(html) {
    card.innerHTML = html;
    card.classList.add('is-in');
  }

  if (!isMember) {
    render(`
      <p class="q-eyebrow">Privátní investiční klub od 5 mil. Kč</p>
      <h1 class="q-title">Profil je dostupný členům klubu.</h1>
      <p class="q-text">Pro zobrazení investičního profilu se nejprve přihlaste do klubu.</p>
      <div class="q-nav"><a class="cta q-next" href="index.html">Přejít na přihlášení ${arrow}</a></div>`);
    return;
  }

  if (!answered) {
    render(`
      <p class="q-eyebrow">Můj investiční profil</p>
      <h1 class="q-title">Profil zatím není vyplněný.</h1>
      <p class="q-text">Vyplňte krátký investiční dotazník. Pomůže nám představovat vám projekty, které odpovídají vašim cílům a preferencím.</p>
      <div class="q-nav"><a class="cta q-next" href="dotaznik.html">Vyplnit investiční profil ${arrow}</a></div>`);
    return;
  }

  let updated = '';
  if (data && data.updated) {
    const d = new Date(data.updated);
    if (!isNaN(d)) updated = d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  const sections = blocks.map((b) => `
    <section class="p-block">
      <h2 class="p-block-title">${esc(b.title)}</h2>
      <dl class="p-list">
        ${b.questions.map((q) => {
          const a = answers[q.id] || [];
          return `
          <div class="p-row">
            <dt><span class="q-num">${q.id.slice(1)}</span>${esc(q.text)}</dt>
            <dd>${a.length ? a.map((x) => `<span class="p-chip">${esc(x)}</span>`).join('') : '<span class="p-empty">Bez odpovědi</span>'}</dd>
          </div>`;
        }).join('')}
      </dl>
    </section>`).join('');

  render(`
    <p class="q-eyebrow">Můj investiční profil</p>
    <h1 class="q-title">Přehled vašich odpovědí</h1>
    <div class="p-meta">
      <span>Zodpovězeno ${answered} z ${all.length}</span>
      ${updated ? `<span>Naposledy upraveno ${esc(updated)}</span>` : ''}
    </div>
    ${sections}
    <div class="q-nav">
      <a class="q-prev" href="index.html#klub">Zpět do klubu</a>
      <a class="cta q-next" href="dotaznik.html">Upravit odpovědi ${arrow}</a>
    </div>`);
})();
