const WORD_LISTS = {
    easy: [
        {
            ord: "stol",
            beskrivelse: "M\u00f8bel du sitter p\u00e5",
            forsteBokstav: "S",
        },
        {
            ord: "sol",
            beskrivelse: "Stjernen som gir lys og varme p\u00e5 dagen",
            forsteBokstav: "S",
        },
        {
            ord: "bok",
            beskrivelse: "Samling av sider med tekst og bilder",
            forsteBokstav: "B",
        },
        {
            ord: "hund",
            beskrivelse: "Et vanlig kj\u00e6ledyr som bjeffer",
            forsteBokstav: "H",
        },
        {
            ord: "vann",
            beskrivelse: "Drikke du f\u00e5r fra springen",
            forsteBokstav: "V",
        },
        {
            ord: "mat",
            beskrivelse: "Noe du spiser",
            forsteBokstav: "M",
        },
        {
            ord: "sko",
            beskrivelse: "Du tar dem p\u00e5 f\u00f8ttene",
            forsteBokstav: "S",
        },
        {
            ord: "bil",
            beskrivelse: "Kj\u00f8ret\u00f8y med fire hjul",
            forsteBokstav: "B",
        },
        {
            ord: "skole",
            beskrivelse: "Stedet der elever l\u00e6rer",
            forsteBokstav: "S",
        },
        {
            ord: "tre",
            beskrivelse: "Plante som har stamme og grener",
            forsteBokstav: "T",
        },
        {
            ord: "br\u00f8d",
            beskrivelse: "Bakes og spises til m\u00e5ltider",
            forsteBokstav: "B",
        },
        {
            ord: "klokke",
            beskrivelse: "Viser tiden",
            forsteBokstav: "K",
        },
    ],
    medium: [
        {
            ord: "metronom",
            beskrivelse: "Et apparat som holder jevn takt under musikk\u00f8ving",
            forsteBokstav: "M",
        },
        {
            ord: "teleskop",
            beskrivelse:
                "Instrument som brukes til \u00e5 se fjerne objekter p\u00e5 himmelen",
            forsteBokstav: "T",
        },
        {
            ord: "kompass",
            beskrivelse: "Hjelpemiddel som viser himmelretninger",
            forsteBokstav: "K",
        },
        {
            ord: "fyrt\u00e5rn",
            beskrivelse: "H\u00f8yt t\u00e5rn med lys som guider skip",
            forsteBokstav: "F",
        },
        {
            ord: "ferie",
            beskrivelse: "En periode med fri fra arbeid eller skole",
            forsteBokstav: "F",
        },
        {
            ord: "skumring",
            beskrivelse: "Tiden mellom dag og natt n\u00e5r lyset blir svakere",
            forsteBokstav: "S",
        },
        {
            ord: "dagbok",
            beskrivelse: "Bok der man skriver ned egne tanker og opplevelser",
            forsteBokstav: "D",
        },
        {
            ord: "oljelykt",
            beskrivelse: "Lyskilde som bruker olje som drivstoff",
            forsteBokstav: "O",
        },
        {
            ord: "skogkledd",
            beskrivelse: "Beskriver et omr\u00e5de som er dekket av skog",
            forsteBokstav: "S",
        },
        {
            ord: "vinterhage",
            beskrivelse: "Oppvarmet rom med mye glass og planter",
            forsteBokstav: "V",
        },
        {
            ord: "nattlys",
            beskrivelse: "Lite lys som st\u00e5r p\u00e5 om natten",
            forsteBokstav: "N",
        },
        {
            ord: "bokmerke",
            beskrivelse: "Strimmel eller gjenstand som holder plass i en bok",
            forsteBokstav: "B",
        },
    ],
    hard: [
        {
            ord: "paradigme",
            beskrivelse: "Et grunnleggende m\u00f8nster eller tankesett",
            forsteBokstav: "P",
        },
        {
            ord: "epistemologi",
            beskrivelse: "Filosofisk l\u00e6re om kunnskapens natur",
            forsteBokstav: "E",
        },
        {
            ord: "kapill\u00e6r",
            beskrivelse: "Tynn blod\u00e5re som forbinder arterier og vener",
            forsteBokstav: "K",
        },
        {
            ord: "spekter",
            beskrivelse: "Omr\u00e5de av b\u00f8lgelengder, for eksempel av lys",
            forsteBokstav: "S",
        },
        {
            ord: "koherens",
            beskrivelse: "Sammenheng eller logisk helhet",
            forsteBokstav: "K",
        },
        {
            ord: "resonans",
            beskrivelse: "Forsterkning av svingninger n\u00e5r frekvenser passer",
            forsteBokstav: "R",
        },
        {
            ord: "syntese",
            beskrivelse: "Prosess der deler kombineres til en helhet",
            forsteBokstav: "S",
        },
        {
            ord: "abstraksjon",
            beskrivelse: "Bortfiltrering av detaljer for \u00e5 se helheten",
            forsteBokstav: "A",
        },
        {
            ord: "konvergens",
            beskrivelse: "Utvikling mot samme punkt eller resultat",
            forsteBokstav: "K",
        },
        {
            ord: "fragmentering",
            beskrivelse: "Oppsplitting i mindre deler",
            forsteBokstav: "F",
        },
        {
            ord: "heuristikk",
            beskrivelse: "Praktisk tommelfingerregel for probleml\u00f8sing",
            forsteBokstav: "H",
        },
        {
            ord: "semiotikk",
            beskrivelse: "L\u00e6re om tegn og symboler",
            forsteBokstav: "S",
        },
    ],
};

const RECORD_KEY = "ordgjettespill_rekord";
const RECORD_METRIC = "longestStreak";
const NEXT_DELAY_MS = 1000;

const STATS_TODAY_KEY = "ordgjettespill_stats_today";
const STATS_ALLTIME_KEY = "ordgjettespill_stats_alltime";

const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const endScreen = document.querySelector("#end-screen");

const descriptionText = document.querySelector("#description-text");
const hintText = document.querySelector("#hint-text");
const feedbackText = document.querySelector("#feedback-text");
const answerInput = document.querySelector("#answer-input");
const submitBtn = document.querySelector("#submit-btn");
const skipBtn = document.querySelector("#skip-btn");
const endBtn = document.querySelector("#end-btn");
const progressText = document.querySelector("#progress-text");
const difficultySelect = document.querySelector("#difficulty-select");

const statTotal = document.querySelector("#stat-total");
const statCorrect = document.querySelector("#stat-correct");
const statStreak = document.querySelector("#stat-streak");
const statPoints = document.querySelector("#stat-points");
const statTime = document.querySelector("#stat-time");

const recordValue = document.querySelector("#record-value");
const recordText = document.querySelector("#record-text");
const recordSub = document.querySelector("#record-sub");
const recordSession = document.querySelector("#record-session");
const motivationText = document.querySelector("#motivation-text");
const milestoneText = document.querySelector("#milestone-text");

const statSuccessRate = document.querySelector("#stat-success-rate");
const statRounds = document.querySelector("#stat-rounds");
const statMastered = document.querySelector("#stat-mastered");
const statTrend = document.querySelector("#stat-trend");
const successRateChart = document.querySelector("#success-rate-chart");
const successRateChartWrap = document.querySelector(".stats-chart");

const endRecordText = document.querySelector("#end-record-text");
const endMessage = document.querySelector("#end-message");

const startBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");
const backBtn = document.querySelector("#back-btn");

const successRateModal = document.querySelector("#successRateModal");
const masteredWordsModal = document.querySelector("#masteredWordsModal");
const modalOverlay = document.querySelector("#modalOverlay");
const closeSuccessRateModalBtn = document.querySelector(
    "#closeSuccessRateModal",
);
const closeMasteredWordsModalBtn = document.querySelector(
    "#closeMasteredWordsModal",
);
const successRateInfoBtn = document.querySelector("#successRateInfo");
const masteredWordsInfoBtn = document.querySelector("#masteredWordsInfo");


const state = {
    order: [],
    index: 0,
    attempts: 0,
    correct: 0,
    points: 0,
    streak: 0,
    longestStreak: 0,
    startTime: 0,
    totalSeconds: 0,
    timerId: null,
    locked: false,
    roundResults: [],
};

let sessionBestStreak = 0;

function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function formatTime(seconds) {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
}

function formatPercent(value) {
    return `${value}%`;
}

function getSelectedWordList() {
    const key = difficultySelect ? difficultySelect.value : "medium";
    return WORD_LISTS[key] || WORD_LISTS.medium;
}

function openModal(modal) {
    modal.classList.add("active");
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal(modal) {
    modal.classList.remove("active");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
}

function showScreen(screen) {
    [startScreen, gameScreen, endScreen].forEach((section) => {
        section.classList.toggle("active", section === screen);
    });
}

function getRecord() {
    const raw = localStorage.getItem(RECORD_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        return null;
    }
}

function getRecordValue() {
    const record = getRecord();
    if (!record) return null;
    return record.longestStreak ?? null;
}

function saveRecord(value) {
    localStorage.setItem(RECORD_KEY, JSON.stringify({ longestStreak: value }));
}

function recordMetricFromStats(stats) {
    if (RECORD_METRIC === "longestStreak") {
        return stats.longestStreak;
    }
    return stats.points;
}

function updateRecordIfNeeded(stats) {
    const current = getRecordValue();
    const candidate = recordMetricFromStats(stats);
    if (current === null || candidate > current) {
        saveRecord(candidate);
        return { updated: true, value: candidate, previous: current };
    }
    return { updated: false, value: current, previous: current };
}

function updateRecordDisplay() {
    const record = getRecordValue();
    if (record === null) {
        recordValue.textContent = "Ingen rekord enn\u00e5";
        recordText.textContent = "Spill og sett den f\u00f8rste!";
        return;
    }
    recordValue.textContent = String(record);
    recordText.textContent = `Din beste rekke med riktige svar: ${record}`;
}

function getLocalDateKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getWeekKey(date) {
    const target = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const day = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
    return `${target.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function readStorage(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
        return JSON.parse(raw);
    } catch (error) {
        return fallback;
    }
}

function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getTodayStats() {
    const todayKey = getLocalDateKey();
    const fallback = { date: todayKey, rounds: 0, attempts: 0, correct: 0 };
    const data = readStorage(STATS_TODAY_KEY, fallback);
    if (!data || data.date !== todayKey) {
        return fallback;
    }
    return data;
}

function getAllTimeStats() {
    const fallback = {
        rounds: 0,
        attempts: 0,
        correct: 0,
        masteredWords: {},
        wordStreaks: {},
        weeklyMastered: { weekKey: "", count: 0 },
        lastRate: null,
        currentRate: null,
        recentRates: [],
    };
    const data = readStorage(STATS_ALLTIME_KEY, fallback);
    return { ...fallback, ...data };
}

function ensureWeeklyBucket(stats) {
    const currentWeek = getWeekKey(new Date());
    if (!stats.weeklyMastered || stats.weeklyMastered.weekKey !== currentWeek) {
        stats.weeklyMastered = { weekKey: currentWeek, count: 0 };
    }
}

function calcSuccessRate(stats) {
    if (!stats.attempts) return 0;
    return Math.round((stats.correct / stats.attempts) * 100);
}

function updateWordMastery(stats, roundResults) {
    let newMastered = 0;
    const wordStreaks = stats.wordStreaks || {};
    const masteredWords = stats.masteredWords || {};

    roundResults.forEach((result) => {
        if (result.correct) {
            const next = (wordStreaks[result.word] || 0) + 1;
            wordStreaks[result.word] = next;
            if (next >= 2 && !masteredWords[result.word]) {
                masteredWords[result.word] = true;
                newMastered += 1;
            }
        } else {
            wordStreaks[result.word] = 0;
        }
    });

    stats.wordStreaks = wordStreaks;
    stats.masteredWords = masteredWords;
    return newMastered;
}

function applyRoundStats(todayStats, allTimeStats, roundResults) {
    const attempts = roundResults.length;
    const correct = roundResults.filter((result) => result.correct).length;

    todayStats.rounds += 1;
    todayStats.attempts += attempts;
    todayStats.correct += correct;

    const previousRate = calcSuccessRate(allTimeStats);
    allTimeStats.rounds += 1;
    allTimeStats.attempts += attempts;
    allTimeStats.correct += correct;

    const newMastered = updateWordMastery(allTimeStats, roundResults);
    ensureWeeklyBucket(allTimeStats);
    allTimeStats.weeklyMastered.count += newMastered;
    allTimeStats.lastRate = previousRate;
    allTimeStats.currentRate = calcSuccessRate(allTimeStats);
    updateRecentRates(allTimeStats, attempts, correct);
}

function formatTrend(allTimeStats) {
    if (allTimeStats.lastRate === null || allTimeStats.currentRate === null) {
        return "\u2013";
    }
    if (allTimeStats.currentRate > allTimeStats.lastRate) {
        return "\u2191 Opp";
    }
    if (allTimeStats.currentRate < allTimeStats.lastRate) {
        return "\u2193 Ned";
    }
    return "\u2192 Stabil";
}

function updateRecentRates(allTimeStats, attempts, correct) {
    const history = Array.isArray(allTimeStats.recentRates)
        ? allTimeStats.recentRates
        : [];
    const roundRate = attempts ? Math.round((correct / attempts) * 100) : 0;
    history.push(roundRate);
    allTimeStats.recentRates = history.slice(-10);
}

function renderSuccessRateChart(rates) {
    if (!successRateChart) return;
    if (!Array.isArray(rates) || rates.length === 0) {
        successRateChart.innerHTML =
            '<div class="chart-empty">Spill minst en runde for \u00e5 se utvikling.</div>';
        return;
    }
    const clampedRates = rates.map((rate) =>
        Math.min(Math.max(rate, 0), 100),
    );
    const width = 100;
    const height = 120;
    const paddingX = 6;
    const paddingY = 16;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;
    const step =
        clampedRates.length > 1 ? chartWidth / (clampedRates.length - 1) : 0;

    const points = clampedRates.map((rate, index) => {
        const x = paddingX + index * step;
        const y = paddingY + (1 - rate / 100) * chartHeight;
        return { x, y, rate };
    });

    const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
    const areaPath = [
        `M ${points[0].x},${height - paddingY}`,
        ...points.map((point) => `L ${point.x},${point.y}`),
        `L ${points[points.length - 1].x},${height - paddingY}`,
        "Z",
    ].join(" ");

    const circles = points
        .map(
            (point) =>
                `<circle class="chart-point" cx="${point.x}" cy="${point.y}" r="2.6">
                    <title>${point.rate}%</title>
                </circle>`,
        )
        .join("");

    const values = clampedRates
        .map((rate) => `<span class="chart-value">${rate}%</span>`)
        .join("");

    successRateChart.innerHTML = `
        <svg class="chart-line" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="Suksessrate siste ti spill">
            <path class="chart-line-fill" d="${areaPath}"></path>
            <polyline class="chart-line-path" points="${linePoints}"></polyline>
            ${circles}
        </svg>
        <div class="chart-values" aria-hidden="true">
            ${values}
        </div>
    `;
}

function updateStartScreen() {
    updateRecordDisplay();
    const todayStats = getTodayStats();
    const allTimeStats = getAllTimeStats();
    ensureWeeklyBucket(allTimeStats);

    if (todayStats.attempts > 0) {
        recordSub.textContent = `Riktige svar i dag: ${todayStats.correct}`;
    } else {
        recordSub.textContent = "Ingen svar registrert i dag";
    }

    recordSession.textContent = `Beste streak denne sesjonen: ${sessionBestStreak}`;

    const successRate = calcSuccessRate(allTimeStats);
    statSuccessRate.textContent = formatPercent(successRate);
    statRounds.textContent = String(allTimeStats.rounds);
    statMastered.textContent = String(
        Object.keys(allTimeStats.masteredWords || {}).length,
    );
    statTrend.textContent = formatTrend({
        lastRate: allTimeStats.lastRate,
        currentRate: allTimeStats.currentRate ?? successRate,
    });

    const record = getRecordValue();
    if (record === null) {
        motivationText.textContent = "Sett den f\u00f8rste rekorden din!";
    } else if (sessionBestStreak >= record) {
        motivationText.textContent = "Du er p\u00e5 vei!";
    } else {
        motivationText.textContent = "Pr\u00f8v \u00e5 sl\u00e5 din rekord!";
    }

    milestoneText.textContent = `Ord mestret denne uken: ${allTimeStats.weeklyMastered.count}`;
    renderSuccessRateChart(allTimeStats.recentRates);
}

function resetStats() {
    state.order = shuffle(getSelectedWordList());
    state.index = 0;
    state.attempts = 0;
    state.correct = 0;
    state.points = 0;
    state.streak = 0;
    state.longestStreak = 0;
    state.startTime = Date.now();
    state.totalSeconds = 0;
    state.locked = false;
    state.roundResults = [];
}

function updateProgress() {
    progressText.textContent = `Oppgave ${state.index + 1} av ${state.order.length}`;
}

function updateSummary() {
    statTotal.textContent = String(state.attempts);
    statCorrect.textContent = String(state.correct);
    statStreak.textContent = String(state.longestStreak);
    statPoints.textContent = String(state.points);
    statTime.textContent = formatTime(state.totalSeconds);
}

function setTimer(active) {
    if (state.timerId) {
        clearInterval(state.timerId);
        state.timerId = null;
    }
    if (!active) return;
    state.timerId = setInterval(() => {
        state.totalSeconds = Math.floor((Date.now() - state.startTime) / 1000);
        updateSummary();
    }, 1000);
}

function lockInput(isLocked) {
    state.locked = isLocked;
    answerInput.disabled = isLocked;
    submitBtn.disabled = isLocked;
    skipBtn.disabled = isLocked;
    endBtn.disabled = isLocked;
}

function loadWord() {
    if (state.index >= state.order.length) {
        endGame();
        return;
    }
    const word = state.order[state.index];
    descriptionText.textContent = word.beskrivelse;
    hintText.textContent = `Starter med ${word.forsteBokstav}`;
    answerInput.value = "";
    answerInput.classList.remove("correct", "wrong");
    feedbackText.textContent = "";
    lockInput(false);
    updateProgress();
    answerInput.focus();
}

function normalizeAnswer(value) {
    return value.trim().toLowerCase();
}

function handleAnswer(isSkip) {
    if (state.locked) return;
    lockInput(true);
    const word = state.order[state.index];
    const given = normalizeAnswer(answerInput.value);
    state.attempts += 1;

    const isCorrect =
        !isSkip && given.length > 0 && given === normalizeAnswer(word.ord);

    state.roundResults.push({ word: word.ord, correct: isCorrect });

    if (isCorrect) {
        answerInput.classList.add("correct");
        feedbackText.textContent = "Riktig!";
        state.correct += 1;
        state.points += 1;
        state.streak += 1;
        state.longestStreak = Math.max(state.longestStreak, state.streak);
    } else {
        answerInput.classList.add("wrong");
        state.streak = 0;
        feedbackText.textContent = isSkip
            ? `Hoppet over. Riktig svar: ${word.ord}`
            : `Feil. Riktig svar: ${word.ord}`;
    }

    updateSummary();

    setTimeout(() => {
        state.index += 1;
        loadWord();
    }, NEXT_DELAY_MS);
}

function startGame() {
    resetStats();
    updateSummary();
    showScreen(gameScreen);
    setTimer(true);
    loadWord();
}

function endGame() {
    lockInput(true);
    setTimer(false);
    updateSummary();
    showScreen(endScreen);

    const todayStats = getTodayStats();
    const allTimeStats = getAllTimeStats();
    applyRoundStats(todayStats, allTimeStats, state.roundResults);
    writeStorage(STATS_TODAY_KEY, todayStats);
    writeStorage(STATS_ALLTIME_KEY, allTimeStats);

    sessionBestStreak = Math.max(sessionBestStreak, state.longestStreak);

    const recordResult = updateRecordIfNeeded(state);
    if (recordResult.updated) {
        endMessage.textContent = "Ny rekord!";
        endRecordText.textContent = `Du slo din tidligere rekord og satte ${recordResult.value}.`;
    } else if (recordResult.value !== null) {
        endMessage.textContent = "Runden er over!";
        endRecordText.textContent = `Din beste rekke er fortsatt ${recordResult.value}.`;
    } else {
        endMessage.textContent = "Runden er over!";
        endRecordText.textContent =
            "Spill igjen og sett din f\u00f8rste rekord!";
    }

    updateStartScreen();
}

function backToStart() {
    updateStartScreen();
    showScreen(startScreen);
    progressText.textContent = "Oppgave 0 av 0";
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
backBtn.addEventListener("click", backToStart);
endBtn.addEventListener("click", endGame);

// Modal event listeners
successRateInfoBtn.addEventListener("click", () => {
    openModal(successRateModal);
});

masteredWordsInfoBtn.addEventListener("click", () => {
    openModal(masteredWordsModal);
});

closeSuccessRateModalBtn.addEventListener("click", () => {
    closeModal(successRateModal);
});

closeMasteredWordsModalBtn.addEventListener("click", () => {
    closeModal(masteredWordsModal);
});

modalOverlay.addEventListener("click", () => {
    if (successRateModal.classList.contains("active")) {
        closeModal(successRateModal);
    }
    if (masteredWordsModal.classList.contains("active")) {
        closeModal(masteredWordsModal);
    }
});

// Lukk modal pÃ¥ ESC-tast
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (successRateModal.classList.contains("active")) {
            closeModal(successRateModal);
        }
        if (masteredWordsModal.classList.contains("active")) {
            closeModal(masteredWordsModal);
        }
    }
});

submitBtn.addEventListener("click", () => handleAnswer(false));
skipBtn.addEventListener("click", () => handleAnswer(true));

answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleAnswer(false);
    }
});

updateStartScreen();


