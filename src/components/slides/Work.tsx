import { ArrowUpRight, Code } from 'lucide-react';
import Slide from './Slide';
import { BentoCard, BentoGrid, Bars } from '../ui/Bento';
import { PROJECTS } from '../../data/content';

/* one sparkline per project — fills the card's midfield with its trend */
const SPARKS: number[][] = [
  [1.4, 1.0, 0.8, 0.6],
  [0.5, 0.8, 1.1, 1.4],
  [0.9, 1.2, 1.0, 1.4],
  [1.4, 1.1, 0.7, 0.5],
];

export default function Work() {
  return (
    <Slide ghost="WORK">
      <BentoGrid className="grid-cols-1 lg:grid-cols-4">
        {PROJECTS.map((p, i) => (
          <BentoCard
            key={p.num}
            tone={i === 0 ? 'cream' : 'glass'}
            className="min-h-0 md:min-h-[22rem]"
          >
            <span className="absolute top-0 right-0 hidden size-9 place-items-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent md:grid">
              <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.2} />
            </span>
            {/* phone: one readable row (title left, metric right); md+: tall card */}
            <div className="flex items-end justify-between gap-4 md:block md:h-full">
              <div>
                <div className="hidden text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-none tracking-tighter text-muted transition-colors duration-300 group-hover:text-accent md:block">
                  {p.num}
                </div>
                <h3 className="text-title md:mt-3 md:pr-8 text-ink">
                  {/* stretched link: the whole card opens the build, the Code link sits above it */}
                  <a href={p.href} target="_blank" rel="noopener" className="after:absolute after:inset-0 after:content-['']">
                    {p.title}
                  </a>
                </h3>
                {p.code && (
                  <a
                    href={p.code}
                    target="_blank"
                    rel="noopener"
                    className="relative z-10 mt-1.5 inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-[0.68rem] font-bold text-ink transition-colors duration-300 hover:border-accent hover:text-accent md:mt-3"
                  >
                    <Code aria-hidden className="size-3" strokeWidth={2.4} /> Code
                  </a>
                )}
              </div>
              <div className="min-w-0 max-w-[60%] text-right md:mt-auto md:max-w-none md:text-left">
                <Bars heights={SPARKS[i]} hot={p.num === '01' || p.num === '04' ? 0 : 3} className="mb-4 hidden opacity-70 md:flex" />
                <div className="text-[clamp(1.15rem,2.4vw,2rem)] font-extrabold tracking-tight text-accent">
                  {p.metric}
                  <small className="text-label mt-1 block uppercase text-muted">{p.metricLabel}</small>
                </div>
                <ul className="mt-3 hidden flex-wrap gap-1.5 md:flex">
                  {p.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-2.5 py-1 text-[0.68rem] font-bold text-muted">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BentoCard>
        ))}
      </BentoGrid>
    </Slide>
  );
}
