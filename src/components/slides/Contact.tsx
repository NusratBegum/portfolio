import { PenLine } from 'lucide-react';
import Slide from './Slide';
import { LINKS } from '../../data/content';

/* brand marks — lucide dropped brand icons, so these two ship inline */
const LinkedinIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);
const GithubIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.91c.58.11.79-.25.79-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.2.67.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
  </svg>
);

const SOCIALS = [
  { label: 'LinkedIn', href: LINKS.linkedin, Icon: LinkedinIcon },
  { label: 'GitHub', href: LINKS.github, Icon: GithubIcon },
  { label: 'Medium', href: LINKS.medium, Icon: PenLine },
];

export default function Contact() {
  return (
    <Slide ghost="SAY HI" innerClassName="text-center">
      <h2 data-reveal className="text-display uppercase text-ink">
        Let's <span className="text-accent">fly</span>
        <br />
        together
      </h2>
      <a
        data-reveal
        href={LINKS.email}
        className="btn btn-ink mt-8 mb-5 h-12 max-w-full px-6 text-[clamp(0.9rem,2.4vw,1.4rem)] font-bold tracking-tight md:h-14 md:px-8"
      >
        <span className="truncate">{LINKS.emailText}</span>
      </a>
      <div data-reveal className="flex flex-wrap justify-center gap-2.5">
        {SOCIALS.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener" className="btn btn-glass btn-sm">
            <Icon className="size-4" aria-hidden />
            {label}
          </a>
        ))}
      </div>
      <div data-reveal className="text-body mt-10 flex flex-wrap justify-center gap-x-7 gap-y-1 text-muted">
        <span>© 2026 Nusrat Begum</span>
        <a href={LINKS.phone} className="transition-colors hover:text-accent">{LINKS.phoneText}</a>
        <span>Bangkok, Thailand</span>
      </div>
    </Slide>
  );
}
