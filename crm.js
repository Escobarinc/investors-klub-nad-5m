/* Investors Klub nad 5M — odesílání formulářů jako lead do CRM (CLARIX), sdílené pro celý web.
 * Klíč webu (site key) se získá v CRM: Nastavení → Weby a měření → Přidat web.
 * Dokud je klíč prázdný, formuláře fungují jen jako ukázka a nic se neodesílá.
 * Měřicí kód CRM se načte hned při návštěvě (návštěvy, scroll, kliky) a použije se i pro odeslání formuláře. */
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
  async function sendLead(data) {
    const crm = await load();
    if (!crm) return { demo: true };
    const r = await crm.lead(data);
    if (r && r.error) throw new Error(r.error);
    return r;
  }
  load().catch(() => {});
  return { sendLead };
})();
