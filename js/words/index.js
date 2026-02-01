const data = window.VokabulWordsData || {};
const nouns = data.nouns || [];
const adjectives = data.adjectives || [];
const verbs = data.verbs || [];

const baseWordPool = [...nouns, ...adjectives, ...verbs];

// Preserve the original daily rotation order while grouping by word class.
const baseAllWords = [
  ...nouns.slice(0, 8),
  ...adjectives,
  ...nouns.slice(8),
  ...verbs
].filter((word) => word?.useInDaily === true);

let wordPool = [...baseWordPool];
let allWords = [...baseAllWords];
let quickGuessWords = baseWordPool.filter((word) => word?.useInQuickGuess === true);
let dailySynonymWords = baseAllWords.filter(
  (word) => word?.useInDailySynonym === true && Array.isArray(word.synonyms) && word.synonyms.length
);

function normalizeGuess(value) {
  return String(value || "").toLowerCase().trim().replace(/\s+/g, "");
}

const storage = window.VokabulStorage;
if (storage) {
  storage.migrateStorageIfNeeded();
}

const ADMIN_WORDS_KEY = storage?.keys?.ADMIN_WORDS || "vokabul_admin_words";
const quickGuessStorageKey = storage?.keys?.QUICK_GUESS || "vokabulQuickGuess";
const dailySynonymStorageKey = storage?.keys?.DAILY_SYNONYM || "vokabulDailySynonym";

const sanitizeText = (value) => String(value || "").trim();
const sanitizeList = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => String(item || "").trim())
        .filter((item) => item.length)
    : [];

const sanitizeWordEntry = (entry) => {
  if (!entry || !entry.word) {
    return null;
  }
  const word = sanitizeText(entry.word);
  if (!word) {
    return null;
  }
  const desc = sanitizeText(entry.desc || entry.meaning);
  const meaning = sanitizeText(entry.meaning || entry.desc);
  return {
    word,
    desc: desc || meaning,
    meaning: meaning || desc,
    usage: sanitizeText(entry.usage),
    type: sanitizeText(entry.type),
    examples: sanitizeList(entry.examples),
    synonyms: sanitizeList(entry.synonyms),
    see: sanitizeText(entry.see)
  };
};

const loadAdminWordData = () => {
  let raw = null;
  try {
    if (storage?.readJson) {
      raw = storage.readJson(ADMIN_WORDS_KEY, null);
    } else {
      const stored = localStorage.getItem(ADMIN_WORDS_KEY);
      raw = stored ? JSON.parse(stored) : null;
    }
  } catch (error) {
    raw = null;
  }

  const normalizeList = (value) =>
    Array.isArray(value) ? value.map(sanitizeWordEntry).filter(Boolean) : [];

  return {
    dailyWords: normalizeList(raw?.dailyWords),
    quickGuess: normalizeList(raw?.quickGuess),
    dailySynonyms: normalizeList(raw?.dailySynonyms)
  };
};

const adminData = loadAdminWordData();
const adminDailyWords = adminData.dailyWords;
const adminQuickGuessWords = adminData.quickGuess.filter((word) => word.desc);
const adminDailySynonymWords = adminData.dailySynonyms.filter(
  (word) => Array.isArray(word.synonyms) && word.synonyms.length
);

const adminWordPool = [...adminDailyWords, ...adminQuickGuessWords, ...adminDailySynonymWords];
if (adminWordPool.length) {
  wordPool = [...wordPool, ...adminWordPool];
}
if (adminDailyWords.length) {
  allWords = adminDailyWords;
}
if (adminQuickGuessWords.length) {
  quickGuessWords = adminQuickGuessWords;
}
if (adminDailySynonymWords.length) {
  dailySynonymWords = adminDailySynonymWords;
}

const exported = {
  adjectives,
  allWords,
  nouns,
  verbs
};

const wordLookup = new Map(
  wordPool.map((word) => [normalizeGuess(String(word.word || "")), word])
);

const getWordDetails = (wordKey) => {
  const normalized = normalizeGuess(wordKey);
  if (!normalized) {
    return null;
  }
  const wordData = wordLookup.get(normalized);
  if (!wordData) {
    return null;
  }
  return {
    title: wordData.word,
    meaning: wordData.meaning || wordData.desc || "",
    usage: wordData.usage || "",
    example: (wordData.examples && wordData.examples[0]) || wordData.example || "",
    type: wordData.type || ""
  };
};

function getDailyWord(date, words = allWords) {
  if (!Array.isArray(words) || words.length === 0) {
    return null;
  }
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
  const details = getWordDetails(wordKey);
  if (details) {
    return details;
  }
  return {
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
    usage: "Brukes ofte med en/ei/et og kan bÃ¸yes i bestemt/ubestemt.",
    example: "En bok, ei dÃ¸r, et hus.",
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
    usage: "BÃ¸yes ofte etter kjÃ¸nn, tall og bestemt form.",
    example: "En rÃ¸d bil, et rÃ¸dt hus, rÃ¸de biler.",
    type: "Ordklasse"
  },
  verb: {
    title: "Verb",
    meaning: "Ord som uttrykker handling eller tilstand.",
    usage: "BÃ¸yes i tid og kan ha infinitiv, presens, preteritum.",
    example: "Ã¥ lÃ¸pe, lÃ¸per, lÃ¸p.",
    type: "Ordklasse"
  },
  adverb: {
    title: "Adverb",
    meaning: "Ord som beskriver hvordan, nÃ¥r eller hvor noe skjer.",
    usage: "BÃ¸yes ikke og kan ofte flyttes i setningen.",
    example: "Han lÃ¸p raskt, hun kommer snart.",
    type: "Ordklasse"
  },
  preposisjon: {
    title: "Preposisjon",
    meaning: "Ord som viser forhold mellom andre ord.",
    usage: "StÃ¥r ofte foran substantiv eller pronomen.",
    example: "pÃ¥ bordet, under stolen.",
    type: "Ordklasse"
  },
  pronomen: {
    title: "Pronomen",
    meaning: "Ord som stÃ¥r i stedet for substantiv.",
    usage: "BÃ¸yes etter person og kasus.",
    example: "jeg, du, han, den.",
    type: "Ordklasse"
  },
  konjunksjon: {
    title: "Konjunksjon",
    meaning: "Binder sammen ord eller setninger.",
    usage: "StÃ¥r mellom setningsledd eller helsetninger.",
    example: "og, men, eller.",
    type: "Ordklasse"
  },
  interjeksjon: {
    title: "Interjeksjon",
    meaning: "Utrop eller uttrykk som viser fÃ¸lelse.",
    usage: "StÃ¥r ofte alene i setningen.",
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
    meaning: "Vi har ikke en forklaring klar for denne ordklassen ennÃ¥.",
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

  if (!dailyWord) {
    titleEl.textContent = "Ingen ord tilgjengelig";
    descEl.textContent = "Legg til ord i adminpanelet for å aktivere Dagens ord.";
    if (examplesEl) {
      examplesEl.innerHTML = "";
    }
    if (synonymsEl) {
      synonymsEl.innerHTML = "";
    }
    metaEl.textContent = "";
    if (dateEl) {
      dateEl.textContent = today.toLocaleDateString("no-NO", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    }
    return;
  }

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

function loadDailySynonymState(todayKey) {
  try {
    let data = null;
    if (storage?.readJson) {
      data = storage.readJson(dailySynonymStorageKey, null);
    } else {
      const raw = localStorage.getItem(dailySynonymStorageKey);
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

function storeDailySynonymState(todayKey, status) {
  try {
    if (!status) {
      if (storage?.remove) {
        storage.remove(dailySynonymStorageKey);
      } else {
        localStorage.removeItem(dailySynonymStorageKey);
      }
      return;
    }
    if (storage?.writeJson) {
      storage.writeJson(dailySynonymStorageKey, { date: todayKey, status });
      return;
    }
    localStorage.setItem(dailySynonymStorageKey, JSON.stringify({ date: todayKey, status }));
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
  const cardEl = clueEl?.closest(".quick-card") || document.querySelector("#dagens-gjett .quick-card");

  if (!clueEl || !slotsEl || !buttonEl || !revealEl || !resetEl || !feedbackEl) {
    return;
  }

  const today = new Date();
  const todayKey = getTodayKey(today);
  const quickWord = getDailyWord(today, quickGuessWords);
  if (!quickWord) {
    clueEl.textContent = "Ingen oppgave tilgjengelig.";
    slotsEl.setAttribute("aria-disabled", "true");
    slotsEl.classList.add("is-locked");
    buttonEl.style.display = "none";
    revealEl.style.display = "none";
    resetEl.style.display = "none";
    return;
  }
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
    const details = getWordDetails(wordKey);
    if (details) {
      return details;
    }
    return {
      title: wordKey || "Ord",
      meaning: "Vi har ikke en forklaring klar for dette ordet ennÃ¥.",
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

    const exampleValue = (wordData.examples && wordData.examples[0]) || wordData.example;
    if (exampleValue) {
      const exampleTitle = document.createElement("div");
      exampleTitle.className = "quick-detail-heading";
      exampleTitle.textContent = "Eksempel";
      detail.appendChild(exampleTitle);

      const example = document.createElement("p");
      example.className = "quick-detail-example";
      const exampleText = document.createElement("em");
      exampleText.textContent = exampleValue;
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
      setFeedback("success", "Du klarte dagens gjett - ordet er \"" + quickWord.word + "\".", detail);
    } else {
      setFeedback("warn", "Ordet er \"" + quickWord.word + "\".", detail);
    }
    if (cardEl) {
      cardEl.classList.remove("is-solved", "is-revealed");
      cardEl.classList.add(status === "solved" ? "is-solved" : "is-revealed");
    }
    lockInput();
  };

  const resetGuess = () => {
    storeQuickGuessState(todayKey, "");
    for (let i = 0; i < guessLetters.length; i += 1) {
      guessLetters[i] = "";
    }
    if (cardEl) {
      cardEl.classList.remove("is-solved", "is-revealed");
    }
    unlockInput();
    setFeedback("warn", "Dagens gjett er resatt.");
    renderSlots();
    slotsEl.focus();
  };

  const checkGuess = () => {
    if (guessLetters.includes("")) {
      setFeedback("warn", "Fyll inn alle bokstavene fÃ¸rst.");
      return;
    }

    const guess = normalizeGuess(guessLetters.join(""));
    const answer = normalizeGuess(quickWord.word);

    if (!guess) {
      setFeedback("warn", "Skriv inn et ord fÃ¸rst.");
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

function loadDailySynonymGame() {
  const wordEl = document.getElementById("synonym-word");
  const slotsEl = document.getElementById("synonym-slots");
  const inputEl = document.getElementById("synonym-input");
  const buttonEl = document.getElementById("synonym-check");
  const revealEl = document.getElementById("synonym-reveal");
  const resetEl = document.getElementById("synonym-reset");
  const feedbackEl = document.getElementById("synonym-feedback");
  const cardEl = wordEl?.closest(".quick-card") || document.querySelector("#dagens-synonym .quick-card");

  if (!wordEl || !slotsEl || !buttonEl || !revealEl || !resetEl || !feedbackEl) {
    return;
  }

  if (!dailySynonymWords.length) {
    wordEl.textContent = "Ikke tilgjengelig i dag.";
    slotsEl.setAttribute("aria-disabled", "true");
    slotsEl.classList.add("is-locked");
    buttonEl.style.display = "none";
    revealEl.style.display = "none";
    resetEl.style.display = "none";
    return;
  }

  const today = new Date();
  const todayKey = getTodayKey(today);
  const dailyWord = getDailyWord(today, dailySynonymWords);
  const synonyms = Array.isArray(dailyWord.synonyms) ? dailyWord.synonyms : [];
  const normalizedSynonyms = synonyms.map((item) => normalizeGuess(item)).filter(Boolean);
  const maxLength = normalizedSynonyms.length
    ? Math.max(...normalizedSynonyms.map((item) => item.length))
    : dailyWord.word
        ? normalizeGuess(dailyWord.word).length
        : 0;

  wordEl.textContent = dailyWord.word;

  const guessLetters = Array.from({ length: maxLength }, () => "");
  let isLocked = false;
  const validLetter = /[a-zA-ZæøåÆØÅ]/;

  if (inputEl) {
    inputEl.setAttribute("maxlength", String(maxLength));
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

  const renderSlots = () => {
    slotsEl.innerHTML = "";
    let activeSet = false;
    guessLetters.forEach((letter) => {
      const slot = document.createElement("span");
      slot.className = "quick-slot";
      slot.textContent = letter ? letter : "";
      if (!letter && !isLocked && !activeSet) {
        slot.classList.add("is-active");
        activeSet = true;
      }
      slotsEl.appendChild(slot);
    });
    syncInputValue();
  };

  const buildSynonymDetail = () => {
    const detail = document.createElement("div");
    detail.className = "quick-detail";

    const wordTitle = document.createElement("div");
    wordTitle.className = "quick-detail-word";
    wordTitle.textContent = dailyWord.word;
    detail.appendChild(wordTitle);

    const meaningTitle = document.createElement("div");
    meaningTitle.className = "quick-detail-heading";
    meaningTitle.textContent = "Betydning";
    detail.appendChild(meaningTitle);

    const meaning = document.createElement("p");
    meaning.className = "quick-detail-body";
    meaning.textContent = dailyWord.desc || "Ingen forklaring lagt inn ennå.";
    detail.appendChild(meaning);

    if (dailyWord.examples && dailyWord.examples.length) {
      const exampleTitle = document.createElement("div");
      exampleTitle.className = "quick-detail-heading";
      exampleTitle.textContent = "Eksempel";
      detail.appendChild(exampleTitle);

      const example = document.createElement("p");
      example.className = "quick-detail-example";
      const exampleText = document.createElement("em");
      exampleText.textContent = dailyWord.examples[0];
      example.appendChild(exampleText);
      detail.appendChild(example);
    }

    if (synonyms.length) {
      const synonymTitle = document.createElement("div");
      synonymTitle.className = "quick-detail-heading";
      synonymTitle.textContent = "Synonymer";
      detail.appendChild(synonymTitle);

      const synonymsWrap = document.createElement("div");
      synonymsWrap.className = "daily-tags";
      synonyms.forEach((item) => {
        const tag = document.createElement("span");
        tag.className = "daily-tag";
        tag.textContent = item;
        synonymsWrap.appendChild(tag);
      });
      detail.appendChild(synonymsWrap);
    }

    if (dailyWord.type) {
      const meta = document.createElement("button");
      meta.type = "button";
      meta.className = "quick-detail-meta quick-detail-meta-button";
      meta.textContent = "Ordklasse: " + dailyWord.type;
      meta.dataset.wordClass = dailyWord.type;
      meta.addEventListener("click", () => openWordClassModal(dailyWord.type));
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

  const setSolvedState = (status, solvedWord) => {
    const detail = buildSynonymDetail();
    const revealWord =
      status === "solved"
        ? solvedWord || synonyms[0]
        : synonyms[0] || solvedWord;
    if (revealWord) {
      const revealLetters = Array.from(normalizeGuess(revealWord));
      for (let i = 0; i < guessLetters.length; i += 1) {
        guessLetters[i] = revealLetters[i] || "";
      }
      renderSlots();
    }
    if (status === "solved") {
      setFeedback("success", "Riktig! Ett synonym til " + dailyWord.word + " er \"" + revealWord + "\".", detail);
    } else {
      const labelWord = revealWord || "et synonym";
      setFeedback("warn", "Et synonym til " + dailyWord.word + " er \"" + labelWord + "\".", detail);
    }
    if (cardEl) {
      cardEl.classList.remove("is-solved", "is-revealed");
      cardEl.classList.add(status === "solved" ? "is-solved" : "is-revealed");
    }
    lockInput();
  };

  const resetGuess = () => {
    storeDailySynonymState(todayKey, "");
    for (let i = 0; i < guessLetters.length; i += 1) {
      guessLetters[i] = "";
    }
    if (cardEl) {
      cardEl.classList.remove("is-solved", "is-revealed");
    }
    unlockInput();
    setFeedback("warn", "Dagens synonym er resatt.");
    renderSlots();
    slotsEl.focus();
  };

  const checkGuess = () => {
    const guess = normalizeGuess(guessLetters.join(""));
    if (!guess) {
      setFeedback("warn", "Skriv inn et synonym fÃ¸rst.");
      return;
    }
    if (normalizedSynonyms.includes(guess)) {
      storeDailySynonymState(todayKey, "solved");
      setSolvedState("solved", guess);
    } else {
      setFeedback("error", "Ikke helt. Prøv et annet synonym.");
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
    if (normalizedSynonyms.includes(cleaned)) {
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
    storeDailySynonymState(todayKey, "revealed");
    setSolvedState("revealed");
  });

  const storedState = loadDailySynonymState(todayKey);
  if (storedState) {
    setSolvedState(storedState.status);
  }

  renderSlots();
}

window.VokabulWords = {
  ...exported,
  getDailyWord,
  loadDailyWord,
  loadQuickGuess,
  loadDailySynonymGame
};

loadDailyWord();
loadQuickGuess();
loadDailySynonymGame();
