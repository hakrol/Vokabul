// Norsk vokabularspill uten engelske ord.

const TOTAL_QUESTIONS = 20;
const SCORE_RIGHT = 10;
const SCORE_WRONG = -5;

const storage = window.VokabulStorage;
if (storage) {
    storage.migrateStorageIfNeeded();
}
const storageAvailable = storage ? storage.canUseStorage() : false;
const STORAGE_KEYS = storage ? storage.keys : null;

const STORAGE_KEY = STORAGE_KEYS
    ? STORAGE_KEYS.VOKABULAR_STATS
    : "vokabularspill_stats_v1";
const PRACTICE_KEY = STORAGE_KEYS
    ? STORAGE_KEYS.VOKABULAR_PRACTICE
    : "vokabularspill_practice_list";
const ATTEMPT_KEY = STORAGE_KEYS
    ? STORAGE_KEYS.VOKABULAR_ATTEMPTS
    : "vokabularspill_attempts";
const ATTEMPT_LIMIT = 200;

function loadStats() {
    if (!storageAvailable) {
        return { bestScore: 0, lastScore: 0, lastCorrect: 0, lastWrong: 0 };
    }
    const parsed =
        storage && storage.readJson
            ? storage.readJson(STORAGE_KEY, null)
            : null;
    if (!parsed) {
        return { bestScore: 0, lastScore: 0, lastCorrect: 0, lastWrong: 0 };
    }
    return {
        bestScore: Number(parsed.bestScore) || 0,
        lastScore: Number(parsed.lastScore) || 0,
        lastCorrect: Number(parsed.lastCorrect) || 0,
        lastWrong: Number(parsed.lastWrong) || 0,
    };
}

function saveStats(stats) {
    if (!storageAvailable) return;
    if (storage && storage.writeJson) {
        storage.writeJson(STORAGE_KEY, stats);
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function loadPracticeList() {
    if (!storageAvailable) return [];
    const parsed =
        storage && storage.readJson ? storage.readJson(PRACTICE_KEY, []) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
        .map((item) => ({
            index: Number(item.index),
            wrongCount: Math.max(1, Number(item.wrongCount) || 1),
        }))
        .filter((item) => Number.isInteger(item.index) && WORDS[item.index]);
}

function savePracticeList(list) {
    if (!storageAvailable) return;
    if (storage && storage.writeJson) {
        storage.writeJson(PRACTICE_KEY, list);
        return;
    }
    localStorage.setItem(PRACTICE_KEY, JSON.stringify(list));
}

function recordAttempt(entry, option, isCorrect) {
    if (!storageAvailable || !storage || !storage.appendToList) return;
    storage.appendToList(
        ATTEMPT_KEY,
        {
            word: entry.word,
            chosen: option?.text || "",
            correctAnswer: entry.correct,
            correct: Boolean(isCorrect),
            timestamp: Date.now(),
        },
        ATTEMPT_LIMIT,
    );
}

const WORDS = window.VokabulWordSets?.vokabularspill?.words || [];

const el = {
    screenStart: document.getElementById("screenStart"),
    screenGame: document.getElementById("screenGame"),
    screenPractice: document.getElementById("screenPractice"),
    startGame: document.getElementById("startGame"),
    startPracticeFromStart: document.getElementById("startPracticeFromStart"),
    bestScore: document.getElementById("bestScore"),
    lastScore: document.getElementById("lastScore"),
    lastCorrect: document.getElementById("lastCorrect"),
    lastWrong: document.getElementById("lastWrong"),
    practiceCount: document.getElementById("practiceCount"),
    practiceEmpty: document.getElementById("practiceEmpty"),
    practiceSummary: document.getElementById("practiceSummary"),
    word: document.getElementById("word"),
    choices: document.getElementById("choices"),
    feedback: document.getElementById("feedback"),
    details: document.getElementById("details"),
    correctExplanation: document.getElementById("correctExplanation"),
    examples: document.getElementById("examples"),
    score: document.getElementById("score"),
    correct: document.getElementById("correct"),
    wrong: document.getElementById("wrong"),
    progress: document.getElementById("progress"),
    modePill: document.getElementById("modePill"),
    next: document.getElementById("next"),
    restart: document.getElementById("restart"),
    endEarly: document.getElementById("endEarly"),
    togglePractice: document.getElementById("togglePractice"),
    summary: document.getElementById("summary"),
    summaryText: document.getElementById("summaryText"),
    practiceList: document.getElementById("practiceList"),
    practiceStart: document.getElementById("practiceStart"),
    practicePlay: document.getElementById("practicePlay"),
    practiceReset: document.getElementById("practiceReset"),
    practiceBack: document.getElementById("practiceBack"),
    backToStart: document.getElementById("backToStart"),
};

const stats = loadStats();
const storedPracticeList = loadPracticeList();

const state = {
    order: [],
    index: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    practiceList: storedPracticeList,
    practiceSessionCorrect: [],
    locked: false,
    mode: "main",
    progressCount: null,
};

function setScreen(screen) {
    if (el.screenStart) el.screenStart.classList.add("hidden");
    if (el.screenGame) el.screenGame.classList.add("hidden");
    if (el.screenPractice) el.screenPractice.classList.add("hidden");
    screen.classList.remove("hidden");
    document.body.classList.toggle(
        "is-playing",
        el.screenGame && screen === el.screenGame,
    );
}

function updateStartStats() {
    if (!el.bestScore) return;
    el.bestScore.textContent = String(stats.bestScore);
    el.lastScore.textContent = String(stats.lastScore);
    el.lastCorrect.textContent = String(stats.lastCorrect);
    el.lastWrong.textContent = String(stats.lastWrong);
}

function updatePracticeSummary(words) {
    if (!el.practiceSummary) return;
    if (!words || words.length === 0) {
        el.practiceSummary.textContent = "";
        el.practiceSummary.hidden = true;
        return;
    }
    el.practiceSummary.hidden = false;
    el.practiceSummary.textContent =
        `Riktig i siste øvelsesrunde: ${words.join(", ")}.`;
}

function updatePracticeUI() {
    const count = state.practiceList.length;
    if (el.practiceCount) el.practiceCount.textContent = String(count);
    if (el.togglePractice) el.togglePractice.disabled = count === 0;
    if (el.practiceStart) el.practiceStart.disabled = count === 0;
    if (el.practicePlay) el.practicePlay.disabled = count === 0;
    if (el.practiceReset) el.practiceReset.disabled = count === 0;
    if (el.startPracticeFromStart) {
        el.startPracticeFromStart.textContent = `Øv på feil ord (${count})`;
        el.startPracticeFromStart.hidden = count === 0;
    }
    if (el.practiceEmpty) el.practiceEmpty.hidden = count !== 0;
}

function savePracticeState() {
    savePracticeList(state.practiceList);
    updatePracticeUI();
}

function addToPracticeList(index) {
    const existing = state.practiceList.find((item) => item.index === index);
    if (existing) {
        existing.wrongCount += 1;
    } else {
        state.practiceList.push({ index, wrongCount: 1 });
    }
    savePracticeState();
}

function removeFromPracticeList(index) {
    state.practiceList = state.practiceList.filter((item) => item.index !== index);
    savePracticeState();
    if (el.practiceList) renderPracticeList();
}

function clearPracticeList() {
    state.practiceList = [];
    savePracticeState();
    if (el.practiceList) renderPracticeList();
}

function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function updateStats() {
    el.score.textContent = String(state.score);
    el.correct.textContent = String(state.correct);
    el.wrong.textContent = String(state.wrong);
    const total = state.mode === "main" ? TOTAL_QUESTIONS : state.order.length;
    const progressValue =
        state.progressCount === null
            ? Math.min(state.index + 1, total)
            : Math.min(state.progressCount, total);
    el.progress.textContent = `${progressValue}/${total}`;
    if (el.modePill) el.modePill.hidden = state.mode !== "practice";
}

function finishRoundStats() {
    stats.lastScore = state.score;
    stats.lastCorrect = state.correct;
    stats.lastWrong = state.wrong;
    stats.bestScore = Math.max(stats.bestScore, stats.lastScore);
    saveStats(stats);
    updateStartStats();
}

function currentEntry() {
    return WORDS[state.order[state.index]];
}

function setFeedback(text, type) {
    el.feedback.className = "feedback";
    if (type) el.feedback.classList.add(type);
    el.feedback.textContent = text;
}

function renderExamples(examples) {
    el.examples.textContent = examples.join(" | ");
}

function renderChoices(entry) {
    el.choices.innerHTML = "";
    const options = shuffle([
        { text: entry.correct, correct: true },
        ...entry.wrong.map((text) => ({ text, correct: false })),
    ]);

    options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice";
        btn.textContent = opt.text;
        btn.addEventListener("click", () => handleAnswer(opt, btn));
        el.choices.appendChild(btn);
    });
}

function disableChoices() {
    [...el.choices.querySelectorAll(".choice")].forEach((btn) =>
        btn.classList.add("disabled"),
    );
}

function showQuestion() {
    state.locked = false;
    state.progressCount = null;
    el.details.classList.remove("show");
    el.next.disabled = true;
    setFeedback("", "");

    const entry = currentEntry();
    el.word.textContent = entry.word;
    el.correctExplanation.textContent = entry.correct;
    renderExamples(entry.examples);
    renderChoices(entry);
    updateStats();
}


function handleAnswer(option, btn) {
    if (state.locked) return;
    state.locked = true;
    disableChoices();

    const entry = currentEntry();
    const correctText = entry.correct;
    const buttons = [...el.choices.querySelectorAll(".choice")];
    buttons.forEach((b) => {
        if (b.textContent === correctText) b.classList.add("correct");
    });
    recordAttempt(entry, option, option.correct);

    if (option.correct) {
        btn.classList.add("correct");
        setFeedback("Riktig.", "ok");
        state.score += SCORE_RIGHT;
        state.correct += 1;
        if (state.mode === "practice") {
            const correctWord = entry.word;
            if (!state.practiceSessionCorrect.includes(correctWord)) {
                state.practiceSessionCorrect.push(correctWord);
            }
        }
        updateStats();
        setTimeout(nextQuestion, 500);
    } else {
        btn.classList.add("wrong");
        setFeedback("Feil. Riktig forklaring vises under.", "bad");
        el.details.classList.add("show");
        state.score += SCORE_WRONG;
        state.wrong += 1;
        addToPracticeList(state.order[state.index]);
        updateStats();
        el.next.disabled = false;
    }
}

function nextQuestion() {
    if (state.mode === "main") {
        state.index += 1;
        if (state.index >= TOTAL_QUESTIONS) {
            endGame();
            return;
        }
    } else {
        state.index += 1;
        if (state.index >= state.order.length) {
            endPracticeRound();
            return;
        }
    }

    showQuestion();
}

function renderPracticeList() {
    if (!el.practiceList) return;
    el.practiceList.innerHTML = "";
    if (state.practiceList.length === 0) {
        const empty = document.createElement("div");
        empty.className = "practiceItem";
        empty.textContent = "Ingen ord i \u00f8velseslisten.";
        el.practiceList.appendChild(empty);
        return;
    }

    state.practiceList.forEach((practiceItem) => {
        const entry = WORDS[practiceItem.index];
        if (!entry) return;
        const item = document.createElement("div");
        item.className = "practiceItem";
        item.innerHTML = `
            <div class="practiceItemTop">
              <div class="practiceWord">${entry.word}</div>
              <button class="practiceRemove" type="button" data-index="${practiceItem.index}">Fjern</button>
            </div>
            <div class="practiceCount">Bommet: ${practiceItem.wrongCount} ganger</div>
            <div>${entry.correct}</div>
            <div class="practiceExamples">${entry.examples.join(" | ")}</div>
        `;
        item
            .querySelector(".practiceRemove")
            .addEventListener("click", () =>
                removeFromPracticeList(practiceItem.index),
            );
        el.practiceList.appendChild(item);
    });
}

function endGame() {
    state.index = TOTAL_QUESTIONS;
    state.progressCount = TOTAL_QUESTIONS;
    updateStats();
    finishRoundStats();
    state.locked = true;
    disableChoices();
    if (el.endEarly) el.endEarly.disabled = true;
    el.summary.classList.add("show");
    el.practiceStart.disabled = state.practiceList.length === 0;
    el.summaryText.textContent =
        `Du svarte riktig ${state.correct} av ${TOTAL_QUESTIONS}. ` +
        `Poeng: ${state.score}. Feil: ${state.wrong}.`;
}

function endGameEarly() {
    if (state.mode !== "main") return;
    const answered = state.correct + state.wrong;
    state.progressCount = answered;
    updateStats();
    finishRoundStats();
    state.locked = true;
    disableChoices();
    el.next.disabled = true;
    if (el.endEarly) el.endEarly.disabled = true;
    el.summary.classList.add("show");
    el.practiceStart.disabled = state.practiceList.length === 0;
    el.summaryText.textContent =
        `Du avsluttet runden etter ${answered} av ${TOTAL_QUESTIONS} ord. ` +
        `Riktig: ${state.correct}. Feil: ${state.wrong}. Poeng: ${state.score}.`;
}

function endPracticeRound() {
    state.progressCount = state.order.length;
    updateStats();
    finishRoundStats();
    state.locked = true;
    disableChoices();
    el.next.disabled = true;
    updatePracticeSummary(state.practiceSessionCorrect);
    updatePracticeUI();
    state.mode = "main";
    if (el.screenStart) setScreen(el.screenStart);
}

function startGame() {
    startNewGame();
    if (el.screenGame) setScreen(el.screenGame);
}

function startPracticeRound() {
    const indices = state.practiceList.map((item) => item.index);
    if (indices.length === 0) return;
    state.mode = "practice";
    state.order = shuffle(indices).slice(0, Math.min(TOTAL_QUESTIONS, indices.length));
    state.index = 0;
    state.score = 0;
    state.correct = 0;
    state.wrong = 0;
    state.practiceSessionCorrect = [];
    state.progressCount = null;
    el.details.classList.remove("show");
    if (el.endEarly) el.endEarly.disabled = true;
    setFeedback("\u00d8velsesrunde startet.", "ok");
    if (el.screenGame) setScreen(el.screenGame);
    showQuestion();
}

function startNewGame() {
    state.mode = "main";
    state.order = shuffle([...Array(WORDS.length).keys()]).slice(
        0,
        TOTAL_QUESTIONS,
    );
    state.index = 0;
    state.score = 0;
    state.correct = 0;
    state.wrong = 0;
    state.practiceSessionCorrect = [];
    state.locked = false;
    state.progressCount = null;
    if (el.endEarly) el.endEarly.disabled = false;
    el.summary.classList.remove("show");
    updatePracticeSummary([]);
    updatePracticeUI();
    showQuestion();
}

function showPracticeScreen() {
    if (!el.screenPractice) return;
    renderPracticeList();
    setScreen(el.screenPractice);
}

document.addEventListener("DOMContentLoaded", () => {
    updateStartStats();
    updatePracticeUI();
    updatePracticeSummary([]);
    if (el.screenStart && el.screenGame) {
        setScreen(el.screenStart);
    }
    if (el.startGame) {
        el.startGame.addEventListener("click", startGame);
    }
    if (el.startPracticeFromStart) {
        el.startPracticeFromStart.addEventListener("click", startPracticeRound);
    }
    el.next.addEventListener("click", nextQuestion);
    el.restart.addEventListener("click", () => {
        if (el.screenStart) setScreen(el.screenStart);
    });
    if (el.backToStart) {
        el.backToStart.addEventListener("click", () => {
            if (el.screenStart) setScreen(el.screenStart);
        });
    }
    if (el.endEarly) {
        el.endEarly.addEventListener("click", endGameEarly);
    }
    if (el.togglePractice) {
        el.togglePractice.addEventListener("click", showPracticeScreen);
    }
    if (el.practiceStart) {
        el.practiceStart.addEventListener("click", startPracticeRound);
    }
    if (el.practicePlay) {
        el.practicePlay.addEventListener("click", startPracticeRound);
    }
    if (el.practiceReset) {
        el.practiceReset.addEventListener("click", () => {
            if (confirm("Nullstille \u00f8velseslisten?")) {
                clearPracticeList();
                renderPracticeList();
            }
        });
    }
    if (el.practiceBack) {
        el.practiceBack.addEventListener("click", () => {
            if (el.screenStart) setScreen(el.screenStart);
        });
    }
});


