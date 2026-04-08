import { createGame } from "./game/createGame.js";
import { playCardClickSound } from "./ui/playCardClickSound.js";
import { renderGame } from "./ui/renderGame.js";

const root = {
  board: document.querySelector("#memory-board"),
  counter: document.querySelector("#flip-count"),
  resetButton: document.querySelector("#reset-game-button"),
};

let game = createGame();
let isResetting = false;
let wasComplete = false;

const sync = () => {
  const state = game.getState();

  renderGame(root, state);

  if (state.isComplete && !wasComplete) {
    playCardClickSound("celebration");
  }

  wasComplete = state.isComplete;
};

root.board.addEventListener("pointerdown", (event) => {
  if (isResetting) {
    return;
  }

  const target = event.target.closest("[data-card-id]");

  if (!target || target.disabled) {
    return;
  }

  window.clearTimeout(target._pulseTimeoutId);
  target.classList.remove("is-pulsing");
  void target.offsetWidth;
  target.classList.add("is-pulsing");
  target._pulseTimeoutId = window.setTimeout(() => {
    target.classList.remove("is-pulsing");
  }, 260);
});

root.board.addEventListener("click", async (event) => {
  if (isResetting) {
    return;
  }

  const target = event.target.closest("[data-card-id]");

  if (!target) {
    return;
  }

  const result = game.flipCard(target.dataset.cardId);

  if (result === "match") {
    playCardClickSound("match");
  }

  if (result === "resolve-mismatch") {
    playCardClickSound("mismatch");
  }

  sync();

  if (result === "resolve-mismatch") {
    await game.hideMismatch();
    sync();
  }
});

root.resetButton.addEventListener("click", async () => {
  await resetGameWithWave();
});

document.addEventListener("click", async (event) => {
  const resetTrigger = event.target.closest("[data-celebration-reset]");

  if (!resetTrigger) {
    return;
  }

  await resetGameImmediately();
});

sync();

async function resetGameWithWave() {
  if (isResetting) {
    return;
  }

  isResetting = true;
  root.resetButton.disabled = true;
  root.board.classList.add("is-resetting");

  await animateResetWave(root.board);

  resetGameState();
  isResetting = false;
  root.resetButton.disabled = false;
  root.board.classList.remove("is-resetting");
  sync();
}

async function resetGameImmediately() {
  if (isResetting) {
    return;
  }

  isResetting = true;
  root.resetButton.disabled = true;
  resetGameState();
  isResetting = false;
  root.resetButton.disabled = false;
  sync();
}

function resetGameState() {
  game = createGame();
  wasComplete = false;
  root.board.classList.remove("is-resetting");
}

async function animateResetWave(board) {
  const cards = Array.from(board.querySelectorAll("[data-card-id]"));
  const waveStep = 70;
  const flipDuration = 820;

  cards.forEach((card, index) => {
    card.style.setProperty("--reset-delay", `${index * waveStep}ms`);
    card.classList.add("is-resetting");
  });

  const totalDuration = Math.max(cards.length - 1, 0) * waveStep + flipDuration;
  await wait(totalDuration);

  cards.forEach((card) => {
    card.classList.remove("is-resetting");
    card.style.removeProperty("--reset-delay");
  });
}

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}
