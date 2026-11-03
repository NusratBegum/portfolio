import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cx } from './cx';
import { useDeck } from '../deck';
import type { Cta } from '../../data/content';

/* Button — `.btn` recipes live in global.css (@layer components, so a
   utility on the element wins). Variants: primary = accent fill, the main
   action of a view (one per view, plus the nav CTA); secondary = chrome
   glass, everything else. Sizes: md (44px), lg (48/56px), icon (44px square). */

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'md' | 'lg' | 'icon';

export const buttonClass = (
  { variant = 'secondary', size = 'md' }: { variant?: ButtonVariant; size?: ButtonSize } = {},
  className?: string,
) => cx('btn', `btn-${variant}`, size !== 'md' && `btn-${size}`, className);

export function Button({
  variant, size, className, type = 'button', ...rest
}: { variant?: ButtonVariant; size?: ButtonSize } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClass({ variant, size }, className)} {...rest} />;
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Text a screen reader appends to links that open a new tab. */
export const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

/** A call to action as a button-styled link. In-deck targets (`cta.slide`)
    fly the deck there via the rail's goTo; `href` stays the no-JS /
    modified-click fallback. External links open in a new tab and say so. */
export function CtaButton({
  cta, variant, size, className, icon,
}: {
  cta: Cta;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: ReactNode;
}) {
  const goTo = useDeck();
  const external = !cta.slide && isExternal(cta.href);
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!cta.slide || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    goTo(cta.slide);
  };
  return (
    <a
      href={cta.href}
      onClick={cta.slide ? onClick : undefined}
      download={cta.download || undefined}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      className={buttonClass({ variant, size }, className)}
    >
      {icon}
      {cta.label}
      {/* ↗ marks a new tab; a brand icon already says where you're going */}
      {external && !icon && <ArrowUpRight aria-hidden className="size-4" strokeWidth={2} />}
      {external && <NewTab />}
    </a>
  );
}
