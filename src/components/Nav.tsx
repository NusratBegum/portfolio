import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../App';
import { NAV } from '../data/content';
import { Button, CtaButton, buttonClass } from './ui/Button';
import { useDeck } from './deck';
import logoUrl from '../assets/flamingo-logo.svg';

/* Site header: brand (flies home), theme toggle, the one persistent action.
   Spans the same column as the slides (gutter + max-w-7xl). */
export default function Nav({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const goTo = useDeck();
  return (
    <header className="pointer-events-none fixed inset-x-gutter top-4 z-chrome mx-auto flex max-w-7xl items-center justify-between">
      <a
        href="#intro"
        onClick={(e) => {
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          goTo('Intro');
        }}
        className={buttonClass({ variant: 'secondary' }, 'pointer-events-auto px-4')}
      >
        <img src={logoUrl} alt="" aria-hidden className="w-6" />
        {NAV.brand}
      </a>
      <div className="pointer-events-auto flex items-center gap-2">
        <Button
          size="icon"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? NAV.themeToggle.toLight : NAV.themeToggle.toDark}
        >
          {theme === 'dark' ? <Sun className="size-4.5" strokeWidth={2} /> : <Moon className="size-4.5" strokeWidth={2} />}
        </Button>
        <CtaButton cta={NAV.cta} variant="primary" />
      </div>
    </header>
  );
}
