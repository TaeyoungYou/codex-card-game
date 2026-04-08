export function renderGame(root, state) {
  root.counter.textContent = String(state.flipCount).padStart(2, "0");
  updateCelebration(root, state);

  const cardElements = new Map(
    Array.from(root.board.querySelectorAll("[data-card-id]")).map((element) => [element.dataset.cardId, element]),
  );

  state.cards.forEach((card) => {
    const element = cardElements.get(card.id) ?? createCardElement(card.id);
    updateCardElement(element, card, state.isLocked, state.selectedCardIds);
    root.board.append(element);
  });
}

function createCardElement(cardId) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "memory-card";
  button.dataset.cardId = cardId;
  button.innerHTML = `
    <span class="card-face card-front"><span class="face-content"></span></span>
    <span class="card-face card-back"><span class="face-content">?</span></span>
  `;

  return button;
}

function updateCardElement(button, card, isLocked, selectedCardIds) {
  const isRevealed = card.isFaceUp || card.isMatched;
  const isMismatched = isLocked && selectedCardIds.includes(card.id) && !card.isMatched;
  const front = button.querySelector(".card-front .face-content");
  const wasMismatched = button.dataset.mismatched === "true";

  button.classList.add("memory-card");
  button.classList.toggle("is-revealed", isRevealed);
  button.classList.toggle("is-matched", card.isMatched);
  button.classList.toggle("is-mismatched", isMismatched);
  button.disabled = isLocked || card.isMatched;
  button.setAttribute("aria-label", isRevealed ? `Card ${card.symbol}` : "Hidden card");
  button.dataset.mismatched = String(isMismatched);
  front.textContent = card.symbol;

  if (isMismatched && !wasMismatched) {
    button.classList.remove("is-rejecting");
    void button.offsetWidth;
    button.classList.add("is-rejecting");
  } else if (!isMismatched) {
    button.classList.remove("is-rejecting");
  }
}

function updateCelebration(root, state) {
  const overlay = getCelebrationOverlay();

  overlay.classList.toggle("is-active", state.isComplete);
  overlay.setAttribute("aria-hidden", String(!state.isComplete));
  document.body.classList.toggle("is-celebrating", state.isComplete);

  if (!state.isComplete) {
    return;
  }

  const title = overlay.querySelector("[data-celebration-title]");
  const actionButton = overlay.querySelector("[data-celebration-reset]");

  title.textContent = "CLEAR";
  actionButton.textContent = `${String(state.flipCount).padStart(2, "0")} TURN`;
}

function getCelebrationOverlay() {
  let overlay = document.querySelector("[data-celebration-overlay]");

  if (overlay) {
    return overlay;
  }

  overlay = document.createElement("div");
  overlay.className = "celebration-overlay";
  overlay.dataset.celebrationOverlay = "true";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="celebration-wash"></div>
    <div class="celebration-copy">
      <h2 class="celebration-title" data-celebration-title></h2>
      <button class="board-reset celebration-reset" type="button" data-celebration-reset></button>
    </div>
    <div class="celebration-particles" data-celebration-particles></div>
  `;

  const particleContainer = overlay.querySelector("[data-celebration-particles]");
  const particleCount = 28;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    particle.className = "celebration-particle";
    particle.style.setProperty("--particle-index", String(index));
    particle.style.setProperty("--particle-x", `${(index % 7) * 14 + (index % 2) * 4}%`);
    particle.style.setProperty("--particle-delay", `${(index % 9) * 90}ms`);
    particle.style.setProperty("--particle-duration", `${2200 + (index % 5) * 220}ms`);
    particle.style.setProperty("--particle-drift", `${((index % 6) - 2.5) * 26}px`);
    particle.style.setProperty("--particle-rotate", `${(index % 2 === 0 ? 1 : -1) * (80 + (index % 4) * 18)}deg`);
    particleContainer.append(particle);
  }

  document.body.append(overlay);
  return overlay;
}
