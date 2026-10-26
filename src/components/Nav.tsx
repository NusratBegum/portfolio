import { Moon, Sun } from 'lucide-react';
import type { Theme } from '../App';
import { LINKS } from '../data/content';
import logoUrl from '../assets/flamingo-logo.svg';

export default function Nav({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  return (
    <nav className="pointer-events-none fixed top-4 left-1/2 z-50 flex w-[min(1280px,calc(100%-1.6rem))] -translate-x-1/2 items-center justify-between">
      <a href="#" className="btn btn-glass btn-md pointer-events-auto gap-2 px-4 text-sm font-bold tracking-tight">
        <img src={logoUrl} alt="" aria-hidden className="w-6" />
        Nusrat Begum
      </a>
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="btn btn-glass btn-icon"
        >
          {theme === 'dark' ? <Sun className="size-4.5" strokeWidth={2} /> : <Moon className="size-4.5" strokeWidth={2} />}
        </button>
        <a href={LINKS.email} className="btn btn-accent btn-md">
          Hire me
        </a>
      </div>
    </nav>
  );
}
