import { Code } from 'lucide-react';
import Slide from './Slide';
import { PROJECTS, type Project } from '../../data/content';
import { Card } from '../ui/Card';
import { NewTab } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { CtaLabel } from '../ui/Link';
import { Stat } from '../ui/Stat';
import { Tag, TagList } from '../ui/Tag';
import { cx } from '../ui/cx';

/* Secondary link to the source. It sits above the card's stretched link
   (relative z-1), names its project for screen readers, and keeps a ~30px hit
   area with py-2. */
function CodeLink({ p, className }: { p: Project; className?: string }) {
  if (!p.code) return null;
  return (
    <a
      href={p.code}
      target="_blank"
      rel="noopener"
      className={cx(
        'relative z-1 items-center gap-1 py-2 font-mono text-label uppercase text-accent-ink transition-colors hover:text-ink',
        className,
      )}
    >
      <Code aria-hidden className="size-3.5" strokeWidth={2.25} />
      Code<span className="sr-only"> for {p.title} on GitHub</span>
      <NewTab />
    </a>
  );
}

/* A project card reads top to bottom: kind (+ live status) → title →
   one-line summary → metric with its caption → stack → where the link goes.
   The title is a stretched link (.card-stretch), so the whole card opens the
   build while the Code link stays its own target. Phones keep kind, title,
   metric and Code (summary, stack and CTA from md); the summary is still the
   link's description for screen readers. */
function ProjectCard({ p }: { p: Project }) {
  const id = `project-${p.num}`;
  return (
    <Card className="card-link h-full">
      <div className="flex items-center justify-between gap-2">
        <Eyebrow as="span">{p.kind}</Eyebrow>
        <div className="flex items-center gap-3">
          {p.live && <Tag as="span" variant="live">Live</Tag>}
          <CodeLink p={p} className="inline-flex md:hidden" />
        </div>
      </div>
      <h3 className="mt-1 font-mono text-body font-medium text-ink md:mt-3 md:text-h3">
        <a
          id={`${id}-title`}
          href={p.href}
          target="_blank"
          rel="noopener"
          aria-labelledby={`${id}-title ${id}-cta`}
          aria-describedby={`${id}-summary`}
          className="card-stretch"
        >
          {p.title}
        </a>
      </h3>
      <p id={`${id}-summary`} className="mt-2 hidden text-body-sm text-muted md:block">
        {p.summary}
      </p>
      <Stat
        size="metric"
        layout="row-to-stack"
        value={p.metric}
        caption={p.metricLabel}
        className="mt-1 md:mt-auto md:pt-6"
      />
      <TagList className="mt-4 hidden md:flex">
        {p.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </TagList>
      <div className="mt-3 hidden items-center justify-between gap-3 md:flex">
        <CtaLabel id={`${id}-cta`} external={p.live || /^https?:/.test(p.href)}>{p.cta}</CtaLabel>
        <CodeLink p={p} className="inline-flex" />
      </div>
    </Card>
  );
}

export default function Work() {
  return (
    <Slide name="Work">
      {/* 1 column on phones, 2×2 on landscape phones and tablets, a row of 4
          from 1024px (2×2 there would be taller than a 768px-high screen) */}
      <ul className="grid gap-grid sm:grid-cols-2 lg:grid-cols-4">
        {PROJECTS.map((p) => (
          <li key={p.num}>
            <ProjectCard p={p} />
          </li>
        ))}
      </ul>
    </Slide>
  );
}
