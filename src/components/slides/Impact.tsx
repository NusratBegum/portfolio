import { GraduationCap, Timer, TrendingUp, Zap } from 'lucide-react';
import Slide from './Slide';
import { BentoCard, BentoGrid, Bars } from '../ui/Bento';
import dancer from '../../assets/flat/dancer.webp';

/** small corner icon — decorative, never load-bearing */
const Corner = ({ Icon, onAccent = false }: { Icon: React.ElementType; onAccent?: boolean }) => (
  <Icon
    aria-hidden
    strokeWidth={2}
    className={`absolute top-0 right-0 hidden size-4.5 md:size-5 lg:block ${onAccent ? 'text-on-accent/90' : 'text-accent/90'}`}
  />
);

const Num = ({ big = false, count, prefix = '', suffix = '', onAccent = false }: {
  big?: boolean; count: number; prefix?: string; suffix?: string; onAccent?: boolean;
}) => (
  <b
    data-count={count}
    data-prefix={prefix}
    data-suffix={suffix}
    className={`block tabular-nums transition-colors duration-300 ${
      onAccent ? 'text-on-accent' : 'text-ink group-hover:text-accent'
    } ${big ? 'text-display' : 'text-stat'}`}
  >
    {prefix}{count}{suffix}
  </b>
);

const Label = ({ children, onAccent = false }: { children: React.ReactNode; onAccent?: boolean }) => (
  <span className={`font-mono text-caption block text-right lg:mt-2 lg:text-left ${onAccent ? 'text-on-accent' : 'text-muted'}`}>
    {children}
  </span>
);

/* phone: stat reads as a row (number left, label right); lg: stacked cell */
const Stat = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 lg:block">{children}</div>
);

export default function Impact() {
  return (
    <Slide ghost="IMPACT" extraClass="js-slide-impact">
      <BentoGrid className="grid-cols-1 lg:grid-cols-4 lg:auto-rows-[10.5rem]">
        {/* the headline — big cream cell with a growth chart behind */}
        <BentoCard
          tone="cream"
          className="lg:col-span-2 lg:row-span-2"
          background={
            <Bars
              heights={[1.2, 1.8, 2.6, 3.4, 4.4]}
              hot={4}
              className="absolute right-5 bottom-5 hidden opacity-70 md:flex"
            />
          }
        >
          <span className="font-mono text-label uppercase text-muted">The headline</span>
          <div className="mt-3 lg:mt-auto">
            <Num big count={90} prefix="−" suffix="%" />
            <p className="text-body md:text-body-lg mt-2 max-w-[30ch] text-muted md:mt-3">
              permutation-test compute in my drift detector, <span className="text-ink">published at IEEE JCSSE 2026</span>.
            </p>
          </div>
        </BentoCard>

        {/* bold accent cell */}
        <BentoCard tone="accent">
          <Corner Icon={Zap} onAccent />
          <Stat>
            <Num count={92} suffix="%" onAccent />
            <Label onAccent>smaller 3D model</Label>
          </Stat>
        </BentoCard>

        <BentoCard>
          <Corner Icon={TrendingUp} />
          <Stat>
            <Num count={13} />
            <Label>real-world streams benchmarked</Label>
          </Stat>
        </BentoCard>

        <BentoCard tone="tint">
          <Corner Icon={Timer} />
          <Stat>
            <Num count={7} />
            <Label>detectors compared</Label>
          </Stat>
        </BentoCard>

        <BentoCard
          background={
            <img
              src={dancer}
              alt=""
              className="absolute -right-1 -bottom-2 h-16 object-contain transition-transform duration-700 group-hover:-rotate-3 md:h-24"
            />
          }
        >
          <Corner Icon={GraduationCap} />
          <p className="text-body my-auto pr-12 font-medium text-ink md:pr-14">
            MSc Computer Science @ Mahidol University (MUICT)
            <span className="text-body-sm mt-1 block text-muted">
              Thesis: Feature Drift Detection via Adversarial Validation
            </span>
          </p>
        </BentoCard>
      </BentoGrid>
    </Slide>
  );
}
