import Slide from './Slide';
import { POSTS } from '../../data/content';
import { CardLink } from '../ui/Card';
import { Eyebrow } from '../ui/Eyebrow';
import { CtaLabel } from '../ui/Link';
import wader from '../../assets/flat/wader.webp';
import curl from '../../assets/flat/curl.webp';

const COVERS = [wader, curl];

/* The peer-reviewed, first-author paper is the feature card; the article is
   default. Covers are small brand marks, kept clear of the text column. */
export default function Writing() {
  return (
    <Slide name="Writing">
      <ul className="grid gap-grid lg:grid-cols-2">
        {POSTS.map((post, i) => {
          /* "№" isn't in the latin font subset: show the digits, mono, as 01 / 02 */
          const num = post.num.replace(/\D/g, '').padStart(2, '0');
          const id = `post-${num}`;
          return (
            <li key={post.num}>
              <CardLink
                href={post.href}
                tone={i === 0 ? 'feature' : 'default'}
                labelledBy={`${id}-title ${id}-cta`}
                describedBy={post.summary ? `${id}-summary` : undefined}
                className="h-full overflow-hidden"
              >
                <img
                  src={COVERS[i]}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute top-3 right-3 h-12 object-contain md:top-4 md:right-4 md:h-20"
                />
                <Eyebrow as="span" className="pr-14 md:pr-24">
                  <span className="mr-2">{num}</span>
                  {post.kind}
                </Eyebrow>
                <h3 id={`${id}-title`} className="mt-2 pr-14 text-body-lg font-medium text-ink md:mt-3 md:pr-24 md:text-h3">
                  {post.title}
                </h3>
                {post.byline && <p className="mt-2 text-body-sm text-muted">{post.byline}</p>}
                {post.summary && (
                  <p id={`${id}-summary`} className="mt-2 max-w-measure text-body-sm text-ink">
                    {post.summary}
                  </p>
                )}
                <CtaLabel id={`${id}-cta`} className="mt-auto pt-4 md:pt-6">
                  {post.cta}
                </CtaLabel>
              </CardLink>
            </li>
          );
        })}
      </ul>
    </Slide>
  );
}
