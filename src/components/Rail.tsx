import { useEffect, useRef } from 'react';
import { journey } from '../store/journey';
import logoUrl from '../assets/flamingo-logo.svg';

export default function Rail({
  stops, active, onGo,
}: { stops: string[]; active: number; onGo: (i: number) => void }) {
  const bird = useRef<HTMLImageElement>(null);
  const lane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (bird.current && lane.current) {
        const w = lane.current.clientWidth - 22;
        bird.current.style.transform = `translateX(${journey.p * w}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="liquid-glass fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full px-5 py-3">
      <div className="hidden gap-3.5 md:flex" role="navigation" aria-label="Slides">
        {stops.map((s, i) => (
          <button
            key={s}
            onClick={() => onGo(i)}
            className={`font-mono text-label uppercase transition-colors ${i === active ? 'text-accent' : 'text-muted hover:text-ink'}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div ref={lane} className="relative h-0.5 w-[clamp(70px,14vw,150px)] rounded bg-line">
        <img
          ref={bird}
          src={logoUrl}
          alt=""
          aria-hidden
          className="absolute -top-[19px] left-0 w-[20px] will-change-transform"
        />
      </div>
    </div>
  );
}
