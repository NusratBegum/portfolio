import { Braces, Database, Sparkles } from 'lucide-react';
import Slide from './Slide';
import { BentoCard, BentoGrid } from '../ui/Bento';
import { SKILL_FLOCKS, CERTS } from '../../data/content';

const ICONS = [Braces, Sparkles, Database];

const Chips = ({ lead, chips }: { lead: string[]; chips: string[] }) => (
  <ul className="mt-1.5 flex flex-wrap gap-1 md:mt-4 md:gap-2">
    {lead.map((c) => (
      <li key={c} className="font-mono text-label leading-tight tracking-normal rounded-full bg-accent px-2 py-[2px] text-on-accent shadow-md md:px-3.5 md:py-1.5">
        {c}
      </li>
    ))}
    {chips.map((c) => (
      <li
        key={c}
        className="font-mono text-label leading-tight tracking-normal rounded-full border border-line bg-surface px-2 py-[2px] text-ink transition-transform duration-300 hover:-translate-y-0.5 md:px-3.5 md:py-1.5"
      >
        {c}
      </li>
    ))}
  </ul>
);

const Head = ({ Icon, title, sub }: { Icon: React.ElementType; title: string; sub: string }) => (
  <div className="flex items-start gap-3 md:gap-4">
    <span
      aria-hidden
      className="grid size-8 flex-none place-items-center rounded-xl bg-accent text-on-accent shadow-md transition-transform duration-500 group-hover:-rotate-6 md:size-11 md:rounded-2xl"
    >
      <Icon className="size-4.5 md:size-5.5" strokeWidth={2.2} />
    </span>
    <h3 className="text-h3 text-ink">
      {title}
      <small className="font-mono text-label mt-0.5 hidden uppercase text-muted md:mt-1 md:block">{sub}</small>
    </h3>
  </div>
);

export default function Skills() {
  const [fs, ai, data] = SKILL_FLOCKS;
  return (
    <Slide ghost="SKILLS">
      <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <BentoCard tone="cream" className="md:col-span-2 lg:col-span-1 lg:min-h-[16.7rem]">
          <Head Icon={ICONS[0]} title={fs.title} sub={fs.sub} />
          <Chips lead={fs.lead} chips={fs.chips} />
        </BentoCard>

        <BentoCard className="lg:min-h-[16.7rem]">
          <Head Icon={ICONS[1]} title={ai.title} sub={ai.sub} />
          <Chips lead={ai.lead} chips={ai.chips} />
        </BentoCard>

        <BentoCard tone="tint" className="lg:min-h-[16.7rem]">
          <Head Icon={ICONS[2]} title={data.title} sub={data.sub} />
          <Chips lead={data.lead} chips={data.chips} />
        </BentoCard>

        {/* credentials — the bold strip */}
        <BentoCard tone="accent" className="md:col-span-2 lg:col-span-3 max-md:!px-3 max-md:!py-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 md:gap-x-3 md:gap-y-2">
            <span className="font-mono text-label uppercase text-on-accent">Credentials</span>
            {CERTS.map((c) => (
              <span key={c} className="text-body-sm leading-snug font-medium text-on-accent">
                <span aria-hidden className="mx-1 opacity-60 md:mx-1.5">✦</span>
                {c}
              </span>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    </Slide>
  );
}
