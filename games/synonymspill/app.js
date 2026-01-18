// Synonymspill - norsk ordtrening uten engelske ord i spillet.

const CONFIG = {
    totalTasks: 10,
    maxAttempts: 3,
    pointsPerCorrect: 1,
    pointsWrong: -1,
    bonusPerfect: 1,
};

const DIFFICULTY = {
    easy: { label: "Enkel", showTarget: true, hintCount: 2 },
    medium: { label: "Middels", showTarget: true, hintCount: 1 },
    hard: { label: "Vanskelig", showTarget: false, hintCount: 1 },
};

const TASKS = [
    {
        id: "glad",
        targetWord: "glad",
        sentence: "Hun ble veldig {blank} da hun fikk vite at hun hadde best\u00e5tt pr\u00f8ven.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["forn\u00f8yd", "lykkelig", "tilfreds"],
        hints: ["F\u00f8lelse", "Adjektiv"],
    },
    {
        id: "sint",
        targetWord: "sint",
        sentence: "Han ble {blank} da han oppdaget at avtalen ikke ble holdt.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["irritert", "sur", "rasende"],
        hints: ["F\u00f8lelse", "Adjektiv"],
    },
    {
        id: "rask",
        targetWord: "rask",
        sentence: "Hun tok en {blank} beslutning og l\u00f8ste problemet med \u00e9n gang.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["hurtig", "kjapp", "effektiv"],
        hints: ["Tempo", "Adjektiv"],
    },
    {
        id: "snill",
        targetWord: "snill",
        sentence: "Det var {blank} av ham \u00e5 hjelpe naboen uten \u00e5 bli spurt.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["vennlig", "hyggelig", "omtenksom"],
        hints: ["Egenskap", "Adjektiv"],
    },
    {
        id: "trott",
        targetWord: "tr\u00f8tt",
        sentence: "Etter en lang dag p\u00e5 jobb var han helt {blank}.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["sliten", "utmattet", "trett"],
        hints: ["Tilstand", "Adjektiv"],
    },
    {
        id: "stor",
        targetWord: "stor",
        sentence: "De kj\u00f8pte et {blank} hus med plass til hele familien.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["sv\u00e6r", "enorm", "diger"],
        hints: ["St\u00f8rrelse", "Adjektiv"],
    },
    {
        id: "liten",
        targetWord: "liten",
        sentence: "Hun bodde i en {blank} leilighet midt i byen.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["bitteliten", "kompakt", "beskjeden"],
        hints: ["St\u00f8rrelse", "Adjektiv"],
    },
    {
        id: "vanskelig",
        targetWord: "vanskelig",
        sentence: "Dette er en {blank} oppgave som krever mye konsentrasjon.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["krevende", "komplisert", "utfordrende"],
        hints: ["Niv\u00e5", "Adjektiv"],
    },
    {
        id: "forsiktig",
        targetWord: "forsiktig",
        sentence: "Han var {blank} med ordene sine for ikke \u00e5 s\u00e5re noen.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["varsom", "aktsom", "tilbakeholden"],
        hints: ["Handling", "Adjektiv"],
    },
    {
        id: "overrasket",
        targetWord: "overrasket",
        sentence: "Hun ble helt {blank} da hun plutselig fikk bes\u00f8k.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["forbauset", "paff", "m\u00e5ll\u00f8s"],
        hints: ["F\u00f8lelse", "Adjektiv"],
    },
    {
        id: "palitelig",
        targetWord: "p\u00e5litelig",
        sentence: "Hun er en {blank} kollega som alltid gj\u00f8r det hun lover.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["troverdig", "til \u00e5 stole p\u00e5", "solid"],
        hints: ["Egenskap", "Adjektiv"],
    },
    {
        id: "noyaktig",
        targetWord: "n\u00f8yaktig",
        sentence: "For \u00e5 f\u00e5 riktig resultat m\u00e5 du v\u00e6re sv\u00e6rt {blank}.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["presis", "grundig", "omhyggelig"],
        hints: ["Arbeidsm\u00e5te", "Adjektiv"],
    },
    {
        id: "urolig",
        targetWord: "urolig",
        sentence: "Han f\u00f8lte seg {blank} f\u00f8r han skulle holde presentasjonen.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["engstelig", "rastl\u00f8s", "bekymret"],
        hints: ["F\u00f8lelse", "Adjektiv"],
    },
    {
        id: "avgjorende",
        targetWord: "avgj\u00f8rende",
        sentence: "Denne avgj\u00f8relsen var {blank} for prosjektets videre fremdrift.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["kritisk", "bestemmende", "utslagsgivende"],
        hints: ["Betydning", "Adjektiv"],
    },
    {
        id: "tilfeldig",
        targetWord: "tilfeldig",
        sentence: "Resultatet virket helt {blank} og uten noe m\u00f8nster.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["vilk\u00e5rlig", "tilfeldig valgt", "uten plan"],
        hints: ["M\u00f8nster", "Adjektiv"],
    },
    {
        id: "motvillig",
        targetWord: "motvillig",
        sentence: "Hun gikk med p\u00e5 forslaget, men gjorde det {blank}.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["n\u00f8lende", "uvillig", "skeptisk"],
        hints: ["Holdning", "Adjektiv"],
    },
    {
        id: "ambivalent",
        targetWord: "ambivalent",
        sentence: "Han f\u00f8lte seg {blank} til tilbudet og klarte ikke bestemme seg.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["splittet", "tvetydig", "usikker"],
        hints: ["F\u00f8lelse", "Adjektiv"],
    },
    {
        id: "implisitt",
        targetWord: "implisitt",
        sentence: "Kritikken var {blank}, men alle forstod hva som ble ment.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["underforst\u00e5tt", "indirekte", "ikke uttalt"],
        hints: ["Kommunikasjon", "Adjektiv"],
    },
    {
        id: "konsis",
        targetWord: "konsis",
        sentence: "Rapporten var {blank} og fri for un\u00f8dvendige detaljer.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["kortfattet", "presis", "poengtert"],
        hints: ["Spr\u00e5k", "Adjektiv"],
    },
    {
        id: "resignert",
        targetWord: "resignert",
        sentence: "Etter flere avslag svarte hun med en {blank} holdning.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["oppgitt", "f\u00f8yelig", "motl\u00f8s"],
        hints: ["Holdning", "Adjektiv"],
    },
    {
        id: "fundamental",
        targetWord: "fundamental",
        sentence: "Tillit er en {blank} forutsetning for et godt samarbeid.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["grunnleggende", "essensiell", "basal"],
        hints: ["Betydning", "Adjektiv"],
    },
    {
        id: "subjektiv",
        targetWord: "subjektiv",
        sentence: "Vurderingen hans var {blank} og preget av egne meninger.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["personlig", "partisk", "farget av egne meninger"],
        hints: ["Vurdering", "Adjektiv"],
    },
    {
        id: "pragmatisk",
        targetWord: "pragmatisk",
        sentence: "Hun valgte en {blank} l\u00f8sning fremfor en teoretisk perfekt.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["praktisk", "l\u00f8sningsorientert", "jordn\u00e6r"],
        hints: ["Arbeidsm\u00e5te", "Adjektiv"],
    },
    {
        id: "uforutsigbar",
        targetWord: "uforutsigbar",
        sentence: "V\u00e6ret i fjellet kan v\u00e6re sv\u00e6rt {blank}.",
        wordClass: "adjektiv",
        acceptedSynonyms: ["ustabil", "lunefull", "uventet"],
        hints: ["Egenskap", "Adjektiv"],
    },
];

const STORAGE_KEY = "synonymspill_v1";

function canUseStorage() {
    try {
        const key = "__synonymspill_test__";
        localStorage.setItem(key, "1");
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

const storageAvailable = canUseStorage();

function loadStore() {
    if (!storageAvailable)
        return { highScore: 0, practice: [], lastScore: 0, lastPerfect: 0 };
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { highScore: 0, practice: [], lastScore: 0, lastPerfect: 0 };
    try {
        const parsed = JSON.parse(raw);
        return {
            highScore: Number(parsed.highScore) || 0,
            practice: Array.isArray(parsed.practice) ? parsed.practice : [],
            lastScore: Number(parsed.lastScore) || 0,
            lastPerfect: Number(parsed.lastPerfect) || 0,
        };
    } catch {
        return { highScore: 0, practice: [], lastScore: 0, lastPerfect: 0 };
    }
}

function saveStore(store) {
    if (!storageAvailable) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

const store = loadStore();
const WORD_CLASS_INFO = {
    adjektiv: "Adjektiv beskriver egenskaper eller tilstander, som stor, rask eller rolig.",
    substantiv: "Substantiv er navn p\u00e5 ting, steder, personer eller ideer.",
    verb: "Verb beskriver handlinger eller noe som skjer, som \u00e5 l\u00f8pe eller \u00e5 tenke.",
    adverb: "Adverb beskriver hvordan, n\u00e5r eller hvor noe skjer, som raskt eller ofte.",
};

const el = {
    highScore: document.getElementById("highScore"),
    lastScore: document.getElementById("lastScore"),
    lastPerfect: document.getElementById("lastPerfect"),
    screenStart: document.getElementById("screenStart"),
    screenGame: document.getElementById("screenGame"),
    screenRound: document.getElementById("screenRound"),
    difficulty: document.getElementById("difficulty"),
    startGame: document.getElementById("startGame"),
    taskLabel: document.getElementById("taskLabel"),
    modeLabel: document.getElementById("modeLabel"),
    score: document.getElementById("score"),
    bonus: document.getElementById("bonus"),
    bonusBadge: document.getElementById("bonusBadge"),
    pointsPanel: document.getElementById("pointsPanel"),
    confetti: document.getElementById("confetti"),
    targetWord: document.getElementById("targetWord"),
    sentenceText: document.getElementById("sentenceText"),
    hints: document.getElementById("hints"),
    classButton: document.getElementById("classButton"),
    classInfo: document.getElementById("classInfo"),
    answerInput: document.getElementById("answerInput"),
    submitAnswer: document.getElementById("submitAnswer"),
    feedback: document.getElementById("feedback"),
    attemptList: document.getElementById("attemptList"),
    skipTask: document.getElementById("skipTask"),
    abortGame: document.getElementById("abortGame"),
    taskSummary: document.getElementById("taskSummary"),
    taskSummaryTitle: document.getElementById("taskSummaryTitle"),
    taskSummaryText: document.getElementById("taskSummaryText"),
    correctList: document.getElementById("correctList"),
    missingList: document.getElementById("missingList"),
    nextTask: document.getElementById("nextTask"),
    roundSummary: document.getElementById("roundSummary"),
    perfectCount: document.getElementById("perfectCount"),
    practiceList: document.getElementById("practiceList"),
    playAgain: document.getElementById("playAgain"),
    practiceMode: document.getElementById("practiceMode"),
    backToSummary: document.getElementById("backToSummary"),
};

const state = {
    tasks: [],
    taskIndex: 0,
    attempts: [],
    attempted: new Set(),
    found: new Set(),
    score: 0,
    bonus: 0,
    perfectCount: 0,
    practiceWords: [],
    mode: "main",
    difficulty: "easy",
    mainSummary: null,
    aborted: false,
    bonusTimer: null,
    confettiTimer: null,
};

function updateStartStats() {
    el.highScore.textContent = String(store.highScore || 0);
    if (el.lastScore) el.lastScore.textContent = String(store.lastScore || 0);
    if (el.lastPerfect) {
        el.lastPerfect.textContent = String(store.lastPerfect || 0);
    }
}

function normalizeText(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[.,!?;:()"]/g, "");
}

function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function setScreen(screen) {
    el.screenStart.classList.add("hidden");
    el.screenGame.classList.add("hidden");
    el.screenRound.classList.add("hidden");
    screen.classList.remove("hidden");
}

function setFeedback(text, type) {
    el.feedback.className = "feedback";
    if (type) el.feedback.classList.add(type);
    el.feedback.textContent = text;
}

function maskWord(word) {
    return word
        .split("")
        .map((ch) => (ch === " " ? " " : "_"))
        .join("");
}

function spawnConfetti() {
    const colors = [
        "#f2b21c",
        "#2c7a7b",
        "#f08a5d",
        "#6a4c93",
        "#3a86ff",
    ];
    el.confetti.innerHTML = "";
    for (let i = 0; i < 60; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        const left = Math.random() * 100;
        const delay = Math.random() * 120;
        const size = 8 + Math.random() * 8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = `${left}%`;
        piece.style.background = color;
        piece.style.width = `${size}px`;
        piece.style.height = `${size + 4}px`;
        piece.style.animationDelay = `${delay}ms`;
        piece.style.setProperty("--x", `${(Math.random() - 0.5) * 120}px`);
        el.confetti.appendChild(piece);
    }
    clearTimeout(state.confettiTimer);
    state.confettiTimer = setTimeout(() => {
        el.confetti.innerHTML = "";
    }, 1200);
}

function taskLabelText() {
    const total = state.tasks.length;
    const current = Math.min(state.taskIndex + 1, total);
    const prefix = state.mode === "practice" ? "\u00d8velse" : "Oppgave";
    return `${prefix} ${current} av ${total}`;
}

function currentTask() {
    return state.tasks[state.taskIndex];
}

function acceptedMap(task) {
    const map = new Map();
    task.acceptedSynonyms.forEach((syn) => {
        map.set(normalizeText(syn), syn);
    });
    return map;
}

function renderAttempts() {
    el.attemptList.innerHTML = "";
    state.attempts.forEach((attempt) => {
        const item = document.createElement("li");
        item.className = "attempt-item " + (attempt.correct ? "correct" : "wrong");
        item.innerHTML = `
            <span>${attempt.text}</span>
            <span class="attempt-status">${attempt.correct ? "Riktig" : "Feil"}</span>
        `;
        el.attemptList.appendChild(item);
    });
}

function renderHints(task) {
    const wordClass = task.wordClass || "";
    const classText = wordClass ? wordClass : "Ukjent";
    el.classButton.textContent =
        classText.charAt(0).toUpperCase() + classText.slice(1);
    el.classInfo.textContent =
        WORD_CLASS_INFO[wordClass] || "Ingen beskrivelse tilgjengelig.";
    el.classInfo.classList.add("hidden");
    el.hints.classList.remove("hidden");
}

function showTask() {
    const task = currentTask();
    const preset = DIFFICULTY[state.difficulty];

    el.taskLabel.textContent = taskLabelText();
    el.modeLabel.textContent =
        state.mode === "practice" ? "\u00d8v mer" : "Runde";
    el.score.textContent = String(state.score);
    el.bonus.textContent = String(state.bonus);
    el.targetWord.textContent = preset.showTarget
        ? task.targetWord
        : maskWord(task.targetWord);
    el.sentenceText.textContent = task.sentence.replace("{blank}", "_____");

    renderHints(task);

    state.attempts = [];
    state.attempted = new Set();
    state.found = new Set();
    el.answerInput.disabled = false;
    el.submitAnswer.disabled = false;
    el.skipTask.disabled = false;
    el.answerInput.value = "";
    el.answerInput.focus();
    el.bonusBadge.classList.add("hidden");
    el.classInfo.classList.add("hidden");
    setFeedback("", "");
    renderAttempts();
    el.taskSummary.classList.add("hidden");
}

function finishTask() {
    el.answerInput.disabled = true;
    el.submitAnswer.disabled = true;
    el.skipTask.disabled = true;

    const task = currentTask();
    const map = acceptedMap(task);
    const found = [...state.found].map((key) => map.get(key)).filter(Boolean);
    const missing = [...map.keys()]
        .filter((key) => !state.found.has(key))
        .map((key) => map.get(key));

    el.taskSummaryTitle.textContent = "Oppsummering";
    el.taskSummaryText.textContent = `Du fikk ${found.length}/3 riktige.`;
    el.correctList.innerHTML = "";
    el.missingList.innerHTML = "";

    found.forEach((word) => {
        const pill = document.createElement("span");
        pill.className = "pill";
        pill.textContent = word;
        el.correctList.appendChild(pill);
    });

    missing.forEach((word) => {
        const pill = document.createElement("span");
        pill.className = "pill missing";
        pill.textContent = word;
        el.missingList.appendChild(pill);
    });

    if (state.mode === "main" && found.length < 3) {
        if (!state.practiceWords.includes(task.targetWord)) {
            state.practiceWords.push(task.targetWord);
        }
    }

    el.nextTask.textContent =
        state.taskIndex === state.tasks.length - 1
            ? "Se oppsummering"
            : "Neste oppgave";
    el.taskSummary.classList.remove("hidden");
}

function handleSubmit() {
    if (el.answerInput.disabled) return;
    const raw = el.answerInput.value;
    const value = normalizeText(raw);

    if (!value) {
        setFeedback("Skriv inn et synonym.", "bad");
        return;
    }

    if (state.attempted.has(value)) {
        setFeedback("Du har allerede pr\u00f8vd dette ordet.", "bad");
        el.answerInput.select();
        return;
    }

    const task = currentTask();
    const map = acceptedMap(task);
    const isCorrect = map.has(value);

    state.attempted.add(value);
    state.attempts.push({
        text: raw.trim(),
        correct: isCorrect,
        normalized: value,
    });

    if (isCorrect && !state.found.has(value)) {
        state.found.add(value);
        if (state.mode === "main") {
            state.score += CONFIG.pointsPerCorrect;
        }
        setFeedback("Riktig!", "ok");
    } else {
        if (state.mode === "main") {
            state.score += CONFIG.pointsWrong;
        }
        setFeedback("Ikke helt \u2014 pr\u00f8v et annet synonym.", "bad");
    }

    el.score.textContent = String(state.score);
    renderAttempts();
    el.answerInput.value = "";
    el.answerInput.focus();

    if (state.found.size === CONFIG.maxAttempts) {
        if (state.mode === "main") {
            state.bonus += CONFIG.bonusPerfect;
            state.perfectCount += 1;
            el.bonus.textContent = String(state.bonus);
            el.bonus.classList.remove("bonus-pop");
            void el.bonus.offsetWidth;
            el.bonus.classList.add("bonus-pop");
            el.pointsPanel.classList.remove("bonus-hit");
            void el.pointsPanel.offsetWidth;
            el.pointsPanel.classList.add("bonus-hit");
            el.bonusBadge.classList.remove("hidden");
            clearTimeout(state.bonusTimer);
            state.bonusTimer = setTimeout(() => {
                el.bonusBadge.classList.add("hidden");
            }, 1200);
            spawnConfetti();
        }
        finishTask();
        return;
    }

    if (state.attempts.length >= CONFIG.maxAttempts) {
        finishTask();
    }
}

function nextTask() {
    if (state.taskIndex >= state.tasks.length - 1) {
        finishRound();
        return;
    }
    state.taskIndex += 1;
    showTask();
}

function skipTask() {
    finishTask();
}

function finishRound(reason) {
    setScreen(el.screenRound);
    const totalScore = state.score + state.bonus;

    if (state.mode === "main") {
        state.mainSummary = {
            score: state.score,
            bonus: state.bonus,
            perfectCount: state.perfectCount,
            practiceWords: state.practiceWords.slice(),
        };
        store.lastScore = totalScore;
        store.lastPerfect = state.perfectCount;
        if (totalScore > store.highScore) {
            store.highScore = totalScore;
            saveStore(store);
            el.highScore.textContent = String(store.highScore);
        }
        store.practice = state.practiceWords.slice();
        saveStore(store);
    }

    let roundText;
    if (state.mode === "practice") {
        roundText = "\u00d8velsen er ferdig. Bra jobbet!";
    } else if (reason === "abort") {
        const completed = Math.min(state.taskIndex, state.tasks.length);
        roundText =
            `Runden ble avbrutt etter ${completed} oppgave` +
            `${completed === 1 ? "" : "r"}. Du fikk ${totalScore} poeng.`;
    } else {
        roundText = `Du fikk ${totalScore} poeng totalt.`;
    }
    el.roundSummary.textContent = roundText;
    el.perfectCount.textContent = String(state.perfectCount);

    renderPracticeList();
    el.practiceMode.disabled = state.practiceWords.length === 0;
    el.playAgain.classList.toggle("hidden", state.mode === "practice");
    el.practiceMode.classList.toggle("hidden", state.mode === "practice");
    el.backToSummary.classList.toggle("hidden", state.mode !== "practice");
    if (state.mode === "main" && reason === "abort") {
        el.playAgain.textContent = "Til startsiden";
    } else {
        el.playAgain.textContent = "Spill igjen";
    }
}

function renderPracticeList() {
    el.practiceList.innerHTML = "";
    const list =
        state.mode === "practice" ? store.practice : state.practiceWords;

    if (list.length === 0) {
        const pill = document.createElement("span");
        pill.className = "pill missing";
        pill.textContent = "Ingen ord enda.";
        el.practiceList.appendChild(pill);
        return;
    }

    list.forEach((word) => {
        const pill = document.createElement("span");
        pill.className = "pill";
        pill.textContent = word;
        el.practiceList.appendChild(pill);
    });
}

function buildTaskSet() {
    return shuffle(TASKS).slice(0, CONFIG.totalTasks);
}

function buildPracticeSet() {
    const unique = [...new Set(store.practice)];
    const mapped = unique
        .map((word) => TASKS.find((task) => task.targetWord === word))
        .filter(Boolean);
    return mapped.length ? mapped : buildTaskSet();
}

function startRound(mode) {
    state.mode = mode;
    state.difficulty = el.difficulty.value || "easy";
    state.tasks = mode === "practice" ? buildPracticeSet() : buildTaskSet();
    state.taskIndex = 0;
    state.score = 0;
    state.bonus = 0;
    state.perfectCount = 0;
    state.practiceWords = mode === "main" ? [] : store.practice.slice();
    state.aborted = false;

    if (mode === "main") {
        store.practice = [];
        saveStore(store);
    }

    setScreen(el.screenGame);
    showTask();
}

document.addEventListener("DOMContentLoaded", () => {
    updateStartStats();

    el.startGame.addEventListener("click", () => startRound("main"));
    el.submitAnswer.addEventListener("click", handleSubmit);
    el.answerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit();
        }
    });
    el.nextTask.addEventListener("click", nextTask);
    el.skipTask.addEventListener("click", skipTask);
    el.abortGame.addEventListener("click", () => {
        if (state.mode === "main") {
            state.aborted = true;
            finishRound("abort");
        } else {
            setScreen(el.screenStart);
        }
    });
    el.classButton.addEventListener("click", () => {
        el.classInfo.classList.toggle("hidden");
    });
    el.playAgain.addEventListener("click", () => {
        setScreen(el.screenStart);
        updateStartStats();
    });
    el.practiceMode.addEventListener("click", () => startRound("practice"));
    el.backToSummary.addEventListener("click", () => {
        if (!state.mainSummary) return;
        state.mode = "main";
        state.score = state.mainSummary.score;
        state.bonus = state.mainSummary.bonus;
        state.perfectCount = state.mainSummary.perfectCount;
        state.practiceWords = state.mainSummary.practiceWords.slice();
        setScreen(el.screenRound);
        el.playAgain.classList.remove("hidden");
        el.practiceMode.classList.remove("hidden");
        el.backToSummary.classList.add("hidden");
        el.roundSummary.textContent =
            `Du fikk ${state.score + state.bonus} poeng totalt.`;
        el.perfectCount.textContent = String(state.perfectCount);
        renderPracticeList();
        el.practiceMode.disabled = state.practiceWords.length === 0;
    });
});
