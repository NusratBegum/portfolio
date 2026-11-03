import type { ReactNode } from 'react';
import { cx } from './cx';
import { Eyebrow } from './Eyebrow';

/* Stat — a number with its caption and, optionally, where it comes from.
   Sizes map to type roles: display (the one headline number per slide),
   stat (supporting numbers), metric (a project's number inside a card).
   Layout: stack (number above caption) or row-to-stack (number beside the
   caption on phones, stacked from md — saves vertical space in the deck).

   `count` wires the GSAP counter in App.tsx: the real value stays in the
   markup (no-JS, crawlers, screenshots) and in an sr-only copy, while the
   animated digits are aria-hidden so screen readers never hear "0%… 37%…". */

type Size = 'display' | 'stat' | 'metric';

const NUMBER: Record<Size, string> = {
  display: 'text-display',
  stat: 'text-stat',
  metric: 'text-h3 font-bold md:text-h2',
};
const CAPTION: Record<Size, string> = {
  display: 'text-body text-ink md:text-body-lg',
  stat: 'font-mono text-caption text-muted',
  metric: 'font-mono text-caption text-muted',
};

export function Stat({
  value, prefix = '', suffix = '', decimals = 0, caption, source,
  size = 'stat', layout = 'stack', count = false, className,
}: {
  value: number | string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  caption: ReactNode;
  source?: string;
  size?: Size;
  layout?: 'stack' | 'row-to-stack';
  count?: boolean;
  className?: string;
}) {
  const text = `${prefix}${typeof value === 'number' ? value.toFixed(decimals) : value}${suffix}`;
  const row = layout === 'row-to-stack';
  return (
    <div className={cx(row && 'flex items-center gap-4 md:block', className)}>
      <p className={cx(NUMBER[size], 'flex-none tabular-nums text-ink', row && 'min-w-18')}>
        {count ? (
          <>
            <span
              aria-hidden
              data-count={value}
              data-prefix={prefix}
              data-suffix={suffix}
              data-decimals={decimals}
            >
              {text}
            </span>
            <span className="sr-only">{text}</span>
          </>
        ) : (
          text
        )}
      </p>
      <div className={cx(!row && 'mt-2', row && 'md:mt-2')}>
        <p className={CAPTION[size]}>{caption}</p>
        {source && <Eyebrow className="mt-0.5 md:mt-1">{source}</Eyebrow>}
      </div>
    </div>
  );
}
