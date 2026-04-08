export function drawFromDeck(state) {
  if (state.deck.length === 0) {
    return state;
  }

  const [nextCard, ...remainingDeck] = state.deck;

  return {
    ...state,
    deck: remainingDeck,
    hand: [...state.hand, nextCard],
  };
}
