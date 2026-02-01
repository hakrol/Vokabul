const { useEffect, useMemo, useState } = React;

const LEVELS = window.VokabulWordSets?.kontinuum?.levels || [];

const storage = window.VokabulStorage;
if (storage) {
    storage.migrateStorageIfNeeded();
}
const storageAvailable = storage ? storage.canUseStorage() : false;
const STORAGE_KEYS = storage ? storage.keys : null;

const STORAGE_KEY = STORAGE_KEYS
    ? STORAGE_KEYS.KONTINUUM_STATS
    : "kontinuum_stats_v1";

function loadStats() {
    if (!storageAvailable) return { best: 0, last: 0 };
    const parsed =
        storage && storage.readJson ? storage.readJson(STORAGE_KEY, null) : null;
    if (!parsed) return { best: 0, last: 0 };
    return {
        best: Number(parsed.best) || 0,
        last: Number(parsed.last) || 0,
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

function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function sameOrder(a, b) {
    return a.every((item, index) => item === b[index]);
}

function shuffleUntilDifferent(list) {
    let shuffled = shuffle(list);
    let guard = 0;
    while (sameOrder(shuffled, list) && guard < 8) {
        shuffled = shuffle(list);
        guard += 1;
    }
    return shuffled;
}

function moveItem(list, from, to) {
    const copy = list.slice();
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
}

function KontinuumApp() {
    const [screen, setScreen] = useState("start");
    const [levelIndex, setLevelIndex] = useState(0);
    const [order, setOrder] = useState([]);
    const [checked, setChecked] = useState(false);
    const [results, setResults] = useState([]);
    const [dragIndex, setDragIndex] = useState(null);
    const [solved, setSolved] = useState(false);
    const [perfectCount, setPerfectCount] = useState(0);
    const [stats, setStats] = useState(loadStats());

    const level = useMemo(() => LEVELS[levelIndex], [levelIndex]);
    const h = React.createElement;

    useEffect(() => {
        const el = document.getElementById("bestStat");
        if (el) el.textContent = String(stats.best);
    }, [stats]);

    useEffect(() => {
        if (screen !== "game") return;
        const shuffled = shuffleUntilDifferent(level.middleWords);
        setOrder(shuffled);
        setChecked(false);
        setResults([]);
        setSolved(false);
    }, [levelIndex, screen, level]);

    function handleCheck() {
        if (checked) return;
        const correct = level.middleWords;
        const nextResults = order.map((word, index) => word === correct[index]);
        setResults(nextResults);
        setChecked(true);
        if (nextResults.every(Boolean)) {
            setSolved(true);
            setPerfectCount((prev) => prev + 1);
        }
    }

    function handleNext() {
        if (levelIndex === LEVELS.length - 1) {
            const last = perfectCount;
            const best = Math.max(stats.best, last);
            const nextStats = { best, last };
            setStats(nextStats);
            saveStats(nextStats);
            setScreen("summary");
            return;
        }
        setLevelIndex((prev) => prev + 1);
    }

    function startGame() {
        setPerfectCount(0);
        setLevelIndex(0);
        setScreen("game");
    }

    function backToStart() {
        setScreen("start");
    }

    function onDragStart(index) {
        setDragIndex(index);
    }

    function onDrop(index) {
        if (dragIndex === null || dragIndex === index) return;
        setOrder((prev) => moveItem(prev, dragIndex, index));
        setDragIndex(null);
        setChecked(false);
        setResults([]);
        setSolved(false);
    }

    const startScreen = h(
        "div",
        { className: "card-shell p-6" },
        h("h2", { className: "title-serif text-xl font-semibold" }, "Start en runde"),
        h(
            "p",
            { className: "mt-2 text-slate-400" },
            "Dra ordene langs sporet og sorter dem etter styrke."
        ),
        h(
            "div",
            { className: "mt-4 grid gap-3 sm:grid-cols-2" },
            h(
                "div",
                { className: "stat-card p-4" },
                h(
                    "div",
                    { className: "text-xs uppercase tracking-widest text-slate-500" },
                    "Beste serie"
                ),
                h("div", { className: "text-2xl font-semibold text-slate-100" }, stats.best)
            ),
            h(
                "div",
                { className: "stat-card p-4" },
                h(
                    "div",
                    { className: "text-xs uppercase tracking-widest text-slate-500" },
                    "Sist fullf\u00f8rt"
                ),
                h("div", { className: "text-2xl font-semibold text-slate-100" }, stats.last)
            )
        ),
        h(
            "button",
            {
                className: "mt-6 btn btn-primary",
                onClick: startGame,
            },
            "Start niv\u00e5"
        )
    );

    const wordButtons = order.map((word, index) => {
        const status = checked && results[index] ? "bg-emerald-400" : "";
        const wrong = checked && !results[index] ? "bg-rose-500" : "";
        return h(
            "button",
            {
                key: `${word}-${index}`,
                draggable: true,
                onDragStart: () => onDragStart(index),
                onDragOver: (event) => event.preventDefault(),
                onDrop: () => onDrop(index),
                className: `relative z-10 word-pill px-4 py-2 text-sm font-semibold transition ${status || wrong}`,
            },
            word
        );
    });

    const gameScreen = h(
        "div",
        { className: "card-shell p-6" },
        h(
            "div",
            { className: "flex flex-wrap items-center justify-between gap-3" },
            h(
                "div",
                { className: "text-sm uppercase tracking-widest text-slate-400" },
                `Niv\u00e5 ${levelIndex + 1} av ${LEVELS.length}`
            ),
            h(
                "div",
                { className: "pill-tag text-sm" },
                "Perfekte niv\u00e5er: ",
                h("strong", null, perfectCount)
            )
        ),
        h(
            "div",
            { className: "mt-6 card-panel p-6" },
            h(
                "div",
                { className: "flex flex-wrap items-center justify-between gap-4" },
                h("div", { className: "text-lg font-semibold text-slate-200" }, level.startAnchor),
                h("div", { className: "text-lg font-semibold text-slate-200" }, level.endAnchor)
            ),
            h(
                "div",
                { className: "track-line mt-6 flex flex-wrap items-center justify-center gap-3" },
                wordButtons
            )
        ),
        h(
            "div",
            { className: "mt-6 flex flex-wrap gap-3" },
            h(
                "button",
                {
                    className: "btn btn-ghost text-sm",
                    onClick: handleCheck,
                    disabled: checked,
                },
                "Sjekk svar"
            ),
            h(
                "button",
                {
                    className: "btn btn-primary text-sm",
                    onClick: handleNext,
                    disabled: !solved,
                },
                "Neste niv\u00e5"
            ),
            h(
                "button",
                {
                    className: "btn btn-outline text-sm",
                    onClick: backToStart,
                },
                "Avslutt"
            )
        )
    );

    const summaryScreen = h(
        "div",
        { className: "card-shell p-6" },
        h("h2", { className: "title-serif text-xl font-semibold" }, "Runde ferdig"),
        h(
            "p",
            { className: "mt-2 text-slate-400" },
            `Du l\u00f8ste ${perfectCount} av ${LEVELS.length} niv\u00e5er perfekt.`
        ),
        h(
            "button",
            {
                className: "mt-6 btn btn-primary",
                onClick: backToStart,
            },
            "Til startsiden"
        )
    );

    return h(
        "div",
        { className: "space-y-6" },
        screen === "start" ? startScreen : null,
        screen === "game" ? gameScreen : null,
        screen === "summary" ? summaryScreen : null
    );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(React.createElement(KontinuumApp));


