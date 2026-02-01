(function () {
  const storage = window.VokabulStorage;
  if (storage) {
    storage.migrateStorageIfNeeded();
  }

  const STORAGE_KEY = storage?.keys?.ADMIN_WORDS || "vokabul_admin_words";

  const sections = {
    dailyWords: {
      label: "Dagens ord",
      description: "Her velger du ord som vises som dagens hovedord på forsiden."
    },
    quickGuess: {
      label: "Dagens gjett",
      description: "Beskrivelsen blir brukt som ledetråd i dagens gjett."
    },
        dailySynonyms: {
      label: "Dagens synonym",
      description: "Minst ett synonym er nødvendig for at dagens synonym skal fungere."
    },
    allWords: {
      label: "Alle ord",
      description: "Her ser du hele databasen og kan velge hvor ordet skal brukes."
    }
  };

  const state = {
    section: "dailyWords",
    editIndex: null,
    allWordsQuery: "",
    allWordsFilter: "all",
    data: {
      dailyWords: [],
      quickGuess: [],
      dailySynonyms: []
    }
  };

  const navButtons = Array.from(document.querySelectorAll(".admin-nav-item"));
  const titleEl = document.getElementById("admin-title");
  const descriptionEl = document.getElementById("admin-description");
  const clearButton = document.getElementById("admin-clear");
  const form = document.getElementById("admin-form");
  const stateEl = document.getElementById("admin-state");
  const listEl = document.getElementById("admin-list");
  const countEl = document.getElementById("admin-count");
  const cancelButton = document.getElementById("admin-cancel");
  const editorEl = document.getElementById("admin-editor");
  const allWordsPanel = document.getElementById("admin-allwords");
  const searchInput = document.getElementById("admin-search");
  const allWordsListEl = document.getElementById("admin-allwords-list");
  const allWordsCountEl = document.getElementById("admin-allwords-count");
  const filterButtons = Array.from(document.querySelectorAll(".admin-filter"));

  const fields = {
    word: document.getElementById("admin-word"),
    desc: document.getElementById("admin-desc"),
    meaning: document.getElementById("admin-meaning"),
    usage: document.getElementById("admin-usage"),
    type: document.getElementById("admin-type"),
    examples: document.getElementById("admin-examples"),
    synonyms: document.getElementById("admin-synonyms"),
    see: document.getElementById("admin-see")
  };

  const sanitizeText = (value) => String(value || "").trim();
  const normalizeWord = (value) =>
    String(value || "").toLowerCase().trim().replace(/\s+/g, "");
  const parseLines = (value) =>
    String(value || "")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length);
  const parseCommaList = (value) =>
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length);

  const toAdminEntry = (entry) => {
    if (!entry) return null;
    const word = sanitizeText(entry.word);
    if (!word) return null;
    const desc = sanitizeText(entry.desc || entry.meaning);
    const meaning = sanitizeText(entry.meaning || entry.desc);
    return {
      word,
      desc: desc || meaning,
      meaning: meaning || desc,
      usage: sanitizeText(entry.usage),
      type: sanitizeText(entry.type),
      examples: Array.isArray(entry.examples)
        ? entry.examples.map((item) => sanitizeText(item)).filter(Boolean)
        : [],
      synonyms: Array.isArray(entry.synonyms)
        ? entry.synonyms.map((item) => sanitizeText(item)).filter(Boolean)
        : [],
      see: sanitizeText(entry.see)
    };
  };

  const baseData = window.VokabulWordsData || {};
  const baseWords = [
    ...(baseData.nouns || []),
    ...(baseData.adjectives || []),
    ...(baseData.verbs || [])
  ];

  const getDefaultListForSection = (section) => {
    if (section === "dailyWords") {
      return baseWords
        .filter((word) => word?.useInDaily === true)
        .map(toAdminEntry)
        .filter(Boolean);
    }
    if (section === "quickGuess") {
      return baseWords
        .filter((word) => word?.useInQuickGuess === true)
        .map(toAdminEntry)
        .filter(Boolean);
    }
    if (section === "dailySynonyms") {
      return baseWords
        .filter(
          (word) =>
            word?.useInDailySynonym === true &&
            Array.isArray(word.synonyms) &&
            word.synonyms.length
        )
        .map(toAdminEntry)
        .filter(Boolean);
    }
    return [];
  };

  const loadData = () => {
    let raw = null;
    try {
      if (storage?.readJson) {
        raw = storage.readJson(STORAGE_KEY, null);
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        raw = stored ? JSON.parse(stored) : null;
      }
    } catch (error) {
      raw = null;
    }
    const normalizeList = (list) =>
      Array.isArray(list) ? list.map(toAdminEntry).filter(Boolean) : [];
    state.data = {
      dailyWords: normalizeList(raw?.dailyWords),
      quickGuess: normalizeList(raw?.quickGuess),
      dailySynonyms: normalizeList(raw?.dailySynonyms)
    };
  };

  const saveData = () => {
    const payload = {
      ...state.data,
      updatedAt: new Date().toISOString()
    };
    try {
      if (storage?.writeJson) {
        storage.writeJson(STORAGE_KEY, payload);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const setStatus = (message) => {
    if (!stateEl) return;
    stateEl.textContent = message;
  };

  const clearStatus = () => {
    if (!stateEl) return;
    stateEl.textContent = "";
  };

  const resetForm = () => {
    form.reset();
    state.editIndex = null;
    clearStatus();
  };

  const buildEntryFromForm = () => {
    const word = sanitizeText(fields.word.value);
    const desc = sanitizeText(fields.desc.value);
    const meaning = sanitizeText(fields.meaning.value);
    const usage = sanitizeText(fields.usage.value);
    const type = sanitizeText(fields.type.value);
    const examples = parseLines(fields.examples.value);
    const synonyms = parseCommaList(fields.synonyms.value);
    const see = sanitizeText(fields.see.value);

    return {
      word,
      desc: desc || meaning,
      meaning: meaning || desc,
      usage,
      type,
      examples,
      synonyms,
      see
    };
  };

  const validateEntry = (entry) => {
    if (!entry.word) {
      return "Skriv inn et ord.";
    }
    if (state.section === "dailyWords" && !entry.desc) {
      return "Dagens ord trenger en beskrivelse.";
    }
    if (state.section === "quickGuess" && !entry.desc) {
      return "Dagens gjett trenger en beskrivelse/ledetråd.";
    }
    if (state.section === "dailySynonyms" && entry.synonyms.length === 0) {
      return "Dagens synonym trenger minst ett synonym.";
    }
    return "";
  };

  const renderList = () => {
    const list = getEffectiveList(state.section);
    const isDefault = (state.data[state.section] || []).length === 0;
    if (countEl) {
      if (!list.length) {
        countEl.textContent = "Ingen ord";
      } else if (isDefault) {
        countEl.textContent = `${list.length} ord (standardliste)`;
      } else {
        countEl.textContent = `${list.length} ord`;
      }
    }
    listEl.innerHTML = "";

    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "admin-empty";
      empty.textContent = "Ingen ord her enn�. Legg til ord eller bruk standardlisten.";
      listEl.appendChild(empty);
      return;
    }

    list.forEach((entry, index) => {
      const card = document.createElement("article");
      card.className = "admin-card";

      const header = document.createElement("div");
      header.className = "admin-card-header";

      const title = document.createElement("div");
      title.className = "admin-card-title";
      title.textContent = entry.word;
      header.appendChild(title);

      if (entry.type) {
        const type = document.createElement("div");
        type.className = "admin-card-type";
        type.textContent = entry.type;
        header.appendChild(type);
      }

      card.appendChild(header);

      if (entry.desc || entry.meaning) {
        const desc = document.createElement("p");
        desc.className = "admin-card-desc";
        desc.textContent = entry.desc || entry.meaning;
        card.appendChild(desc);
      }

      if (entry.synonyms && entry.synonyms.length) {
        const tags = document.createElement("div");
        tags.className = "admin-card-tags";
        entry.synonyms.slice(0, 6).forEach((synonym) => {
          const tag = document.createElement("span");
          tag.className = "admin-tag";
          tag.textContent = synonym;
          tags.appendChild(tag);
        });
        card.appendChild(tags);
      }

      if (entry.examples && entry.examples.length) {
        const tags = document.createElement("div");
        tags.className = "admin-card-tags";
        entry.examples.slice(0, 2).forEach((example) => {
          const tag = document.createElement("span");
          tag.className = "admin-tag";
          tag.textContent = example;
          tags.appendChild(tag);
        });
        card.appendChild(tags);
      }

      const actions = document.createElement("div");
      actions.className = "admin-card-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.textContent = "Rediger";
      editBtn.addEventListener("click", () => {
        ensureAdminListSeeded(state.section);
        const listIndex = state.data[state.section].findIndex((item) => normalizeWord(item.word) === normalizeWord(entry.word));
        state.editIndex = listIndex === -1 ? null : listIndex;
        fields.word.value = entry.word || "";
        fields.desc.value = entry.desc || "";
        fields.meaning.value = entry.meaning || "";
        fields.usage.value = entry.usage || "";
        fields.type.value = entry.type || "";
        fields.examples.value = (entry.examples || []).join("\n");
        fields.synonyms.value = (entry.synonyms || []).join(", ");
        fields.see.value = entry.see || "";
        setStatus("Redigerer ordet \"" + entry.word + "\".");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "Slett";
      deleteBtn.addEventListener("click", () => {
        const ok = window.confirm("Slette \"" + entry.word + "\" fra listen?");
        if (!ok) return;
        ensureAdminListSeeded(state.section);
        const listIndex = state.data[state.section].findIndex((item) => normalizeWord(item.word) === normalizeWord(entry.word));
        if (listIndex !== -1) {
          state.data[state.section].splice(listIndex, 1);
        }
        saveData();
        renderList();
        renderAllWords();
        resetForm();
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      card.appendChild(actions);

      listEl.appendChild(card);
    });
  };

  const getEffectiveList = (section) => {
    const list = state.data[section] || [];
    if (list.length) {
      return list;
    }
    return getDefaultListForSection(section);
  };

  const getAllWords = () => {
    const map = new Map();
    baseWords.forEach((word) => {
      const entry = toAdminEntry(word);
      if (entry) {
        map.set(normalizeWord(entry.word), entry);
      }
    });
    ["dailyWords", "quickGuess", "dailySynonyms"].forEach((section) => {
      (state.data[section] || []).forEach((entry) => {
        const normalized = normalizeWord(entry.word);
        if (!normalized) return;
        const cleaned = toAdminEntry(entry);
        if (!cleaned) return;
        map.set(normalized, cleaned);
      });
    });
    return Array.from(map.values()).sort((a, b) =>
      a.word.localeCompare(b.word, "no", { sensitivity: "base" })
    );
  };

  const ensureAdminListSeeded = (section) => {
    if (state.data[section] && state.data[section].length) {
      return;
    }
    state.data[section] = getDefaultListForSection(section);
  };

  const setWordIncluded = (entry, section, include) => {
    if (!entry) return;
    ensureAdminListSeeded(section);
    const list = state.data[section];
    const normalized = normalizeWord(entry.word);
    const index = list.findIndex((item) => normalizeWord(item.word) === normalized);
    if (include) {
      if (index === -1) {
        list.push(toAdminEntry(entry));
      }
    } else if (index !== -1) {
      list.splice(index, 1);
    }
    saveData();
    if (state.section === section) {
      renderList();
    }
    renderAllWords();
  };

  const matchesQuery = (entry, query) => {
    const cleanedQuery = normalizeWord(query);
    if (!cleanedQuery) return true;
    const haystack = [
      entry.word,
      entry.desc,
      entry.meaning,
      entry.usage,
      (entry.examples || []).join(" "),
      (entry.synonyms || []).join(" ")
    ]
      .join(" ")
      .toLowerCase();
    return normalizeWord(haystack).includes(cleanedQuery);
  };

  const renderAllWords = () => {
    if (!allWordsListEl) return;
    const query = state.allWordsQuery;
    const filter = state.allWordsFilter;
    const effectiveSets = {
      dailyWords: new Set(
        getEffectiveList("dailyWords").map((item) => normalizeWord(item.word))
      ),
      quickGuess: new Set(
        getEffectiveList("quickGuess").map((item) => normalizeWord(item.word))
      ),
      dailySynonyms: new Set(
        getEffectiveList("dailySynonyms").map((item) => normalizeWord(item.word))
      )
    };

    const allWords = getAllWords();
    const filtered = allWords.filter((entry) => {
      const normalized = normalizeWord(entry.word);
      if (filter !== "all" && !effectiveSets[filter]?.has(normalized)) {
        return false;
      }
      return matchesQuery(entry, query);
    });

    if (allWordsCountEl) {
      allWordsCountEl.textContent = filtered.length
        ? `${filtered.length} ord`
        : "Ingen treff";
    }

    allWordsListEl.innerHTML = "";
    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "admin-empty";
      empty.textContent = "Ingen ord som matcher sÃ¸ket.";
      allWordsListEl.appendChild(empty);
      return;
    }

    filtered.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "admin-card";

      const header = document.createElement("div");
      header.className = "admin-card-header";

      const title = document.createElement("div");
      title.className = "admin-card-title";
      title.textContent = entry.word;
      header.appendChild(title);

      if (entry.type) {
        const type = document.createElement("div");
        type.className = "admin-card-type";
        type.textContent = entry.type;
        header.appendChild(type);
      }

      card.appendChild(header);

      if (entry.desc || entry.meaning) {
        const desc = document.createElement("p");
        desc.className = "admin-card-desc";
        desc.textContent = entry.desc || entry.meaning;
        card.appendChild(desc);
      }

      const meta = document.createElement("div");
      meta.className = "admin-word-meta";

      const toggles = document.createElement("div");
      toggles.className = "admin-toggles";

      const createToggle = (label, section) => {
        const wrapper = document.createElement("label");
        wrapper.className = "admin-toggle";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = effectiveSets[section].has(normalizeWord(entry.word));
        input.addEventListener("change", () => {
          setWordIncluded(entry, section, input.checked);
        });
        const text = document.createElement("span");
        text.textContent = label;
        wrapper.appendChild(input);
        wrapper.appendChild(text);
        return wrapper;
      };

      toggles.appendChild(createToggle("Dagens ord", "dailyWords"));
      toggles.appendChild(createToggle("Dagens gjett", "quickGuess"));
      toggles.appendChild(createToggle("Dagens synonym", "dailySynonyms"));

      meta.appendChild(toggles);
      card.appendChild(meta);

      if (entry.synonyms && entry.synonyms.length) {
        const tags = document.createElement("div");
        tags.className = "admin-card-tags";
        entry.synonyms.slice(0, 6).forEach((synonym) => {
          const tag = document.createElement("span");
          tag.className = "admin-tag";
          tag.textContent = synonym;
          tags.appendChild(tag);
        });
        card.appendChild(tags);
      }

      allWordsListEl.appendChild(card);
    });
  };

  const updateHeader = () => {
    const section = sections[state.section];
    if (titleEl) titleEl.textContent = section.label;
    if (descriptionEl) descriptionEl.textContent = section.description;
    clearStatus();
  };

  const setSection = (nextSection) => {
    if (!sections[nextSection]) return;
    state.section = nextSection;
    state.editIndex = null;
    document.body.classList.toggle("is-allwords", nextSection === "allWords");
    navButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.section === nextSection);
    });
    updateHeader();
    const isAllWords = nextSection === "allWords";
    if (editorEl) {
      editorEl.hidden = isAllWords;
    }
    if (allWordsPanel) {
      allWordsPanel.hidden = !isAllWords;
    }
    if (clearButton) {
      clearButton.style.display = isAllWords ? "none" : "";
    }
    if (!isAllWords) {
      resetForm();
      renderList();
    } else {
      renderAllWords();
    }
  };

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setSection(button.dataset.section);
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.allWordsQuery = normalizeWord(searchInput.value);
      renderAllWords();
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextFilter = button.dataset.filter || "all";
      state.allWordsFilter = nextFilter;
      filterButtons.forEach((item) => {
        item.classList.toggle("is-active", item.dataset.filter === nextFilter);
      });
      renderAllWords();
    });
  });

  clearButton.addEventListener("click", () => {
    if (state.section === "allWords") {
      return;
    }
    const ok = window.confirm(
      "Fjerne alle egne ord i denne seksjonen? Da brukes standardlisten igjen."
    );
    if (!ok) return;
    state.data[state.section] = [];
    saveData();
    renderList();
    renderAllWords();
    resetForm();
    setStatus("Standardlisten er aktivert.");
  });

  cancelButton.addEventListener("click", () => {
    resetForm();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const entry = buildEntryFromForm();
    const error = validateEntry(entry);
    if (error) {
      setStatus(error);
      return;
    }
    if (state.editIndex !== null) {
      state.data[state.section][state.editIndex] = entry;
    } else {
      state.data[state.section].push(entry);
    }
    saveData();
    renderList();
    renderAllWords();
    resetForm();
    setStatus("Ordet er lagret.");
  });

  loadData();
  setSection(state.section);
})();





