import type { ReactNode } from 'react';
import { cx } from './cx';

/* Tag — one recipe for tech names, plus a status form.
   - default: hairline pill, mono label size, case kept (tech names are
     proper nouns); every tech tag, Skills and Work alike
   - lead:    accent-filled pill; a flock's core skills, listed first
   - live:    no pill — accent dot + uppercase label; a deployed project.
     Status, not a technology, so it deliberately doesn't look like a tag. */

export type TagVariant = 'default' | 'lead' | 'live';

const PILL = 'rounded-pill border px-2 py-0.5 tracking-normal md:px-2.5 md:py-1';
const VARIANTS: Record<TagVariant, string> = {
  default: cx(PILL, 'border-line text-ink'),
  lead: cx(PILL, 'border-accent bg-accent text-on-accent'),
  live: 'uppercase text-ink',
};

export function Tag({ variant = 'default', as: El = 'li', children }: {
  variant?: TagVariant;
  as?: 'li' | 'span';
  children: ReactNode;
}) {
  return (
    <El className={cx('inline-flex flex-none items-center gap-1.5 font-mono text-label leading-tight', VARIANTS[variant])}>
      {variant === 'live' && <span aria-hidden className="size-1.5 rounded-pill bg-accent" />}
      {children}
    </El>
  );
}

export function TagList({ className, children }: { className?: string; children: ReactNode }) {
  return <ul className={cx('flex flex-wrap gap-1 md:gap-1.5', className)}>{children}</ul>;
}
