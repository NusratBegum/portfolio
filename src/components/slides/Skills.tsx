import Slide from './Slide';
import { SKILL_FLOCKS, SKILLS_COPY, CERTS, CLOUD_LEARNING } from '../../data/content';
import { Card } from '../ui/Card';
import { Eyebrow } from '../ui/Eyebrow';
import { Tag, TagList } from '../ui/Tag';

/* Three skill flocks + credentials. Backend is the feature card: it is the
   role this portfolio is applying for. Core skills lead each list as `lead`
   tags; the rest are ordered by relevance (content.ts). */
export default function Skills() {
  return (
    <Slide name="Skills">
      <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-3">
        {/* phones: the three flocks share one card (.card-stack) so the slide
            fits 390×664 without shrinking type; md+: three cards */}
        <div className="card-stack md:contents">
          {SKILL_FLOCKS.map((flock, i) => (
            <Card key={flock.title} tone={i === 0 ? 'feature' : 'default'} className={i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}>
              <h3 className="text-body font-medium text-ink md:text-h3">{flock.title}</h3>
              {/* the sub-line summarises the tags below; phones skip it for room */}
              <Eyebrow className="mt-1 hidden md:block">{flock.sub}</Eyebrow>
              <TagList className="mt-2 md:mt-4">
                {flock.lead.map((t) => (
                  <Tag key={t} variant="lead">{t}</Tag>
                ))}
                {flock.chips.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </TagList>
            </Card>
          ))}
        </div>

        <div className="card-stack md:contents">
          {/* what she is learning now, kept apart from the stack she ships
              with; the label flows inline with its tags */}
          <Card className="md:col-span-2 lg:col-span-3">
            <div className="flex flex-wrap items-center gap-1 md:gap-1.5">
              <Eyebrow as="h3" className="mr-1.5">{SKILLS_COPY.cloudLabel}</Eyebrow>
              <ul className="contents">
                {CLOUD_LEARNING.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <Eyebrow as="h3">{SKILLS_COPY.credentialsLabel}</Eyebrow>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 md:mt-2 md:gap-x-6">
              {CERTS.map((c) => (
                <li key={c} className="flex items-baseline gap-2 text-body-sm text-ink">
                  <span aria-hidden className="size-1 flex-none -translate-y-0.5 rounded-pill bg-accent" />
                  {c}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </Slide>
  );
}
