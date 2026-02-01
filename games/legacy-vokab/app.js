// Vokabularspill – flervalg + enkel spaced repetition (Leitner light)
// Lagres i localStorage. Bytt gjerne ut ORD-listen med dine egne ord.

const ORD = window.VokabulWordSets?.legacyVokab?.words || [];

// --- Lagring / progresjon ---
const storage = window.VokabulStorage;
if (storage) {
    storage.migrateStorageIfNeeded();
}
const harLagring = storage ? storage.canUseStorage() : false;
const STORAGE_KEYS = storage ? storage.keys : null;

const KEY = STORAGE_KEYS ? STORAGE_KEYS.LEGACY_STATE : "vokabularspill_v1";
const ATTEMPT_KEY = STORAGE_KEYS
    ? STORAGE_KEYS.LEGACY_ATTEMPTS
    : "legacy_vokab_attempts";
const ATTEMPT_LIMIT = 200;

function lastState() {
    if (!harLagring) return null;
    if (storage && storage.readJson) {
        return storage.readJson(KEY, null);
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function lagreState(state) {
    if (!harLagring) return;
    if (storage && storage.writeJson) {
        storage.writeJson(KEY, state);
        return;
    }
    localStorage.setItem(KEY, JSON.stringify(state));
}

function loggForsok(ordData, retning, valgtTekst, riktig) {
    if (!harLagring || !storage || !storage.appendToList) return;
    storage.appendToList(
        ATTEMPT_KEY,
        {
            word: ordData.no,
            direction: retning,
            chosen: valgtTekst,
            correct: Boolean(riktig),
            timestamp: Date.now(),
        },
        ATTEMPT_LIMIT,
    );
}

function defaultState() {
    // Leitner-boks: 1 (ny/usikker), 2 (kan litt), 3 (mestret)
    // score: historikk for riktig/feil
    return {
        riktig: 0,
        feil: 0,
        streak: 0,
        // per ord: {box:1..3, seen:n, correct:n, wrong:n, lastTs:ms}
        progresjon: ORD.map(() => ({
            box: 1,
            seen: 0,
            correct: 0,
            wrong: 0,
            lastTs: 0,
        })),
    };
}

function normaliserState(s) {
    if (!s || !Array.isArray(s.progresjon)) return defaultState();
    const next = {
        riktig: Number.isFinite(s.riktig) ? s.riktig : 0,
        feil: Number.isFinite(s.feil) ? s.feil : 0,
        streak: Number.isFinite(s.streak) ? s.streak : 0,
        progresjon: s.progresjon.slice(0, ORD.length),
    };

    for (let i = next.progresjon.length; i < ORD.length; i++) {
        next.progresjon.push({
            box: 1,
            seen: 0,
            correct: 0,
            wrong: 0,
            lastTs: 0,
        });
    }

    return next;
}

let state = normaliserState(lastState());

// --- UI hooks ---
const el = {
    sporsmal: document.getElementById("sporsmal"),
    label: document.getElementById("label"),
    valg: document.getElementById("valg"),
    feedback: document.getElementById("feedback"),
    details: document.getElementById("details"),
    forklaring: document.getElementById("forklaring"),
    eksempel: document.getElementById("eksempel"),
    status: document.getElementById("status"),
    streak: document.getElementById("streak"),
    riktig: document.getElementById("riktig"),
    feil: document.getElementById("feil"),
    btnNeste: document.getElementById("btnNeste"),
    btnHopp: document.getElementById("btnHopp"),
    btnTilbakestill: document.getElementById("btnTilbakestill"),
    nivaa: document.getElementById("nivaa"),
};

function hentRetning() {
    const valgt = document.querySelector('input[name="retning"]:checked');
    return valgt ? valgt.value : "no-en";
}

function oppdaterStats() {
    el.streak.innerText = String(state.streak);
    el.riktig.innerText = String(state.riktig);
    el.feil.innerText = String(state.feil);
}

function statusTekst(i) {
    const p = state.progresjon[i];
    const box = p.box;
    const map = { 1: "Ny/usikker", 2: "På vei", 3: "Mestret" };
    return `${map[box] || "Ukjent"} (sett ${p.seen} ganger, riktig ${
        p.correct
    }, feil ${p.wrong})`;
}

// --- Spørsmålsgenerering ---
let gjeldende = null; // {index, retning, riktigSvar, alternativer[]}
let låstSvar = false;

function velgKandidater() {
    const fokus = el.nivaa.value;
    const idx = [];

    for (let i = 0; i < ORD.length; i++) {
        const box = state.progresjon[i].box;
        if (fokus === "mix") idx.push(i);
        if (fokus === "new" && box === 1) idx.push(i);
        if (fokus === "review" && box === 2) idx.push(i);
        if (fokus === "mastered" && box === 3) idx.push(i);
    }

    // fallback hvis filter blir tomt
    if (idx.length === 0) {
        for (let i = 0; i < ORD.length; i++) idx.push(i);
    }

    return idx;
}

// Vektet valg: boks 1 oftere enn boks 2, boks 3 sjeldnere
function trekkOrdIndex() {
    const kandidater = velgKandidater();
    const pool = [];

    kandidater.forEach((i) => {
        const box = state.progresjon[i].box;
        const vekt = box === 1 ? 5 : box === 2 ? 3 : 1;
        for (let k = 0; k < vekt; k++) pool.push(i);
    });

    return pool[Math.floor(Math.random() * pool.length)];
}

function trekkAlternativer(riktigIndex, retning) {
    const alternativer = new Set();
    alternativer.add(riktigIndex);

    while (alternativer.size < 4) {
        alternativer.add(Math.floor(Math.random() * ORD.length));
    }

    const arr = [...alternativer].map((i) => {
        if (retning === "no-en") return { index: i, tekst: ORD[i].en };
        return { index: i, tekst: ORD[i].no };
    });

    // bland
    arr.sort(() => Math.random() - 0.5);
    return arr;
}

function visSporsmal() {
    låstSvar = false;
    el.feedback.className = "feedback";
    el.feedback.innerText = "";
    el.details.classList.remove("show");

    const retning = hentRetning();
    const idx = trekkOrdIndex();
    const ord = ORD[idx];

    const spmTekst = retning === "no-en" ? ord.no : ord.en;
    el.sporsmal.innerText = spmTekst;

    el.label.innerText =
        retning === "no-en"
            ? "Velg riktig engelsk betydning"
            : "Velg riktig norsk betydning";

    const alternativer = trekkAlternativer(idx, retning);

    gjeldende = {
        index: idx,
        retning,
        riktigIndex: idx,
        alternativer,
    };

    // progresjon
    state.progresjon[idx].seen += 1;
    state.progresjon[idx].lastTs = Date.now();
    lagreState(state);

    renderValg();
    oppdaterStats();
}

function renderValg() {
    el.valg.innerHTML = "";

    gjeldende.alternativer.forEach((alt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice";
        btn.innerText = alt.tekst;
        btn.addEventListener("click", () => svar(alt.index, btn));
        el.valg.appendChild(btn);
    });
}

function markerDisableAlle() {
    [...el.valg.querySelectorAll(".choice")].forEach((b) =>
        b.classList.add("disabled")
    );
}

function svar(valgtIndex, valgtBtn) {
    if (låstSvar) return;
    låstSvar = true;

    const riktig = valgtIndex === gjeldende.riktigIndex;
    markerDisableAlle();

    const i = gjeldende.index;
    const prog = state.progresjon[i];
    const valgtTekst =
        gjeldende.retning === "no-en" ? ORD[valgtIndex].en : ORD[valgtIndex].no;
    loggForsok(ORD[i], gjeldende.retning, valgtTekst, riktig);

    // marker knapper
    const buttons = [...el.valg.querySelectorAll(".choice")];
    buttons.forEach((b) => {
        const tekst = b.innerText;
        const riktigTekst =
            gjeldende.retning === "no-en" ? ORD[i].en : ORD[i].no;
        if (tekst === riktigTekst) b.classList.add("correct");
    });

    if (riktig) {
        valgtBtn.classList.add("correct");
        el.feedback.classList.add("ok");
        el.feedback.innerText = "Riktig.";

        state.riktig += 1;
        state.streak += 1;

        prog.correct += 1;
        // opp i boks hvis riktig
        prog.box = Math.min(3, prog.box + 1);
    } else {
        valgtBtn.classList.add("wrong");
        el.feedback.classList.add("bad");
        el.feedback.innerText = "Feil.";

        state.feil += 1;
        state.streak = 0;

        prog.wrong += 1;
        // ned i boks hvis feil
        prog.box = Math.max(1, prog.box - 1);
    }

    lagreState(state);
    oppdaterStats();
    visDetaljer(i);
}

function visDetaljer(i) {
    el.forklaring.innerText = ORD[i].forklaring;
    el.eksempel.innerText = ORD[i].eksempel;
    el.status.innerText = statusTekst(i);
    el.details.classList.add("show");
}

// --- Kontroller ---
function neste() {
    visSporsmal();
}

function hoppOver() {
    if (!gjeldende) return;
    // Hopp over påvirker ikke streak/riktig/feil, men teller som sett
    el.feedback.className = "feedback";
    el.feedback.innerText = "Hoppet over.";
    el.details.classList.remove("show");
    setTimeout(visSporsmal, 250);
}

function nullstill() {
    if (!confirm("Vil du nullstille progresjon og statistikk?")) return;
    state = defaultState();
    lagreState(state);
    oppdaterStats();
    visSporsmal();
}

// init
document.addEventListener("DOMContentLoaded", () => {
    oppdaterStats();
    visSporsmal();

    el.btnNeste.addEventListener("click", neste);
    el.btnHopp.addEventListener("click", hoppOver);
    el.btnTilbakestill.addEventListener("click", nullstill);

    // Når retning eller fokus endres, start nytt spørsmål
    document.querySelectorAll('input[name="retning"]').forEach((r) => {
        r.addEventListener("change", visSporsmal);
    });
    el.nivaa.addEventListener("change", visSporsmal);
});


