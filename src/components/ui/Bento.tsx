import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

/* Bento primitives — adapted from Magic UI's BentoGrid / BentoCard
   (magicui.design/docs/components/bento-grid) to this design system:
   token-driven tones instead of hardcoded colors, whole-card link targets,
   GSAP `data-reveal` hooks, and a slide-up CTA on hover (always visible on
   touch screens, revealed on hover at lg+ like the original). */

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(' ');

const TONES = {
  glass: 'glass',
  cream: 'cell-cream',
  tint: 'cell-tint',
  accent: 'cell-accent',
} as const;
export type Tone = keyof typeof TONES;

export function BentoGrid({ className = '', children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cx('grid w-full gap-2.5 md:gap-4', className)} {...props}>
      {children}
    </div>
  );
}

type CardProps = {
  tone?: Tone;
  className?: string;
  background?: ReactNode;
  cta?: string;
  href?: string;
  children: ReactNode;
};

export function BentoCard({ tone = 'glass', className = '', background, cta, href, children }: CardProps) {
  const Tag = (href ? 'a' : 'div') as 'a';
  return (
    <Tag
      data-reveal
      {...(href ? { href, target: '_blank', rel: 'noopener' } : {})}
      className={cx(
        'group relative flex flex-col overflow-hidden rounded-2xl p-4 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/50 md:rounded-3xl md:p-6',
        TONES[tone],
        className,
      )}
    >
      {background && <div aria-hidden className="pointer-events-none absolute inset-0">{background}</div>}
      <div className="relative flex h-full min-h-0 flex-col">{children}</div>
      {cta && (
        <span
          className={cx(
            'font-mono text-label relative mt-3 inline-flex items-center gap-1.5 uppercase transition-all duration-300',
            tone === 'accent' ? 'text-on-accent' : 'text-accent-strong',
            'lg:absolute lg:right-5 lg:bottom-5 lg:mt-0 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100',
          )}
        >
          {cta} <ArrowRight aria-hidden className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </span>
      )}
    </Tag>
  );
}

/** mini bar chart — the embedded visual a bento cell carries */
export function Bars({ heights, hot = -1, onAccent = false, className = '' }: {
  heights: number[]; hot?: number; onAccent?: boolean; className?: string;
}) {
  return (
    <div aria-hidden className={cx('flex items-end gap-1.5', className)}>
      {heights.map((h, i) => (
        <span
          key={i}
          style={{ height: `${h}rem` }}
          className={cx(
            'w-2.5 origin-bottom rounded-full transition-transform duration-500 group-hover:scale-y-110 md:w-3',
            onAccent
              ? i === hot ? 'bg-on-accent' : 'bg-on-accent/35'
              : i === hot ? 'bg-accent' : 'bg-accent/25',
          )}
        />
      ))}
    </div>
  );
}
