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

## Login a sekce pro členy (zatím ukázkové)

Vpravo nahoře je „Login“. Přihlášení zatím přijme jakékoli vyplněné údaje (statický web nemá server pro účty).
Po přihlášení zmizí úvod a zobrazí se menu (O klubu, Vybrané projekty, Investiční profil, Kontakt) a sekce pro členy `#klub`.

- `dotaznik.html` – Private Investor Profile (varianta ALVEDOR, 15 otázek na jedné stránce), odpovědi se ukládají jen v prohlížeči.
- `profil.html` – přehled odpovědí.
- Kontakt – formulář s preferovaným časem spojení, odesílá se jako lead do CRM (`formular: 'Kontakt'`).

Skutečné účty schválených členů a uložení profilu do CRM bude potřeba napojit na server.

## Podklady

`podklady/` – předlohy od uživatele, texty a odložené starší verze webu.
