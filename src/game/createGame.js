export function createGame() {
  let state = createInitialState();

  return {
    getState() {
      return structuredClone(state);
    },
    flipCard(cardId) {
      if (state.isLocked) {
        return "ignored";
      }

      const card = state.cards.find((entry) => entry.id === cardId);

      if (!card || card.isMatched || card.isFaceUp) {
        return "ignored";
      }

      card.isFaceUp = true;
      state.selectedCardIds.push(card.id);
      if (state.selectedCardIds.length < 2) {
        return "flipped";
      }

      state.flipCount += 1;
      state.turn += 1;

      const [firstId, secondId] = state.selectedCardIds;
      const firstCard = state.cards.find((entry) => entry.id === firstId);
      const secondCard = state.cards.find((entry) => entry.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        state.selectedCardIds = [];

        if (state.cards.every((entry) => entry.isMatched)) {
          state.isComplete = true;
        }

        return "match";
      }

      state.isLocked = true;
      return "resolve-mismatch";
    },
    async hideMismatch() {
      if (!state.isLocked || state.selectedCardIds.length !== 2) {
        return;
      }

      await wait(800);

      state.cards = state.cards.map((card) => {
        if (state.selectedCardIds.includes(card.id)) {
          return { ...card, isFaceUp: false };
        }

        return card;
      });

      state.selectedCardIds = [];
      state.isLocked = false;
    },
  };
}

function createInitialState() {
  return {
    turn: 0,
    flipCount: 0,
    isComplete: false,
    isLocked: false,
    selectedCardIds: [],
    cards: shuffle(createDeck()),
  };
}

function createDeck() {
  const symbols = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return symbols
    .flatMap((symbol, index) => [
      createCard(`${index + 1}-a`, symbol),
      createCard(`${index + 1}-b`, symbol),
    ]);
}

function createCard(id, symbol) {
  return {
    id,
    symbol,
    isFaceUp: false,
    isMatched: false,
  };
}

function shuffle(items) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }

  return next;
}

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}
