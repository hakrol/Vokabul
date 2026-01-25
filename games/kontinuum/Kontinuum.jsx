import React, { useEffect, useMemo, useState } from "react";

const LEVELS = [
    {
        startAnchor: "Iskald",
        endAnchor: "Kokende",
        middleWords: ["Kj\u00f8lig", "Lunkent", "Varmt"],
    },
    {
        startAnchor: "Ubetydelig",
        endAnchor: "Eksistensielt",
        middleWords: ["Viktig", "Sentralt", "Kritisk"],
    },
    {
        startAnchor: "Glimt",
        endAnchor: "Flomlys",
        middleWords: ["Lys", "Skinn", "Str\u00e5le"],
    },
];

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

export default function Kontinuum() {
    const [levelIndex, setLevelIndex] = useState(0);
    const [order, setOrder] = useState([]);
    const [checked, setChecked] = useState(false);
    const [results, setResults] = useState([]);
    const [dragIndex, setDragIndex] = useState(null);
    const [solved, setSolved] = useState(false);
    const [perfectCount, setPerfectCount] = useState(0);

    const level = useMemo(() => LEVELS[levelIndex], [levelIndex]);

    useEffect(() => {
        const shuffled = shuffleUntilDifferent(level.middleWords);
        setOrder(shuffled);
        setChecked(false);
        setResults([]);
        setSolved(false);
    }, [levelIndex, level]);

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
        if (levelIndex >= LEVELS.length - 1) return;
        setLevelIndex((prev) => prev + 1);
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

    return (
        <div className="space-y-6">
            <div className="card-shell p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm uppercase tracking-widest text-slate-400">
                        Niv\u00e5 {levelIndex + 1} av {LEVELS.length}
                    </div>
                    <div className="pill-tag text-sm">
                        Perfekte niv\u00e5er: <strong>{perfectCount}</strong>
                    </div>
                </div>

                <div className="mt-6 card-panel p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="text-lg font-semibold text-slate-200">
                            {level.startAnchor}
                        </div>
                        <div className="text-lg font-semibold text-slate-200">
                            {level.endAnchor}
                        </div>
                    </div>
                    <div className="track-line mt-6 flex flex-wrap items-center justify-center gap-3">
                        {order.map((word, index) => {
                            const status =
                                checked && results[index] ? "bg-emerald-400" : "";
                            const wrong =
                                checked && !results[index] ? "bg-rose-500" : "";
                            return (
                                <button
                                    key={`${word}-${index}`}
                                    draggable
                                    onDragStart={() => onDragStart(index)}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={() => onDrop(index)}
                                    className={`relative z-10 word-pill px-4 py-2 text-sm font-semibold transition ${
                                        status || wrong
                                    }`}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        className="btn btn-ghost text-sm"
                        onClick={handleCheck}
                        disabled={checked}
                    >
                        Sjekk svar
                    </button>
                    <button
                        className="btn btn-primary text-sm"
                        onClick={handleNext}
                        disabled={!solved}
                    >
                        Neste niv\u00e5
                    </button>
                </div>
            </div>
        </div>
    );
}
