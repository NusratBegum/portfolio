import Slide from './Slide';
import { IMPACT } from '../../data/content';
import { Card } from '../ui/Card';
import { Eyebrow } from '../ui/Eyebrow';
import { Stat } from '../ui/Stat';

/* Highlights: one feature card (the thesis result — the slide's headline
   number), one card of supporting numbers with their sources, one card for
   the degree. lg: feature on the left, the other two stacked on the right. */
export default function Impact() {
  const { headline, stats, education } = IMPACT;
  return (
    <Slide name="Highlights" className="js-slide-impact">
      <div className="grid gap-grid lg:grid-cols-2">
        <Card tone="feature" className="lg:row-span-2 lg:justify-between">
          <Eyebrow>{IMPACT.eyebrow}</Eyebrow>
          <div className="mt-1 md:mt-6">
            <Stat
              count
              size="display"
              layout="row-to-stack"
              value={headline.value}
              prefix={headline.prefix}
              suffix={headline.suffix}
              caption={headline.label}
            />
            <p className="mt-2 font-mono text-caption text-muted md:mt-3">{headline.context}</p>
          </div>
        </Card>

        <Card>
          <ul className="grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
            {stats.map((s) => (
              <li key={s.label} className="py-1.5 first:pt-0 last:pb-0 md:px-4 md:py-0 md:first:pl-0 md:last:pr-0">
                <Stat
                  count
                  layout="row-to-stack"
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  caption={s.label}
                  source={s.source}
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="text-body font-medium text-ink md:text-h3">{education.degree}</h3>
          <p className="text-body-sm text-ink">{education.school}</p>
          <p className="text-body-sm text-muted md:mt-2">{education.detail}</p>
          <p className="font-mono text-caption text-muted md:mt-2">{education.timing}</p>
        </Card>
      </div>
    </Slide>
  );
}
