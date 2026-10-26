import { ArrowUpRight } from 'lucide-react';
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
            href={p.href}
            cta="View build"
            tone={i === 0 ? 'cream' : 'glass'}
            className="min-h-0 md:min-h-[22rem]"
          >
            <span className="absolute top-0 right-0 hidden size-9 place-items-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent md:grid">
              <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.2} />
            </span>
            {/* phone: one readable row (title left, metric right); md+: tall card */}
            <div className="flex items-end justify-between gap-4 md:block md:h-full">
              <div>
                <div className="font-mono text-label hidden text-muted transition-colors duration-300 group-hover:text-accent md:block">
                  {p.num}
                </div>
                <h3 className="font-mono text-body font-medium md:mt-3 md:pr-8 md:text-h3 text-ink">{p.title}</h3>
              </div>
              <div className="flex-none text-right md:mt-auto md:text-left">
                <Bars heights={SPARKS[i]} hot={p.num === '01' || p.num === '04' ? 0 : 3} className="mb-4 hidden opacity-70 md:flex" />
                <div className="text-h3 font-bold tabular-nums text-accent md:text-h2">
                  {p.metric}
                  <small className="font-mono text-caption mt-1 block max-w-[18ch] text-muted md:max-w-none">{p.metricLabel}</small>
                </div>
                <ul className="mt-3 hidden flex-wrap gap-1.5 md:flex">
                  {p.tags.map((t) => (
                    <li key={t} className="font-mono text-label leading-tight tracking-normal rounded-full border border-line px-2.5 py-1 text-muted">
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
