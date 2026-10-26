/* Shared mutable state between the DOM scroll world (GSAP) and the 3D world
   (react-three-fiber). Written every scroll tick, read every animation frame —
   deliberately outside React state to avoid re-render churn. */

export const journey = {
  /** 0 → 1 across the whole horizontal flight */
  p: 0,
  /** pointer in normalized device coords, for parallax */
  px: 0,
  py: 0,
};

export const SLIDE_COUNT = 6;
/** world-units between slide stations along X */
export const STATION_DX = 10;
export const SPAN = STATION_DX * (SLIDE_COUNT - 1);

export const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* exposed for debugging / visual-test harnesses */
if (typeof window !== 'undefined') (window as any).__journey = journey;
