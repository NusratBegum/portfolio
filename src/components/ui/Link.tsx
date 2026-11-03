import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cx } from './cx';
import { NewTab } from './Button';

/* Link / CTA
   - CtaLabel: the call-to-action line inside a card link (the card is the
     target; this names where it goes). Mono label in accent-ink, arrow nudges
     on card hover. `external` adds the ↗ and the new-tab notice.
   - TextLink: an inline text link inside running text (footer, colophon). */

export function CtaLabel({ id, external = true, className, children }: {
  id?: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <span id={id} className={cx('inline-flex items-center gap-1.5 font-mono text-label uppercase text-accent-ink', className)}>
      {children}
      <Arrow
        aria-hidden
        strokeWidth={2.25}
        className="size-3.5 transition-[translate] duration-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
      {external && <NewTab />}
    </span>
  );
}

export function TextLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      className={cx(
        /* py-2 grows the hit area past 24px without changing the line box */
        'py-2 text-accent-ink underline decoration-1 underline-offset-4 transition-colors hover:text-ink',
        className,
      )}
    >
      {children}
      {external && <NewTab />}
    </a>
  );
}
