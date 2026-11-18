/* Investors Klub nad 5M (varianta ALVEDOR) — otázky investičního profilu (sdílené: dotazník i přehled profilu). */
window.IC_PROFILE = (() => {
  const blocks = [
    {
      title: 'Your Investment Capital',
      intro: 'Nejprve si nastavíme základní parametry vašich investičních možností.',
      questions: [
        { id: 'q01', text: 'Jaký objem kapitálu aktuálně zvažujete investovat?', type: 'single',
          options: ['5–10 mil. Kč', '10–20 mil. Kč', '20–50 mil. Kč', 'Nad 50 mil. Kč'] },
        { id: 'q02', text: 'Jak plánujete rozdělit svůj investiční kapitál?', type: 'single',
          options: ['Do jednoho investičního projektu', 'Mezi dva až tři projekty', 'Mezi čtyři a více projektů', 'Rozhodnu se podle konkrétních příležitostí'] },
        { id: 'q03', text: 'Kdy předpokládáte první investici?', type: 'single',
          options: ['Ihned', 'Do 30 dnů', 'Do 3 měsíců', 'Do 6 měsíců', 'Později'] }
      ]
    },
    {
      title: 'Your Investment Goals',
      intro: 'Zajímá nás, co od investování očekáváte a které parametry jsou pro vás důležité.',
      questions: [
        { id: 'q04', text: 'Jaký je hlavní účel vašich investic?', type: 'max', max: 3, hint: 'Vyberte 1–3 možnosti.',
          options: ['Pravidelný příjem', 'Růst kapitálu', 'Ochrana kupní síly', 'Diverzifikace', 'Financování budoucích potřeb'] },
        { id: 'q05', text: 'Co je pro vás při výběru investice nejdůležitější?', type: 'max', max: 3, hint: 'Vyberte 1–3 priority.',
          options: ['Výnos', 'Riziko ztráty', 'Zajištění', 'Likvidita', 'Délka investice', 'Emitent', 'Konkrétní projekt'] },
        { id: 'q06', text: 'Jaký způsob získávání výnosu preferujete?', type: 'single',
          options: ['Pravidelná výplata', 'Výplata při splatnosti', 'Reinvestování', 'Bez preference'] },
        { id: 'q07', text: 'Jaké roční zhodnocení očekáváte od investic tohoto typu?', type: 'single',
          options: ['Do 5 %', '5–7 %', '7–9 %', '9–11 %', 'Více než 11 %', 'Nemám pevné očekávání'] }
      ]
    },
    {
      title: 'Investment Horizon & Risk',
      intro: 'Délka investice, dostupnost kapitálu a investiční rizika jsou důležitou součástí každého rozhodnutí.',
      questions: [
        { id: 'q08', text: 'Jakou dobu investice preferujete?', type: 'single',
          options: ['Do 12 měsíců', '1–2 roky', '2–3 roky', '3–5 let', 'Více než 5 let'] },
        { id: 'q09', text: 'V jaké fázi realizace projektu preferujete investovat?', type: 'max', max: 3, hint: 'Vyberte 1–3 možnosti.',
          options: ['V přípravné fázi projektu', 'Po získání potřebných povolení', 'Během realizace projektu', 'Ve fázi dokončování nebo po dokončení', 'Fáze projektu pro mě není rozhodující'] },
        { id: 'q10', text: 'Jakou míru investičního rizika jste ochoten podstoupit?', type: 'single',
          options: ['Velmi nízkou', 'Nízkou', 'Střední', 'Vyšší', 'Vysokou'] },
        { id: 'q11', text: 'Jakým způsobem chcete dlouhodobě pracovat se svým investičním kapitálem?', type: 'single',
          options: ['Pravidelně reinvestovat výnosy', 'Postupně navyšovat investovaný kapitál', 'Kombinovat pravidelný příjem s růstem kapitálu', 'Udržovat stabilní objem investic', 'Rozhodovat podle aktuálních příležitostí'] }
      ]
    },
    {
      title: 'Your Investment Preferences',
      intro: 'Pomozte nám lépe pochopit, jaké investiční nástroje a projekty vás zajímají.',
      questions: [
        { id: 'q12', text: 'S jakými investičními nástroji máte zkušenosti?', type: 'multi', hint: 'Lze vybrat více možností.',
          options: ['Dluhopisy', 'Fondy', 'FKI', 'Akcie', 'ETF', 'Nemovitosti', 'Podnikatelské podíly', 'Úvěrové investice', 'Zatím bez zkušeností'] },
        { id: 'q13', text: 'O jaké formy investování máte zájem?', type: 'multi', hint: 'Lze vybrat více možností.',
          options: ['Korporátní dluhopisy', 'Zajištěné dluhopisy', 'Investiční fondy', 'FKI', 'Úvěrové financování', 'Přímé projektové investice', 'Majetkové podíly'] },
        { id: 'q14', text: 'Jaké typy projektů vás zajímají?', type: 'multi', hint: 'Lze vybrat více možností.',
          options: ['Rezidenční development', 'Komerční nemovitosti', 'Průmysl', 'Energetika', 'Infrastruktura', 'Bez preference'] },
        { id: 'q15', text: 'Jaké formy zajištění preferujete?', type: 'multi', hint: 'Lze vybrat více možností.',
          options: ['Nemovitostní zástava', 'Zástava obchodního podílu', 'Ručení další osoby', 'Kombinace', 'Bez preference'] }
      ]
    }
  ];
  return { blocks, STORE: 'ik5m-investicni-profil' };
})();
