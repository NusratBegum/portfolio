import type { ReactNode } from 'react';
import { SECTIONS, type SlideName } from '../../data/content';
import { cx } from '../ui/cx';

/** Shared slide shell: one full-viewport panel per section. The section is a
    named region with a real id (SECTIONS); its heading is for screen readers
    only, since the content speaks for itself on screen. The Intro has a
    visible h1 (the name), so it is labelled instead of given a second heading.
    tabIndex -1 lets in-deck navigation move focus here after flying over.

    Layout: section (one viewport, clips) > .slide-scroll (padding clears the
    fixed chrome: nav 16 + 44px on top, rail below) > .slide-inner (centered
    with margin:auto). Every layout is sized to fit 390×664 and up without
    scrolling; on anything smaller or shorter (320–360px phones, landscape
    phones, 200%+ zoom) the column scrolls instead of being cut off. The
    padding sits inside the scroller, so focus rings and shadows aren't
    clipped at its edges. */
export default function Slide({
  name, className, innerClassName, children,
}: {
  name: SlideName;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  const { id, heading } = SECTIONS[name];
  const visibleHeading = name === 'Intro';
  return (
    <section
      id={id}
      tabIndex={-1}
      {...(visibleHeading ? { 'aria-label': heading } : { 'aria-labelledby': `${id}-heading` })}
      className={cx('js-slide relative h-full w-screen flex-none overflow-hidden', className)}
    >
      {!visibleHeading && (
        <h2 id={`${id}-heading`} className="sr-only">
          {heading}
        </h2>
      )}
      <div className="slide-scroll flex h-full overflow-y-auto px-gutter pt-18 pb-14 md:py-20">
        <div className={cx('slide-inner m-auto w-full max-w-7xl', innerClassName)}>{children}</div>
      </div>
    </section>
  );
}
