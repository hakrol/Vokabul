const questions = [
  {
    sentence:
      "Etter flere uker med motgang virket han helt ___, ute av stand til \u00e5 f\u00f8le engasjement eller interesse.",
    choices: ["Apatisk", "Euforisk", "Engasjert", "Rastl\u00f8s"],
    answer: "Apatisk",
    explanation:
      "Apatisk betyr likegyldig og uten f\u00f8lelser eller engasjement.",
  },
  {
    sentence:
      "Hun ble helt ___ da hun fikk beskjeden og fant ingen ord.",
    choices: ["Talef\u00f8r", "M\u00e5ll\u00f8s", "Selvsikker", "Avslappet"],
    answer: "M\u00e5ll\u00f8s",
    explanation:
      "M\u00e5ll\u00f8s betyr at man blir stum av overraskelse eller sjokk.",
  },
  {
    sentence: "Forslaget var lite ___ og manglet detaljer.",
    choices: ["Gjennomtenkt", "Fargerikt", "Hastig", "H\u00f8ytidelig"],
    answer: "Gjennomtenkt",
    explanation:
      "Gjennomtenkt betyr at noe er grundig planlagt og overveid.",
  },
  {
    sentence: "Et ___ svar er lett \u00e5 huske.",
    choices: ["Kortfattet", "Omkostelig", "Omstendelig", "Utydelig"],
    answer: "Kortfattet",
    explanation:
      "Kortfattet betyr at noe er kort og presist uten un\u00f8dvendige ord.",
  },
  {
    sentence: "Stemningen var ___ etter seieren.",
    choices: ["Euforisk", "Apatisk", "Monoton", "Urolig"],
    answer: "Euforisk",
    explanation:
      "Euforisk beskriver en tilstand av sterk glede eller oppstemthet.",
  },
  {
    sentence: "Hun gjorde en ___ innsats og ble lagt merke til.",
    choices: ["Imponerende", "Tilbakelent", "N\u00f8lende", "Uinspirert"],
    answer: "Imponerende",
    explanation:
      "Imponerende betyr at noe vekker beundring eller respekt.",
  },
  {
    sentence: "Et ___ argument overbeviser sjelden.",
    choices: ["Mangelfullt", "Solid", "Overbevisende", "Tydelig"],
    answer: "Mangelfullt",
    explanation:
      "Mangelfullt betyr ufullstendig eller svakt utf\u00f8rt.",
  },
  {
    sentence: "Han var ___ i m\u00f8tet og tok ordet ofte.",
    choices: ["Talef\u00f8r", "Innadvendt", "Likegyldig", "Nerv\u00f8s"],
    answer: "Talef\u00f8r",
    explanation:
      "Talef\u00f8r betyr at man er pratsom og snakker lett.",
  },
  {
    sentence: "Den ___ stillheten gjorde henne urolig.",
    choices: ["Trykkende", "Lett", "Lun", "Rolig"],
    answer: "Trykkende",
    explanation:
      "Trykkende betyr tung, tett eller ubehagelig.",
  },
  {
    sentence: "Svarene var ___ og manglet f\u00f8lelser.",
    choices: ["N\u00f8ytrale", "S\u00e5rende", "Lidenskapelige", "Ustabile"],
    answer: "N\u00f8ytrale",
    explanation:
      "N\u00f8ytral betyr uten sterke f\u00f8lelser eller tydelig standpunkt.",
  },
  {
    sentence: "Han kom med en ___ forklaring som ingen forstod.",
    choices: ["Uklar", "Presis", "Tydelig", "Konsis"],
    answer: "Uklar",
    explanation: "Uklar betyr at noe er vanskelig \u00e5 forst\u00e5.",
  },
  {
    sentence: "Hun var ___ til endringen og ville pr\u00f8ve noe nytt.",
    choices: ["Positiv", "Skeptisk", "Avvisende", "Lunken"],
    answer: "Positiv",
    explanation:
      "Positiv betyr at man er optimistisk eller velvillig innstilt.",
  },
];

const TOTAL_QUESTIONS = 10;
const screenStart = document.querySelector("#screenStart");
const screenGame = document.querySelector("#screenGame");
const startButton = document.querySelector("#startGame");
const restartButton = document.querySelector("#restart");
const backToStartButton = document.querySelector("#backToStart");
const playAgainButton = document.querySelector("#playAgain");
const summaryBackButton = document.querySelector("#summaryBack");
const sentenceEl = document.querySelector("#sentence");
const choicesEl = document.querySelector("#choices");
const feedbackEl = document.querySelector("#feedback");
const explanationEl = document.querySelector("#explanation");
const nextButton = document.querySelector("#next");
const scoreEl = document.querySelector("#score");
const correctEl = document.querySelector("#correct");
const wrongEl = document.querySelector("#wrong");
const progressEl = document.querySelector("#progress");
const summaryEl = document.querySelector("#summary");
const summaryTextEl = document.querySelector("#summaryText");
const promptArea = document.querySelector("#promptArea");
const gameControls = document.querySelector("#gameControls");

const state = {
  questions: [],
  index: 0,
  score: 0,
  correct: 0,
  wrong: 0,
  locked: false,
};

const roundSections = [promptArea, choicesEl, feedbackEl, explanationEl, gameControls];

const shuffle = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const showStartScreen = () => {
  screenStart.classList.remove("hidden");
  screenGame.classList.add("hidden");
};

const showGameScreen = () => {
  screenStart.classList.add("hidden");
  screenGame.classList.remove("hidden");
};

const toggleRoundView = (showRound) => {
  roundSections.forEach((section) => {
    section.classList.toggle("hidden", !showRound);
  });
  summaryEl.classList.toggle("hidden", showRound);
};

const updateStats = () => {
  scoreEl.textContent = state.score;
  correctEl.textContent = state.correct;
  wrongEl.textContent = state.wrong;
  progressEl.textContent = `${state.index + 1}/${state.questions.length}`;
};

const resetFeedback = () => {
  feedbackEl.textContent = "";
  feedbackEl.removeAttribute("data-state");
  explanationEl.textContent = "";
};

const renderQuestion = () => {
  const current = state.questions[state.index];
  state.locked = false;
  sentenceEl.textContent = current.sentence;
  choicesEl.innerHTML = "";
  resetFeedback();
  nextButton.disabled = true;
  nextButton.textContent =
    state.index === state.questions.length - 1 ? "Se resultat" : "Neste";

  current.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.textContent = choice;
    button.addEventListener("click", () => handleChoice(choice, button));
    choicesEl.appendChild(button);
  });

  updateStats();
};

const lockChoices = (currentAnswer, chosenButton) => {
  [...choicesEl.children].forEach((button) => {
    button.disabled = true;
    if (button.textContent === currentAnswer) {
      button.classList.add("correct");
    }
  });
  if (chosenButton) {
    chosenButton.classList.add(
      chosenButton.textContent === currentAnswer ? "correct" : "wrong"
    );
  }
};

const handleChoice = (choice, button) => {
  if (state.locked) {
    return;
  }

  const current = state.questions[state.index];
  const isCorrect = choice === current.answer;
  state.locked = true;

  if (isCorrect) {
    state.score += 1;
    state.correct += 1;
    feedbackEl.textContent = `Riktig! ${current.answer} passer best.`;
    feedbackEl.dataset.state = "success";
  } else {
    state.wrong += 1;
    feedbackEl.textContent = `Feil. Riktig ord er ${current.answer}.`;
    feedbackEl.dataset.state = "error";
  }

  explanationEl.textContent = current.explanation;
  lockChoices(current.answer, button);
  nextButton.disabled = false;
  updateStats();
};

const showSummary = () => {
  toggleRoundView(false);
  summaryTextEl.textContent = `Du fikk ${state.correct} av ${state.questions.length} riktige.`;
};

const startGame = () => {
  state.questions = shuffle(questions).slice(0, TOTAL_QUESTIONS);
  state.index = 0;
  state.score = 0;
  state.correct = 0;
  state.wrong = 0;
  toggleRoundView(true);
  showGameScreen();
  renderQuestion();
};

const nextQuestion = () => {
  if (!state.locked) {
    return;
  }

  if (state.index < state.questions.length - 1) {
    state.index += 1;
    renderQuestion();
    return;
  }

  showSummary();
};

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
backToStartButton.addEventListener("click", showStartScreen);
summaryBackButton.addEventListener("click", showStartScreen);
playAgainButton.addEventListener("click", startGame);
nextButton.addEventListener("click", nextQuestion);

showStartScreen();
