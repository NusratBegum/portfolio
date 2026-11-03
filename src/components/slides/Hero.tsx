import Slide from './Slide';
import { HERO } from '../../data/content';
import { CtaButton } from '../ui/Button';
import { cx } from '../ui/cx';

/* Reading order = scan order: availability → name → roles → one-line summary
   → actions → level and timing. The column stays left on desktop (the
   flamingo's clear zone is to the right) and below the sky band on phones. */
export default function Hero() {
  return (
    /* phones: the flamingo flies in the top sky band, so the copy sits low */
    <Slide name="Intro" innerClassName="max-md:mb-0">
      <div className="sky-text max-w-2xl">
        <p data-hero-fade className="flex items-center gap-2 font-mono text-caption text-muted">
          <span aria-hidden className="size-2 flex-none rounded-pill bg-accent" />
          {HERO.availability}
        </p>

        <h1 className="mt-3 text-display uppercase md:mt-4">
          {HERO.nameLines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span data-hero-row className={cx('block', i > 0 && 'text-muted')}>
                {line}
              </span>
              {i < HERO.nameLines.length - 1 && ' '}
            </span>
          ))}
        </h1>

        <p data-hero-fade className="mt-3 text-body font-medium text-muted md:mt-4 md:text-body-lg">
          {HERO.roles.map((role, i) => (
            <span key={role}>
              {i > 0 && (
                <>
                  <span className="sr-only">, </span>
                  <span aria-hidden className="px-2">·</span>
                </>
              )}
              {role}
            </span>
          ))}
        </p>

        <p data-hero-fade className="mt-4 max-w-measure text-body text-ink md:text-body-lg">
          {HERO.summary}
        </p>

        <div data-hero-fade className="mt-6 flex flex-wrap gap-3">
          <CtaButton cta={HERO.primaryCta} variant="primary" />
          <CtaButton cta={HERO.secondaryCta} variant="secondary" />
        </div>

        <p data-hero-fade className="mt-5 font-mono text-caption text-muted">
          {HERO.status}
        </p>
      </div>

      <div
        data-hero-fade
        aria-hidden
        className="absolute right-[max(var(--gutter),calc(50%-40rem))] bottom-24 hidden items-center gap-3 font-mono text-label uppercase text-muted md:flex"
      >
        {HERO.scrollHint}
        <span className="relative h-px w-16 bg-line">
          <i className="absolute -top-0.5 left-0 size-1.5 animate-lane rounded-pill bg-accent" />
        </span>
      </div>
    </Slide>
  );
}
