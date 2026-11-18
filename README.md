# Investors Klub – klub nad 5M

Statický web (index.html, styles.css, script.js, assets/). Grafika vychází z tmavé verze webu Investors Club (křeslo, whisky, noční město).

Náhled: `.claude/launch.json` → `investors-klub-nad-5m` (port 8786).

## Žádost o přístup → lead v CRM

- Tlačítko „Požádat o privátní přístup“ otevře kartu s formulářem (jméno, telefon, e-mail, investiční kapitál, souhlas).
- Po odeslání se volá `clarixTrack.lead({...})` z měřicího kódu CRM `/api/t.js`.
  Formulář se v CRM jmenuje „Investors Klub nad 5M – Žádost o privátní přístup“, investiční kapitál je ve zprávě leadu.
- **Co je potřeba udělat:** v CRM (Nastavení → Weby a měření) přidat web a jeho klíč vložit do `script.js`:
  `const CRM = { origin: 'https://clarix-crm.onrender.com', key: 'SEM_KLÍČ' };`
  CRM drží u webu jednu doménu, proto se to dělá až s finální adresou webu.
- Bez klíče formulář funguje jako ukázka a nic neodesílá (v potvrzení je to napsané).
- Měřicí kód se načítá až při odeslání žádosti, ne při běžné návštěvě.

## Login (zatím ukázkový)

Vpravo nahoře je „Login“. Po přihlášení se zobrazí celé menu (O klubu, Vybrané projekty, Členství, Kontakt) a tlačítko Odhlásit.

Statický web nemá server pro účty, takže přihlášení je zatím jen ukázka s jedním testovacím účtem:

- e-mail: `demo@investorsklub.cz`
- heslo: `klub5m`

Skutečné přihlášení (účty schválených členů) bude potřeba napojit na server, např. na CRM.

## Podklady

`podklady/` – předlohy od uživatele, texty a odložené starší verze webu.
