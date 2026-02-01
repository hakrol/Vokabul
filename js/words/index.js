const data = window.VokabulWordsData || {};
const nouns = data.nouns || [];
const adjectives = data.adjectives || [];
const verbs = data.verbs || [];

// Preserve the original daily rotation order while grouping by word class.
const allWords = [
  ...nouns.slice(0, 8),
  ...adjectives,
  ...nouns.slice(8),
  ...verbs
];

const exported = {
  adjectives,
  allWords,
  nouns,
  verbs
};

const dailySynonymDetails = {
  mystifisering: {
    title: "Mystifisering",
    meaning: "Å gjøre noe uklart eller hemmelighetsfullt.",
    usage: "Brukes når språk eller handlinger skaper forvirring.",
    example: "Forklaringen endte i mystifisering.",
    type: "substantiv"
  },
  fordunkling: {
    title: "Fordunkling",
    meaning: "Å gjøre noe mørkere eller mindre klart.",
    usage: "Brukes om å tilsløre fakta eller mening.",
    example: "Debatten bar preg av fordunkling.",
    type: "substantiv"
  },
  tilsløring: {
    title: "Tilsløring",
    meaning: "Det å skjule eller dekke over.",
    usage: "Brukes om å legge lokk på sannheten.",
    example: "Rapporten var full av tilsløring.",
    type: "substantiv"
  },
  rådvillhet: {
    title: "Rådvillhet",
    meaning: "Mangel på råd; usikkerhet.",
    usage: "Brukes når man ikke vet hva man skal gjøre.",
    example: "Hun stod i rådvillhet.",
    type: "substantiv"
  },
  tvil: {
    title: "Tvil",
    meaning: "Usikkerhet om noe er sant eller riktig.",
    usage: "Brukes om å være i tvil.",
    example: "Han kjente tvil før beslutningen.",
    type: "substantiv"
  },
  uføre: {
    title: "Uføre",
    meaning: "Fastlåst situasjon uten god løsning.",
    usage: "Brukes om problemer der alle valg er dårlige.",
    example: "Forhandlingene havnet i et uføre.",
    type: "substantiv"
  },
  tungsinn: {
    title: "Tungsinn",
    meaning: "Vedvarende tristhet.",
    usage: "Brukes om stille, tung stemning.",
    example: "Tungsinn la seg over rommet.",
    type: "substantiv"
  },
  vemod: {
    title: "Vemod",
    meaning: "Mildt, stillferdig sorgpreg.",
    usage: "Brukes om bittersøt tristhet.",
    example: "Det var et snev av vemod i avskjeden.",
    type: "substantiv"
  },
  sorgmod: {
    title: "Sorgmod",
    meaning: "Tristhet med ettertenksomhet.",
    usage: "Brukes om rolig, dyp sorg.",
    example: "Hun bar et sorgmod i blikket.",
    type: "substantiv"
  },
  staffasje: {
    title: "Staffasje",
    meaning: "Ytre pynt eller dekor som skjuler innhold.",
    usage: "Brukes om overflatepynt uten substans.",
    example: "Tallene var staffasje for en tom plan.",
    type: "substantiv"
  },
  prydspråk: {
    title: "Prydspråk",
    meaning: "Pyntet og blomstrende språk.",
    usage: "Brukes når ord pyntes mer enn innholdet tåler.",
    example: "Talen var full av prydspråk.",
    type: "substantiv"
  },
  glansbilde: {
    title: "Glansbilde",
    meaning: "Et idealisert og polert bilde.",
    usage: "Brukes om noe som fremstilles for positivt.",
    example: "Historien ble et glansbilde av virkeligheten.",
    type: "substantiv"
  },
  flertydighet: {
    title: "Flertydighet",
    meaning: "At noe kan forstås på flere måter.",
    usage: "Brukes om ord eller utsagn med flere tolkninger.",
    example: "Flertydigheten skapte uenighet.",
    type: "substantiv"
  },
  uklarhet: {
    title: "Uklarhet",
    meaning: "Mangel på klarhet.",
    usage: "Brukes når noe er utydelig.",
    example: "Uklarhet i avtalen ga problemer.",
    type: "substantiv"
  },
  dobbeltbetydning: {
    title: "Dobbeltbetydning",
    meaning: "To mulige betydninger i samme uttrykk.",
    usage: "Brukes i ordspill eller tvetydige utsagn.",
    example: "Han la inn en bevisst dobbeltbetydning.",
    type: "substantiv"
  },
  maskering: {
    title: "Maskering",
    meaning: "Det å skjule eller kamuflere.",
    usage: "Brukes om å dekke over følelser eller intensjoner.",
    example: "Et smil kan være en maskering.",
    type: "substantiv"
  },
  skinn: {
    title: "Skinn",
    meaning: "Et ytre inntrykk som ikke stemmer.",
    usage: "Brukes om falsk fasade.",
    example: "Bak skinnet var han usikker.",
    type: "substantiv"
  },
  hykleri: {
    title: "Hykleri",
    meaning: "Å si én ting og gjøre en annen.",
    usage: "Brukes om falsk moralsk holdning.",
    example: "Han ble tatt i hykleri.",
    type: "substantiv"
  },
  åndsklima: {
    title: "Åndsklima",
    meaning: "Ideene og holdningene som preger en tid.",
    usage: "Brukes om den kulturelle stemningen i en epoke.",
    example: "Boken fanger åndsklimaet i mellomkrigstiden.",
    type: "substantiv"
  },
  tidsklima: {
    title: "Tidsklima",
    meaning: "Samfunnets generelle holdninger i en periode.",
    usage: "Brukes om stemninger og strømninger i tiden.",
    example: "Tidsklimaet var preget av optimisme.",
    type: "substantiv"
  },
  epokekarakter: {
    title: "Epokekarakter",
    meaning: "Det som kjennetegner en epoke.",
    usage: "Brukes om særtrekk ved en tidsperiode.",
    example: "Arkitekturen har tydelig epokekarakter.",
    type: "substantiv"
  },
  skuffelse: {
    title: "Skuffelse",
    meaning: "Følelse av å bli skuffet.",
    usage: "Brukes når forventninger ikke innfris.",
    example: "Skuffelsen var stor.",
    type: "substantiv"
  },
  avfortryllelse: {
    title: "Avfortryllelse",
    meaning: "Tap av magi eller idealisering.",
    usage: "Brukes om å se noe mer nøkternt.",
    example: "Avfortryllelsen kom etterpå.",
    type: "substantiv"
  },
  oppvåkning: {
    title: "Oppvåkning",
    meaning: "Plutselig innsikt eller erkjennelse.",
    usage: "Brukes om å se ting klarere.",
    example: "Det ble en brå oppvåkning.",
    type: "substantiv"
  },
  likegyldig: {
    title: "Likegyldig",
    meaning: "Uengasjert og uten interesse.",
    usage: "Brukes om personer som ikke bryr seg.",
    example: "Han var likegyldig til resultatet.",
    type: "adjektiv"
  },
  passiv: {
    title: "Passiv",
    meaning: "Uten initiativ eller handling.",
    usage: "Brukes om noen som ikke deltar aktivt.",
    example: "Publikum ble passivt.",
    type: "adjektiv"
  },
  uengasjert: {
    title: "Uengasjert",
    meaning: "Mangler interesse eller innlevelse.",
    usage: "Brukes om fravær av engasjement.",
    example: "Hun virket uengasjert i møtet.",
    type: "adjektiv"
  },
  ettertanke: {
    title: "Ettertanke",
    meaning: "Refleksjon i etterkant.",
    usage: "Brukes når man tenker tilbake på noe.",
    example: "Med ettertanke innså han feilen.",
    type: "substantiv"
  },
  etterklokskap: {
    title: "Etterklokskap",
    meaning: "Klokskap som kommer for sent.",
    usage: "Brukes når man forstår etterpå.",
    example: "Etterklokskap endrer lite.",
    type: "substantiv"
  },
  fasitvisdom: {
    title: "Fasitvisdom",
    meaning: "Å tro man vet fasiten i ettertid.",
    usage: "Brukes om skråsikker etterpåklokskap.",
    example: "Fasitvisdom er lett når alt er over.",
    type: "substantiv"
  }
};

const quickGuessWords = [
  {
    word: "glimtminne",
    desc: "En liten scene som plutselig dukker opp fra barndommen.",
    type: "substantiv",
    meaning: "Et kort, klart minne som plutselig blusser opp.",
    usage: "Brukes om små tilbakeblikk fra barndommen eller bestemte øyeblikk.",
    example: "På vei hjem fikk hun et glimtminne av skolegården.",
    see: "minne"
  },
  {
    word: "lydskygge",
    desc: "Et ekko som legger seg bak lyden og henger igjen.",
    type: "substantiv",
    meaning: "En svak etterklang som henger igjen etter en lyd.",
    usage: "Brukes om rom med lang etterklang eller når en lyd ligger i bakgrunnen.",
    example: "I kirken lå en lydskygge lenge etter orgeltonen.",
    see: "ekko"
  },
  {
    word: "stillebry",
    desc: "En rolig omsorg som ikke sies høyt.",
    type: "substantiv",
    meaning: "Still og varsom omsorg.",
    usage: "Brukes om støtte som vises uten store ord.",
    example: "Hun ga ham en stillebry med et lite nikk.",
    see: "omsorg"
  },
  {
    word: "gladtrass",
    desc: "Når man nekter å gi opp, men smiler mens man gjør det.",
    type: "substantiv",
    meaning: "En sta vilje som ledsages av glede.",
    usage: "Brukes når noen nekter å gi opp, men gjør det med smil.",
    example: "Hun møtte motgangen med ren gladtrass.",
    see: "trass"
  },
  {
    word: "værlukt",
    desc: "Duften i lufta som varsler at været er på vei.",
    type: "substantiv",
    meaning: "Lukt i lufta som varsler værskifte.",
    usage: "Brukes om duften før regn, snø eller torden.",
    example: "Det lå værlukt over fjorden.",
    see: "regn"
  },
  {
    word: "tankeslør",
    desc: "En tåke av tanker som gjør alt litt uklart.",
    type: "substantiv",
    meaning: "Et uklart lag av tanker som gjør det vanskelig å fokusere.",
    usage: "Brukes om mental tåke eller distraksjon.",
    example: "Et tankeslør la seg over henne etter en lang dag.",
    see: "tåke"
  },
  {
    word: "raskro",
    desc: "En kort pause som gir energi til neste runde.",
    type: "substantiv",
    meaning: "En kort pause som gir ro og ny energi.",
    usage: "Brukes om små avbrekk i en travel dag.",
    example: "De tok en raskro før møtet.",
    see: "pause"
  },
  {
    word: "taktbytte",
    desc: "Når du skifter tempo og rytme i det du gjør.",
    type: "substantiv",
    meaning: "Skifte i tempo eller rytme.",
    usage: "Brukes om endring i arbeidsflyt, musikk eller aktivitet.",
    example: "Et tydelig taktbytte fikk publikum til å våkne.",
    see: "tempo"
  },
  {
    word: "kveldsvind",
    desc: "En mild bris som varsler at dagen er på hell.",
    type: "substantiv",
    meaning: "Mild bris som kommer når kvelden nærmer seg.",
    usage: "Brukes om sval luft i skumringen.",
    example: "Kveldsvind kjølte ned terrassen.",
    see: "bris"
  },
  {
    word: "ordfloke",
    desc: "Når setningen roter seg til og du må starte på nytt.",
    type: "substantiv",
    meaning: "En setning eller tanke som roter seg til.",
    usage: "Brukes når ordene stokker seg eller blir uklare.",
    example: "Han lo av sin egen ordfloke.",
    see: "kluss"
  }
];

function getDailyWord(date, words = allWords) {
  const daysSinceEpoch = Math.floor(date.getTime() / 86400000);
  return words[daysSinceEpoch % words.length];
}

let dailySynonymModal = null;
let dailySynonymLastFocus = null;
let wordClassModal = null;
let wordClassLastFocus = null;

const ensureDailySynonymModal = () => {
  if (dailySynonymModal) {
    return dailySynonymModal;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "quick-modal-backdrop";
  backdrop.id = "daily-synonym-modal";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-hidden", "true");

  const panel = document.createElement("div");
  panel.className = "quick-modal";

  const title = document.createElement("div");
  title.className = "quick-modal-title";
  title.id = "daily-synonym-title";
  panel.appendChild(title);

  const content = document.createElement("div");
  content.className = "quick-modal-content";

  const meaningTitle = document.createElement("div");
  meaningTitle.className = "quick-detail-heading";
  meaningTitle.textContent = "Betydning og bruk";
  content.appendChild(meaningTitle);

  const meaning = document.createElement("p");
  meaning.className = "quick-detail-body";
  content.appendChild(meaning);

  const usage = document.createElement("p");
  usage.className = "quick-detail-body";
  content.appendChild(usage);

  const exampleTitle = document.createElement("div");
  exampleTitle.className = "quick-detail-heading";
  exampleTitle.textContent = "Eksempel";
  content.appendChild(exampleTitle);

  const example = document.createElement("p");
  example.className = "quick-detail-example";
  const exampleText = document.createElement("em");
  example.appendChild(exampleText);
  content.appendChild(example);

  const meta = document.createElement("button");
  meta.type = "button";
  meta.className = "quick-detail-meta quick-detail-meta-button";
  meta.addEventListener("click", () => {
    if (meta.dataset.wordClass) {
      openWordClassModal(meta.dataset.wordClass);
    }
  });
  content.appendChild(meta);

  panel.appendChild(content);

  const closeBtn = document.createElement("button");
  closeBtn.className = "quick-modal-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Lukk");
  closeBtn.textContent = "x";
  panel.appendChild(closeBtn);

  backdrop.appendChild(panel);
  document.body.appendChild(backdrop);

  backdrop.setAttribute("aria-labelledby", title.id);

  dailySynonymModal = {
    backdrop,
    title,
    meaning,
    usage,
    exampleTitle,
    exampleText,
    meta,
    closeBtn
  };

  closeBtn.addEventListener("click", () => closeDailySynonymModal());
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeDailySynonymModal();
    }
  });

  return dailySynonymModal;
};

const getDailySynonymDetails = (wordKey, baseWord) => {
  const normalized = String(wordKey || "").toLowerCase();
  return dailySynonymDetails[normalized] || {
    title: wordKey || "Synonym",
    meaning: baseWord ? "Synonym til " + baseWord + "." : "Synonym til dagens ord.",
    usage: "",
    example: "",
    type: ""
  };
};

const openDailySynonymModal = (wordKey, baseWord) => {
  const modal = ensureDailySynonymModal();
  const details = getDailySynonymDetails(wordKey, baseWord);
  modal.title.textContent = details.title;
  modal.meaning.textContent = details.meaning || "";
  if (details.usage) {
    modal.usage.style.display = "";
    modal.usage.textContent = details.usage;
  } else {
    modal.usage.style.display = "none";
    modal.usage.textContent = "";
  }
  if (details.example) {
    modal.exampleTitle.style.display = "";
    modal.exampleText.parentElement.style.display = "";
    modal.exampleText.textContent = details.example;
  } else {
    modal.exampleTitle.style.display = "none";
    modal.exampleText.parentElement.style.display = "none";
    modal.exampleText.textContent = "";
  }
  if (details.type) {
    modal.meta.style.display = "";
    modal.meta.textContent = "Ordklasse: " + details.type;
    modal.meta.dataset.wordClass = details.type;
  } else {
    modal.meta.style.display = "none";
    modal.meta.textContent = "";
    modal.meta.dataset.wordClass = "";
  }
  dailySynonymLastFocus = document.activeElement;
  modal.backdrop.classList.add("is-open");
  modal.backdrop.setAttribute("aria-hidden", "false");
  modal.closeBtn.focus();
};

const closeDailySynonymModal = () => {
  if (!dailySynonymModal) {
    return;
  }
  dailySynonymModal.backdrop.classList.remove("is-open");
  dailySynonymModal.backdrop.setAttribute("aria-hidden", "true");
  if (dailySynonymLastFocus && typeof dailySynonymLastFocus.focus === "function") {
    dailySynonymLastFocus.focus();
  }
};

const wordClassDetails = {
  substantiv: {
    title: "Substantiv",
    meaning: "Ord som navngir ting, personer, steder eller ideer.",
    usage: "Brukes ofte med en/ei/et og kan bøyes i bestemt/ubestemt.",
    example: "En bok, ei dør, et hus.",
    type: "Ordklasse"
  },
  "substantivisk uttrykk": {
    title: "Substantivisk uttrykk",
    meaning: "Et uttrykk som fungerer som et substantiv.",
    usage: "Opptrer som navn eller betegnelse i setningen.",
    example: "Uttrykket ble brukt som et substantivisk uttrykk.",
    type: "Ordklasse"
  },
  adjektiv: {
    title: "Adjektiv",
    meaning: "Ord som beskriver egenskaper ved substantiv.",
    usage: "Bøyes ofte etter kjønn, tall og bestemt form.",
    example: "En rød bil, et rødt hus, røde biler.",
    type: "Ordklasse"
  },
  verb: {
    title: "Verb",
    meaning: "Ord som uttrykker handling eller tilstand.",
    usage: "Bøyes i tid og kan ha infinitiv, presens, preteritum.",
    example: "å løpe, løper, løp.",
    type: "Ordklasse"
  },
  adverb: {
    title: "Adverb",
    meaning: "Ord som beskriver hvordan, når eller hvor noe skjer.",
    usage: "Bøyes ikke og kan ofte flyttes i setningen.",
    example: "Han løp raskt, hun kommer snart.",
    type: "Ordklasse"
  },
  preposisjon: {
    title: "Preposisjon",
    meaning: "Ord som viser forhold mellom andre ord.",
    usage: "Står ofte foran substantiv eller pronomen.",
    example: "på bordet, under stolen.",
    type: "Ordklasse"
  },
  pronomen: {
    title: "Pronomen",
    meaning: "Ord som står i stedet for substantiv.",
    usage: "Bøyes etter person og kasus.",
    example: "jeg, du, han, den.",
    type: "Ordklasse"
  },
  konjunksjon: {
    title: "Konjunksjon",
    meaning: "Binder sammen ord eller setninger.",
    usage: "Står mellom setningsledd eller helsetninger.",
    example: "og, men, eller.",
    type: "Ordklasse"
  },
  interjeksjon: {
    title: "Interjeksjon",
    meaning: "Utrop eller uttrykk som viser følelse.",
    usage: "Står ofte alene i setningen.",
    example: "oi, ja, hurra.",
    type: "Ordklasse"
  }
};

const ensureWordClassModal = () => {
  if (wordClassModal) {
    return wordClassModal;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "quick-modal-backdrop";
  backdrop.id = "word-class-modal";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-hidden", "true");

  const panel = document.createElement("div");
  panel.className = "quick-modal";

  const title = document.createElement("div");
  title.className = "quick-modal-title";
  title.id = "word-class-title";
  panel.appendChild(title);

  const content = document.createElement("div");
  content.className = "quick-modal-content";

  const meaningTitle = document.createElement("div");
  meaningTitle.className = "quick-detail-heading";
  meaningTitle.textContent = "Betydning og bruk";
  content.appendChild(meaningTitle);

  const meaning = document.createElement("p");
  meaning.className = "quick-detail-body";
  content.appendChild(meaning);

  const usage = document.createElement("p");
  usage.className = "quick-detail-body";
  content.appendChild(usage);

  const exampleTitle = document.createElement("div");
  exampleTitle.className = "quick-detail-heading";
  exampleTitle.textContent = "Eksempel";
  content.appendChild(exampleTitle);

  const example = document.createElement("p");
  example.className = "quick-detail-example";
  const exampleText = document.createElement("em");
  example.appendChild(exampleText);
  content.appendChild(example);

  panel.appendChild(content);

  const closeBtn = document.createElement("button");
  closeBtn.className = "quick-modal-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Lukk");
  closeBtn.textContent = "x";
  panel.appendChild(closeBtn);

  backdrop.appendChild(panel);
  document.body.appendChild(backdrop);

  backdrop.setAttribute("aria-labelledby", title.id);

  wordClassModal = {
    backdrop,
    title,
    meaning,
    usage,
    exampleTitle,
    exampleText,
    closeBtn
  };

  closeBtn.addEventListener("click", () => closeWordClassModal());
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeWordClassModal();
    }
  });

  return wordClassModal;
};

const getWordClassDetails = (wordClass) => {
  const normalized = String(wordClass || "").toLowerCase();
  return wordClassDetails[normalized] || {
    title: wordClass || "Ordklasse",
    meaning: "Vi har ikke en forklaring klar for denne ordklassen ennå.",
    usage: "",
    example: "",
    type: ""
  };
};

const openWordClassModal = (wordClass) => {
  const modal = ensureWordClassModal();
  const details = getWordClassDetails(wordClass);
  modal.title.textContent = details.title;
  modal.meaning.textContent = details.meaning || "";
  if (details.usage) {
    modal.usage.style.display = "";
    modal.usage.textContent = details.usage;
  } else {
    modal.usage.style.display = "none";
    modal.usage.textContent = "";
  }
  if (details.example) {
    modal.exampleTitle.style.display = "";
    modal.exampleText.parentElement.style.display = "";
    modal.exampleText.textContent = details.example;
  } else {
    modal.exampleTitle.style.display = "none";
    modal.exampleText.parentElement.style.display = "none";
    modal.exampleText.textContent = "";
  }
  wordClassLastFocus = document.activeElement;
  modal.backdrop.classList.add("is-open");
  modal.backdrop.setAttribute("aria-hidden", "false");
  modal.closeBtn.focus();
};

const closeWordClassModal = () => {
  if (!wordClassModal) {
    return;
  }
  wordClassModal.backdrop.classList.remove("is-open");
  wordClassModal.backdrop.setAttribute("aria-hidden", "true");
  if (wordClassLastFocus && typeof wordClassLastFocus.focus === "function") {
    wordClassLastFocus.focus();
  }
};

function loadDailyWord() {
  const titleEl = document.getElementById("word-title");
  const descEl = document.getElementById("word-desc");
  const examplesEl = document.getElementById("word-examples");
  const synonymsEl = document.getElementById("word-synonyms");
  const dateEl = document.getElementById("word-date");
  const metaEl = document.getElementById("word-meta");

  if (!titleEl || !descEl || !metaEl) {
    return;
  }

  const today = new Date();
  const dailyWord = getDailyWord(today);

  titleEl.textContent = dailyWord.word;
  descEl.textContent = dailyWord.desc;

  if (examplesEl) {
    examplesEl.innerHTML = "";
    if (dailyWord.examples && dailyWord.examples.length) {
      dailyWord.examples.slice(0, 2).forEach((example) => {
        const item = document.createElement("li");
        const text = document.createElement("em");
        text.textContent = example;
        item.appendChild(text);
        examplesEl.appendChild(item);
      });
    }
  }

  if (synonymsEl) {
    synonymsEl.innerHTML = "";
    if (dailyWord.synonyms && dailyWord.synonyms.length) {
      dailyWord.synonyms.slice(0, 3).forEach((synonym) => {
        const tag = document.createElement("button");
        tag.type = "button";
        tag.className = "daily-tag daily-tag-button";
        tag.textContent = synonym;
        tag.addEventListener("click", () => openDailySynonymModal(synonym, dailyWord.word));
        synonymsEl.appendChild(tag);
      });
    }
  }

  metaEl.textContent = "";
  metaEl.onclick = null;
  metaEl.onkeydown = null;
  metaEl.removeAttribute("role");
  metaEl.removeAttribute("tabindex");
  metaEl.classList.remove("daily-meta-button");
  if (dailyWord.type) {
    metaEl.textContent = "Ordklasse: " + dailyWord.type;
    metaEl.classList.add("daily-meta-button");
    metaEl.setAttribute("role", "button");
    metaEl.setAttribute("tabindex", "0");
    metaEl.onclick = () => openWordClassModal(dailyWord.type);
    metaEl.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openWordClassModal(dailyWord.type);
      }
    };
  }

  if (dateEl) {
    dateEl.textContent = today.toLocaleDateString("no-NO", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dailySynonymModal && dailySynonymModal.backdrop.classList.contains("is-open")) {
      closeDailySynonymModal();
    }
    if (event.key === "Escape" && wordClassModal && wordClassModal.backdrop.classList.contains("is-open")) {
      closeWordClassModal();
    }
  });
}

function normalizeGuess(value) {
  return value.toLowerCase().trim().replace(/\s+/g, "");
}

const storage = window.VokabulStorage;
if (storage) {
  storage.migrateStorageIfNeeded();
}
const quickGuessStorageKey = storage?.keys?.QUICK_GUESS || "vokabulQuickGuess";

function getTodayKey(date) {
  return date.toISOString().slice(0, 10);
}

function loadQuickGuessState(todayKey) {
  try {
    let data = null;
    if (storage?.readJson) {
      data = storage.readJson(quickGuessStorageKey, null);
    } else {
      const raw = localStorage.getItem(quickGuessStorageKey);
      data = raw ? JSON.parse(raw) : null;
    }
    if (!data) {
      return null;
    }
    if (data && data.date === todayKey && (data.status === "solved" || data.status === "revealed")) {
      return data;
    }
  } catch (error) {
    return null;
  }
  return null;
}

function storeQuickGuessState(todayKey, status) {
  try {
    if (!status) {
      if (storage?.remove) {
        storage.remove(quickGuessStorageKey);
      } else {
        localStorage.removeItem(quickGuessStorageKey);
      }
      return;
    }
    if (storage?.writeJson) {
      storage.writeJson(quickGuessStorageKey, { date: todayKey, status });
      return;
    }
    localStorage.setItem(quickGuessStorageKey, JSON.stringify({ date: todayKey, status }));
  } catch (error) {
    return;
  }
}

function loadQuickGuess() {
  const clueEl = document.getElementById("quick-clue");
  const slotsEl = document.getElementById("quick-slots");
  const inputEl = document.getElementById("quick-input");
  const buttonEl = document.getElementById("quick-check");
  const revealEl = document.getElementById("quick-reveal");
  const resetEl = document.getElementById("quick-reset");
  const feedbackEl = document.getElementById("quick-feedback");

  if (!clueEl || !slotsEl || !buttonEl || !revealEl || !resetEl || !feedbackEl) {
    return;
  }

  const today = new Date();
  const todayKey = getTodayKey(today);
  const quickWord = getDailyWord(today, quickGuessWords);
  clueEl.textContent = quickWord.desc;
  const answerLetters = Array.from(quickWord.word);
  const guessLetters = answerLetters.map(() => "");
  let isLocked = false;
  let relatedModal = null;
  let lastFocus = null;
  const validLetter = /[a-zA-ZæøåÆØÅ]/;
  if (inputEl) {
    inputEl.setAttribute("maxlength", String(answerLetters.length));
  }

  const sanitizeInput = (value) => {
    return Array.from(value || "")
      .filter((char) => validLetter.test(char))
      .join("")
      .toLowerCase();
  };

  const syncInputValue = () => {
    if (!inputEl) {
      return;
    }
    const value = guessLetters.join("");
    if (inputEl.value !== value) {
      inputEl.value = value;
    }
    if (document.activeElement === inputEl) {
      const end = inputEl.value.length;
      try {
        inputEl.setSelectionRange(end, end);
      } catch (error) {
        return;
      }
    }
  };

  const relatedWordDetails = {
    minne: {
      title: "Minne",
      meaning: "Et inntrykk eller en erfaring som blir liggende igjen i bevisstheten.",
      usage: "Brukes om noe man husker fra opplevelser, personer eller steder.",
      example: "Hun hadde et klart minne fra sommerferien.",
      type: "substantiv"
    },
    ekko: {
      title: "Ekko",
      meaning: "En lyd som reflekteres tilbake og gjentas i rommet.",
      usage: "Brukes om gjenklang eller spor som henger igjen.",
      example: "Roet kom med et ekko mellom veggene.",
      type: "substantiv"
    },
    omsorg: {
      title: "Omsorg",
      meaning: "Varm omtanke og handlinger som tar vare på noen.",
      usage: "Brukes om støtte, hjelp og ansvar for andre.",
      example: "Hun viste omsorg ved å lytte og hjelpe.",
      type: "substantiv"
    },
    trass: {
      title: "Trass",
      meaning: "Sta motstand mot noe, ofte drevet av vilje og stolthet.",
      usage: "Brukes når man nekter å gi seg eller følge råd.",
      example: "Han svarte i ren trass.",
      type: "substantiv"
    },
    regn: {
      title: "Regn",
      meaning: "Vanndråper som faller fra skyer og fukter luft og jord.",
      usage: "Brukes om vær der det kommer nedbør.",
      example: "Regnet trommet mot vinduet.",
      type: "substantiv"
    },
    tåke: {
      title: "Tåke",
      meaning: "Små vanndråper som henger i lufta og gjør sikten uklar.",
      usage: "Brukes om dårlig sikt eller mental uklarhet.",
      example: "Tåken lå tett over fjorden.",
      type: "substantiv"
    },
    pause: {
      title: "Pause",
      meaning: "Et kort opphold som gir rom for ro og ny energi.",
      usage: "Brukes om et avbrekk i arbeid, spill eller aktivitet.",
      example: "Vi tok en kort pause før vi fortsatte.",
      type: "substantiv"
    },
    tempo: {
      title: "Tempo",
      meaning: "Farten eller rytmen i det som skjer.",
      usage: "Brukes om hvor raskt noe foregår.",
      example: "Laget holdt et høyt tempo.",
      type: "substantiv"
    },
    bris: {
      title: "Bris",
      meaning: "En svak og behagelig vind.",
      usage: "Brukes om lett vind som kjennes sval.",
      example: "En mild bris kom inn fra sjøen.",
      type: "substantiv"
    },
    kluss: {
      title: "Kluss",
      meaning: "Rot eller forvirring som gjør noe vanskelig å få til.",
      usage: "Brukes om noe som blir kronglete eller feil.",
      example: "Det ble kluss med planene.",
      type: "substantiv"
    }
  };

  const ensureRelatedModal = () => {
    if (relatedModal) {
      return relatedModal;
    }

    const backdrop = document.createElement("div");
    backdrop.className = "quick-modal-backdrop";
    backdrop.id = "quick-related-modal";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-hidden", "true");

    const panel = document.createElement("div");
    panel.className = "quick-modal";

    const title = document.createElement("div");
    title.className = "quick-modal-title";
    title.id = "quick-related-title";
    panel.appendChild(title);

    const content = document.createElement("div");
    content.className = "quick-modal-content";

    const meaningTitle = document.createElement("div");
    meaningTitle.className = "quick-detail-heading";
    meaningTitle.textContent = "Betydning og bruk";
    content.appendChild(meaningTitle);

    const meaning = document.createElement("p");
    meaning.className = "quick-detail-body";
    content.appendChild(meaning);

    const usage = document.createElement("p");
    usage.className = "quick-detail-body";
    content.appendChild(usage);

    const exampleTitle = document.createElement("div");
    exampleTitle.className = "quick-detail-heading";
    exampleTitle.textContent = "Eksempel";
    content.appendChild(exampleTitle);

    const example = document.createElement("p");
    example.className = "quick-detail-example";
    const exampleText = document.createElement("em");
    example.appendChild(exampleText);
    content.appendChild(example);

    const meta = document.createElement("button");
    meta.type = "button";
    meta.className = "quick-detail-meta quick-detail-meta-button";
    meta.addEventListener("click", () => {
      if (meta.dataset.wordClass) {
        openWordClassModal(meta.dataset.wordClass);
      }
    });
    content.appendChild(meta);

    panel.appendChild(content);

    const closeBtn = document.createElement("button");
    closeBtn.className = "quick-modal-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Lukk");
    closeBtn.textContent = "x";
    panel.appendChild(closeBtn);

    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);

    backdrop.setAttribute("aria-labelledby", title.id);

    relatedModal = {
      backdrop,
      title,
      meaning,
      usage,
      exampleTitle,
      exampleText,
      meta,
      closeBtn
    };

    closeBtn.addEventListener("click", () => closeRelatedModal());
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        closeRelatedModal();
      }
    });

    return relatedModal;
  };

  const getRelatedDetails = (wordKey) => {
    const normalized = String(wordKey || "").toLowerCase();
    return relatedWordDetails[normalized] || {
      title: wordKey || "Ord",
      meaning: "Vi har ikke en forklaring klar for dette ordet ennå.",
      usage: "",
      example: "",
      type: ""
    };
  };

  const openRelatedModal = (wordKey) => {
    const modal = ensureRelatedModal();
    const details = getRelatedDetails(wordKey);
    modal.title.textContent = details.title;
    modal.meaning.textContent = details.meaning || "";
    if (details.usage) {
      modal.usage.style.display = "";
      modal.usage.textContent = details.usage;
    } else {
      modal.usage.style.display = "none";
      modal.usage.textContent = "";
    }
    if (details.example) {
      modal.exampleTitle.style.display = "";
      modal.exampleText.parentElement.style.display = "";
      modal.exampleText.textContent = details.example;
    } else {
      modal.exampleTitle.style.display = "none";
      modal.exampleText.parentElement.style.display = "none";
      modal.exampleText.textContent = "";
    }
    if (details.type) {
      modal.meta.style.display = "";
      modal.meta.textContent = "Ordklasse: " + details.type;
      modal.meta.dataset.wordClass = details.type;
    } else {
      modal.meta.style.display = "none";
      modal.meta.textContent = "";
      modal.meta.dataset.wordClass = "";
    }
    lastFocus = document.activeElement;
    modal.backdrop.classList.add("is-open");
    modal.backdrop.setAttribute("aria-hidden", "false");
    modal.closeBtn.focus();
  };

  const closeRelatedModal = () => {
    if (!relatedModal) {
      return;
    }
    relatedModal.backdrop.classList.remove("is-open");
    relatedModal.backdrop.setAttribute("aria-hidden", "true");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  };

  const buildQuickDetail = (wordData) => {
    if (!wordData) {
      return null;
    }

    const detail = document.createElement("div");
    detail.className = "quick-detail";

    const wordTitle = document.createElement("div");
    wordTitle.className = "quick-detail-word";
    wordTitle.textContent = wordData.word;
    detail.appendChild(wordTitle);

    const meaningTitle = document.createElement("div");
    meaningTitle.className = "quick-detail-heading";
    meaningTitle.textContent = "Betydning og bruk";
    detail.appendChild(meaningTitle);

    if (wordData.meaning) {
      const meaning = document.createElement("p");
      meaning.className = "quick-detail-body";
      meaning.textContent = wordData.meaning;
      detail.appendChild(meaning);
    }

    if (wordData.usage) {
      const usage = document.createElement("p");
      usage.className = "quick-detail-body";
      usage.textContent = wordData.usage;
      detail.appendChild(usage);
    }

    if (wordData.see) {
      const see = document.createElement("p");
      see.className = "quick-detail-see";
      const seeLabel = document.createElement("span");
      seeLabel.textContent = "Se: ";
      const seeButton = document.createElement("button");
      seeButton.type = "button";
      seeButton.className = "quick-detail-see-link";
      seeButton.textContent = wordData.see;
      seeButton.addEventListener("click", () => openRelatedModal(wordData.see));
      see.appendChild(seeLabel);
      see.appendChild(seeButton);
      detail.appendChild(see);
    }

    if (wordData.example) {
      const exampleTitle = document.createElement("div");
      exampleTitle.className = "quick-detail-heading";
      exampleTitle.textContent = "Eksempel";
      detail.appendChild(exampleTitle);

      const example = document.createElement("p");
      example.className = "quick-detail-example";
      const exampleText = document.createElement("em");
      exampleText.textContent = wordData.example;
      example.appendChild(exampleText);
      detail.appendChild(example);
    }

    if (wordData.type) {
      const meta = document.createElement("button");
      meta.type = "button";
      meta.className = "quick-detail-meta quick-detail-meta-button";
      meta.textContent = "Ordklasse: " + wordData.type;
      meta.dataset.wordClass = wordData.type;
      meta.addEventListener("click", () => openWordClassModal(wordData.type));
      detail.appendChild(meta);
    }

    return detail;
  };

  const setFeedback = (state, message, detailNode) => {
    feedbackEl.dataset.state = state;
    feedbackEl.innerHTML = "";

    const messageEl = document.createElement("p");
    messageEl.className = "quick-message";
    messageEl.textContent = message;
    feedbackEl.appendChild(messageEl);

    if (detailNode) {
      feedbackEl.appendChild(detailNode);
    }
  };

  const renderSlots = () => {
    slotsEl.innerHTML = "";
    let activeSet = false;
    answerLetters.forEach((letter, index) => {
      const slot = document.createElement("span");
      slot.className = "quick-slot";
      slot.textContent = guessLetters[index] ? guessLetters[index] : "";
      if (!guessLetters[index] && !isLocked && !activeSet) {
        slot.classList.add("is-active");
        activeSet = true;
      }
      slotsEl.appendChild(slot);
    });
    syncInputValue();
  };

  const lockInput = () => {
    isLocked = true;
    slotsEl.classList.add("is-locked");
    slotsEl.setAttribute("aria-disabled", "true");
    slotsEl.setAttribute("tabindex", "-1");
    if (inputEl) {
      inputEl.setAttribute("disabled", "true");
    }
    buttonEl.style.display = "none";
    revealEl.style.display = "none";
  };

  const unlockInput = () => {
    isLocked = false;
    slotsEl.classList.remove("is-locked");
    slotsEl.removeAttribute("aria-disabled");
    slotsEl.setAttribute("tabindex", "0");
    if (inputEl) {
      inputEl.removeAttribute("disabled");
    }
    buttonEl.style.display = "";
    revealEl.style.display = "";
  };

  const setSolvedState = (status) => {
    answerLetters.forEach((letter, index) => {
      guessLetters[index] = letter.toLowerCase();
    });
    renderSlots();
    const detail = buildQuickDetail(quickWord);
    if (status === "solved") {
      setFeedback("success", "Du klarte dagens gjett – ordet er «" + quickWord.word + "».", detail);
    } else {
      setFeedback("warn", "Ordet er «" + quickWord.word + "».", detail);
    }
    lockInput();
  };

  const resetGuess = () => {
    storeQuickGuessState(todayKey, "");
    for (let i = 0; i < guessLetters.length; i += 1) {
      guessLetters[i] = "";
    }
    unlockInput();
    setFeedback("warn", "Dagens gjett er resatt.");
    renderSlots();
    slotsEl.focus();
  };

  const checkGuess = () => {
    if (guessLetters.includes("")) {
      setFeedback("warn", "Fyll inn alle bokstavene først.");
      return;
    }

    const guess = normalizeGuess(guessLetters.join(""));
    const answer = normalizeGuess(quickWord.word);

    if (!guess) {
      setFeedback("warn", "Skriv inn et ord først.");
      return;
    }

    if (guess === answer) {
      storeQuickGuessState(todayKey, "solved");
      setSolvedState("solved");
    } else {
      setFeedback("error", "Ikke helt. Prøv igjen!");
    }
  };

  const handleKey = (event) => {
    if (isLocked) {
      return;
    }

    if (event.key === "Backspace") {
      for (let i = guessLetters.length - 1; i >= 0; i -= 1) {
        if (guessLetters[i]) {
          guessLetters[i] = "";
          break;
        }
      }
      renderSlots();
      event.preventDefault();
      return;
    }

    if (event.key === "Enter") {
      checkGuess();
      return;
    }

    if (event.key.length === 1 && validLetter.test(event.key)) {
      const nextIndex = guessLetters.indexOf("");
      if (nextIndex !== -1) {
        guessLetters[nextIndex] = event.key.toLowerCase();
        renderSlots();
      }
      event.preventDefault();
    }
  };

  const handleInput = () => {
    if (!inputEl || isLocked) {
      return;
    }
    const cleaned = sanitizeInput(inputEl.value).slice(0, guessLetters.length);
    const nextLetters = Array.from(cleaned);
    for (let i = 0; i < guessLetters.length; i += 1) {
      guessLetters[i] = nextLetters[i] || "";
    }
    renderSlots();
    if (nextLetters.length === guessLetters.length) {
      checkGuess();
    }
  };

  const focusInput = () => {
    if (inputEl && !isLocked) {
      inputEl.focus({ preventScroll: true });
      return;
    }
    slotsEl.focus();
  };

  buttonEl.addEventListener("click", checkGuess);
  slotsEl.addEventListener("keydown", handleKey);
  slotsEl.addEventListener("click", focusInput);
  resetEl.addEventListener("click", resetGuess);
  if (inputEl) {
    inputEl.addEventListener("input", handleInput);
    inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        checkGuess();
      }
    });
  }

  revealEl.addEventListener("click", () => {
    storeQuickGuessState(todayKey, "revealed");
    setSolvedState("revealed");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && relatedModal && relatedModal.backdrop.classList.contains("is-open")) {
      closeRelatedModal();
    }
  });

  const storedState = loadQuickGuessState(todayKey);
  if (storedState) {
    setSolvedState(storedState.status);
  }

  renderSlots();
}

window.VokabulWords = {
  ...exported,
  getDailyWord,
  loadDailyWord,
  loadQuickGuess
};

loadDailyWord();
loadQuickGuess();
