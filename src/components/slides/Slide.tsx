import type { ReactNode } from 'react';

/** Shared slide shell: clean full-viewport panel; the heading is for
    screen readers only — the content speaks for itself. */
export default function Slide({
  ghost, className = '', innerClassName = '', children, extraClass = '',
}: {
  ghost: string;
  className?: string;
  innerClassName?: string;
  extraClass?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`js-slide relative flex h-full w-screen flex-none overflow-hidden px-6 pt-16 pb-16 md:px-16 md:py-20 ${className} ${extraClass}`}
    >
      <h2 className="sr-only">{ghost}</h2>
      <div className={`slide-inner m-auto w-full max-w-7xl ${innerClassName}`}>{children}</div>
    </section>
  );
}
