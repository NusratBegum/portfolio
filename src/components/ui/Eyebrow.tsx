import type { ReactNode } from 'react';
import { cx } from './cx';

/* Eyebrow — the label role: short uppercase mono metadata above or beside
   a heading (project kind, section of a card, a stat's source). Always muted;
   never a sentence. */
export function Eyebrow({ as: El = 'p', id, className, children }: {
  as?: 'p' | 'span' | 'h3';
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <El id={id} className={cx('font-mono text-label uppercase text-muted', className)}>
      {children}
    </El>
  );
}
