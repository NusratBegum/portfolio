import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from './cx';

/* Card — the one content container. Two tones:
   - default: glass over the sky; every card unless there's a reason
   - feature: denser, warm-tinted, accent hairline; marks the single most
     important item on a slide (at most one per slide)
   Padding (p-card), radius (rounded-card) and the GSAP `data-reveal` hook are
   built in, so slides only decide layout. */

export type CardTone = 'default' | 'feature';

const surface = (tone: CardTone) => (tone === 'feature' ? 'glass-feature' : 'glass');
const base = 'group relative flex flex-col rounded-card p-card';

type CardProps = { tone?: CardTone; className?: string; children: ReactNode } & Omit<
  ComponentPropsWithoutRef<'div'>,
  'className' | 'children'
>;

export function Card({ tone = 'default', className, children, ...rest }: CardProps) {
  return (
    <div data-reveal className={cx(base, surface(tone), className)} {...rest}>
      {children}
    </div>
  );
}

type CardLinkProps = {
  href: string;
  tone?: CardTone;
  /** ids whose text names the link (title + call to action) */
  labelledBy: string;
  /** id of the summary, read after the name */
  describedBy?: string;
  className?: string;
  children: ReactNode;
};

/** A card that is one link: the whole surface is the target, and the
    accessible name stays short (title + CTA) instead of the whole card text. */
export function CardLink({ href, tone = 'default', labelledBy, describedBy, className, children }: CardLinkProps) {
  return (
    <a
      data-reveal
      href={href}
      target="_blank"
      rel="noopener"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={cx(base, surface(tone), 'card-link', className)}
    >
      {children}
    </a>
  );
}
