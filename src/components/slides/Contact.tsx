import type { ComponentType } from 'react';
import { FileDown, PenLine, Phone } from 'lucide-react';
import Slide from './Slide';
import { COLOPHON, CONTACT, CV, LINKS, SOCIAL_LINKS } from '../../data/content';
import { CtaButton } from '../ui/Button';
import { TextLink } from '../ui/Link';

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

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  LinkedIn: LinkedinIcon,
  GitHub: GithubIcon,
  Medium: PenLine,
};

/* The one brand line in the copy ("fly" in accent, display-size so the accent
   only needs 3:1), the email as the primary action, every other channel as a
   secondary button, then the footer and colophon. */
export default function Contact() {
  const { headline, blurb, footer } = CONTACT;
  return (
    /* phones: sits low, clear of the flamingo's sky band */
    <Slide name="Contact" innerClassName="sky-text flex flex-col items-center text-center max-md:mb-0">
      <h3 data-reveal className="text-h1 uppercase text-ink">
        {headline.before} <span className="text-accent">{headline.accent}</span>
        <br />
        {headline.after}
      </h3>
      <p data-reveal className="mt-4 max-w-measure text-body text-ink md:mt-5 md:text-body-lg">
        {blurb}
      </p>
      <div data-reveal className="mt-6 max-w-full md:mt-8">
        <CtaButton cta={{ label: LINKS.emailText, href: LINKS.email }} variant="primary" size="lg" />
      </div>
      <ul data-reveal className="mt-3 flex flex-wrap justify-center gap-2 md:mt-4">
        {SOCIAL_LINKS.map(({ label, href }) => {
          const Icon = ICONS[label];
          return (
            <li key={label}>
              <CtaButton cta={{ label, href }} icon={Icon && <Icon className="size-4" />} />
            </li>
          );
        })}
        <li>
          <CtaButton cta={CV} icon={<FileDown aria-hidden className="size-4" strokeWidth={2} />} />
        </li>
        <li>
          <CtaButton
            cta={{ label: LINKS.phoneText, href: LINKS.phone }}
            icon={<Phone aria-hidden className="size-4" strokeWidth={2} />}
          />
        </li>
      </ul>
      <footer data-reveal className="mt-8 font-mono text-caption text-muted md:mt-12">
        <p>
          {footer.copyright} · {footer.location}
        </p>
        <p className="mt-1">
          {COLOPHON.text} · <TextLink href={COLOPHON.link.href}>{COLOPHON.link.label}</TextLink>
        </p>
      </footer>
    </Slide>
  );
}
