/* Private Capital Circle — stránka Kontakt: formulář se zprávou a preferovaným časem spojení → lead do CRM (formular „Kontakt“). */
(() => {
  'use strict';
  const form = document.getElementById('contact-form');
  const card = document.getElementById('q-card');
  if (!form) return;
  const $ = (id) => document.getElementById(id);

  // Pracovní dny (po–pá) na 3 týdny dopředu, časy po půlhodinách 9:00–19:00
  const d = new Date(); d.setHours(12, 0, 0, 0);
  let n = 0;
  while (n < 15) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const label = d.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'numeric' });
    $('contact-day').add(new Option(label.charAt(0).toUpperCase() + label.slice(1), label));
    n++;
  }
  for (let m = 9 * 60; m <= 19 * 60; m += 30) {
    const t = `${Math.floor(m / 60)}:${m % 60 ? '30' : '00'}`;
    $('contact-time').add(new Option(t, t));
  }

  // Telefon: předvolba CZ/SK + přesně 9 číslic; e-mail: jméno@doména.koncovka
  const digits = (el) => {
    let x = el.value.replace(/\D/g, '');
    if (x.length === 12 && (x.startsWith('420') || x.startsWith('421'))) x = x.slice(3);
    if (x.length === 14 && x.startsWith('00')) x = x.slice(5);
    return x;
  };
  const fmt9 = (x) => x.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3');
  const EMAIL_RE = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+(?<!\.)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
  function emailMsg(v) {
    if (!v) return 'Vyplňte prosím e-mail.';
    if (!v.includes('@')) return 'E-mail musí obsahovat zavináč (@).';
    if (v.split('@').length > 2) return 'E-mail může obsahovat jen jeden zavináč.';
    const [local, domain] = v.split('@');
    if (!local) return 'Doplňte část e-mailu před zavináčem.';
    if (!domain.includes('.')) return 'Doplňte doménu s koncovkou, např. jmeno@email.cz.';
    if (!/\.[A-Za-z]{2,}$/.test(domain)) return 'Doplňte koncovku domény, např. .cz nebo .com.';
    return EMAIL_RE.test(v) ? '' : 'Zadejte e-mail ve tvaru jmeno@email.cz (bez mezer a dvojitých teček).';
  }
  const rules = {
    'contact-name': (v) => (v.split(/\s+/).length < 2 ? 'Zadejte jméno i příjmení.' : ''),
    'contact-phone': () => { const x = digits($('contact-phone')); return x.length === 9 ? '' : `Telefonní číslo musí mít 9 číslic (zadáno ${x.length}).`; },
    'contact-email': (v) => emailMsg(v),
    'contact-message': (v) => (v.length < 3 ? 'Napište nám prosím zprávu.' : '')
  };
  function check(el) {
    const msg = rules[el.id](el.value.trim());
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    form.querySelector(`[data-error-for="${el.id}"]`).textContent = msg;
    return !msg;
  }
  form.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'contact-phone') el.value = digits(el).slice(0, 9).replace(/(\d{3})(?=\d)/g, '$1 ');
    if (el.getAttribute('aria-invalid') === 'true' && rules[el.id]) check(el);
  });
  form.addEventListener('blur', (e) => { const el = e.target; if (rules[el.id] && el.value.trim()) check(el); }, true);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const els = Object.keys(rules).map($);
    const ok = els.map(check).every(Boolean);
    if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    if (form.company_website.value) return; // ochrana proti robotům
    const st = $('contact-status');
    const btn = form.querySelector('button[type=submit]');
    const day = $('contact-day').value, time = $('contact-time').value;
    const pref = day || time ? `${day || 'kterýkoli pracovní den'}${time ? ', ' + time : ''}` : 'kdykoli (po–pá 9:00–19:00)';
    btn.disabled = true; st.textContent = 'Odesílám…';
    try {
      const res = await window.IK_CRM.sendLead({
        name: $('contact-name').value.trim(),
        phone: `${form.prefix.value} ${fmt9(digits($('contact-phone')))}`,
        email: $('contact-email').value.trim(),
        formular: 'Kontakt',
        message: $('contact-message').value.trim() + '\n\nPreferovaný čas spojení: ' + pref
      });
      card.innerHTML = `<div class="q-done-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>
        <p class="q-eyebrow">Kontakt</p>
        <h1 class="q-title">Děkujeme za zprávu</h1>
        <p class="q-text">Ozveme se vám ${day || time ? 'v termínu: <strong>' + pref + '</strong>' : 'co nejdříve'}.</p>
        ${res && res.demo ? '<p class="q-small">Ukázkový režim: CRM zatím není připojené, zpráva nebyla odeslána.</p>' : ''}
        <div class="q-nav"><a class="cta q-next" href="index.html">Zpět na úvod</a></div>`;
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      btn.disabled = false;
      st.textContent = 'Zprávu se nepodařilo odeslat. Zkuste to prosím znovu za chvíli.';
    }
  });
})();
