import { useEffect, useRef } from 'react';
import { journey } from '../store/journey';
import { RAIL } from '../data/content';
import { cx } from './ui/cx';
import logoUrl from '../assets/flamingo-logo.svg';

/* Bottom rail: section buttons (md+) and a progress lane the flamingo mark
   rides along. Buttons are 44px tall; the active one is marked for assistive
   tech with aria-current, not just colour. */
export default function Rail({
  stops, active, onGo,
}: { stops: string[]; active: number; onGo: (i: number) => void }) {
  const bird = useRef<HTMLImageElement>(null);
  const lane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (bird.current && lane.current) {
        const w = lane.current.clientWidth - bird.current.clientWidth;
        bird.current.style.transform = `translateX(${journey.p * w}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="glass-chrome fixed bottom-4 left-1/2 z-chrome flex h-8 -translate-x-1/2 items-center gap-3 rounded-pill px-5 md:h-auto md:pl-2">
      <nav aria-label={RAIL.ariaLabel} className="hidden md:block">
        <ul className="flex">
          {stops.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => onGo(i)}
                aria-current={i === active ? 'true' : undefined}
                className={cx(
                  'inline-flex min-h-11 items-center rounded-pill px-2 font-mono text-label uppercase transition-colors',
                  i === active ? 'text-accent-ink' : 'text-muted hover:text-ink',
                )}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div ref={lane} aria-hidden className="relative h-0.5 w-16 rounded-pill bg-line md:w-24 lg:w-36">
        <img ref={bird} src={logoUrl} alt="" className="absolute -top-4.5 left-0 w-5 will-change-transform" />
      </div>
    </div>
  );
}
