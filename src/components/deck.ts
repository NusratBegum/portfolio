import { createContext, useContext } from 'react';
import type { SlideName } from '../data/content';

/** In-deck navigation: App provides the rail's goTo, so any CTA with a
    `slide` target flies the deck there instead of jumping to an anchor
    (an anchor jump would scroll the overflow-hidden track sideways). */
export const DeckContext = createContext<(slide: SlideName) => void>(() => {});
export const useDeck = () => useContext(DeckContext);
