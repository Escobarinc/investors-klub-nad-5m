/* Private Capital Circle — odesílání formulářů jako lead do CRM (CLARIX), sdílené pro celý web.
 * Klíč webu (site key) se získá v CRM: Nastavení → Weby a měření → Přidat web.
 * Měřicí kód CRM (návštěvy, scroll, kliky) je analytická technologie – načte se až po souhlasu
 * s analytickými cookies (cookies.js, událost „pcc:consent“). Bez souhlasu se poptávka pošle přímo, bez měření. */
window.IK_CRM = (() => {
  'use strict';
  const CRM = { origin: 'https://clarix-crm.onrender.com', key: 'C2mFPaCiXOd-07vF' };
  let loading = null;
  function load() {
    if (!CRM.key) return Promise.resolve(null);
    if (window.clarixTrack) return Promise.resolve(window.clarixTrack);
    if (loading) return loading;
    return loading = new Promise((resolve, reject) => {
      const t = document.createElement('script');
      t.src = `${CRM.origin}/api/t.js?k=${encodeURIComponent(CRM.key)}`;
      t.onload = () => (window.clarixTrack ? resolve(window.clarixTrack) : reject(new Error('CRM nedostupné')));
      t.onerror = () => { loading = null; reject(new Error('CRM nedostupné')); };
      document.head.appendChild(t);
    });
  }
  const analytics = () => !!(window.pccConsent && window.pccConsent.analyticke);
  function onConsent() {
    if (!analytics()) return;
    load().then((ct) => { if (ct && typeof ct.consent === 'function') ct.consent(); }).catch(() => {});
  }
  document.addEventListener('pcc:consent', onConsent);
  onConsent();

  async function sendLead(data) {
    if (!CRM.key) return { demo: true };
    if (window.clarixTrack && typeof window.clarixTrack.lead === 'function') {
      const r = await window.clarixTrack.lead(data);
      if (r && r.error) throw new Error(r.error);
      return r;
    }
    // Bez souhlasu s analytickými cookies: poptávka jde přímo do CRM, bez měřicího kódu a identifikátorů.
    const q = new URLSearchParams(location.search), u = {};
    ['source', 'medium', 'campaign', 'content', 'term'].forEach((k) => { u[k] = q.get('utm_' + k) || ''; });
    const body = { ...data, k: CRM.key, u, p: location.pathname, h: location.host, lp: location.pathname, rf: document.referrer || '', gc: q.get('gclid') || '', fc: q.get('fbclid') || '', dv: innerWidth < 768 ? 'm' : innerWidth < 1100 ? 't' : 'd' };
    const res = await fetch(CRM.origin + '/api/t/lead', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) });
    const r = await res.json().catch(() => ({}));
    if (r && r.error) throw new Error(r.error);
    return r;
  }
  return { sendLead };
})();
