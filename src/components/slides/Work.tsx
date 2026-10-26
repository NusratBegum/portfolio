import Slide from './Slide';
import { PROJECTS, type Project } from '../../data/content';
import { CardLink } from '../ui/Card';
import { Eyebrow } from '../ui/Eyebrow';
import { CtaLabel } from '../ui/Link';
import { Stat } from '../ui/Stat';
import { Tag, TagList } from '../ui/Tag';

/* A project card reads top to bottom: kind (+ live status) → title →
   one-line summary → metric with its caption → stack → where the link goes.
   Phones keep kind, title and metric (summary, stack and CTA from md);
   the summary is still the link's description for screen readers. */
function ProjectCard({ p }: { p: Project }) {
  const id = `project-${p.num}`;
  return (
    <CardLink
      href={p.href}
      labelledBy={`${id}-title ${id}-cta`}
      describedBy={`${id}-summary`}
      className="h-full"
    >
      <div className="flex items-center justify-between gap-2">
        <Eyebrow as="span">{p.kind}</Eyebrow>
        {p.live && <Tag as="span" variant="live">Live</Tag>}
      </div>
      <h3 id={`${id}-title`} className="mt-1 font-mono text-body font-medium text-ink md:mt-3 md:text-h3">
        {p.title}
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
      <div className="mt-5 hidden md:block">
        <CtaLabel id={`${id}-cta`}>{p.cta}</CtaLabel>
      </div>
    </CardLink>
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
