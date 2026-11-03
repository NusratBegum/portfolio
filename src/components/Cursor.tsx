import { useEffect, useRef } from 'react';
import { REDUCED } from '../store/journey';

/** custom cursor — terracotta dot + trailing ring that swells over links.
    Shown only once the effect turns it on (fine pointer, ≥1024px, motion OK);
    otherwise the parked ring would peek out of the top-left corner. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (REDUCED || !window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches) return;
    document.documentElement.classList.add('custom-cursor');

    let x = -100; let y = -100;
    let rx = -100; let ry = -100;
    let hot = false;
    let down = false;
    let raf = 0;

    const HOT = 'a, button, [role="button"], input, textarea, select, [data-cursor]';
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      /* pointermove keeps state honest even when the DOM changes under a
         stationary pointer (scroll-driven slides) */
      hot = !!(e.target as HTMLElement).closest?.(HOT);
    };
    const over = (e: PointerEvent) => {
      hot = !!(e.target as HTMLElement).closest?.(HOT);
    };
    const press = () => { down = true; };
    const release = () => { down = false; };
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) {
        dot.current.style.transform = `translate(${x}px, ${y}px) scale(${hot ? 2.2 : 1})`;
      }
      if (ring.current) {
        const s = down ? 1.7 : hot ? 2.6 : 1;
        ring.current.style.transform = `translate(${rx}px, ${ry}px) scale(${s})`;
        ring.current.style.opacity = hot ? '1' : '0.5';
        ring.current.style.backgroundColor = hot ? 'var(--accent-wash)' : 'transparent';
        ring.current.style.borderWidth = hot ? '1px' : '1.5px';
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', press, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      document.documentElement.classList.remove('custom-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-cursor hidden [.custom-cursor_&]:block">
      <div
        ref={dot}
        className="absolute -top-0.75 -left-0.75 size-1.5 rounded-pill bg-accent will-change-transform"
      />
      <div
        ref={ring}
        className="absolute -top-4.25 -left-4.25 size-8.5 rounded-pill border border-accent/80 transition-[opacity,background-color] duration-slow will-change-transform"
      />
    </div>
  );
}
