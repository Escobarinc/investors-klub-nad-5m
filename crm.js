/* Investors Klub nad 5M — odesílání formulářů jako lead do CRM (CLARIX), sdílené pro celý web.
 * Klíč webu (site key) se získá v CRM: Nastavení → Weby a měření → Přidat web.
 * Dokud je klíč prázdný, formuláře fungují jen jako ukázka a nic se neodesílá.
 * Měřicí kód CRM se načte až při odeslání formuláře (ne při běžné návštěvě). */
window.IK_CRM = (() => {
  'use strict';
  const CRM = { origin: 'https://clarix-crm.onrender.com', key: '' };
  function load() {
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
    const crm = await load();
    if (!crm) return { demo: true };
    const r = await crm.lead(data);
    if (r && r.error) throw new Error(r.error);
    return r;
  }
  return { sendLead };
})();
