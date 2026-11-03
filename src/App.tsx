import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journey, REDUCED } from './store/journey';
import { SECTIONS, SLIDES, type SlideName } from './data/content';
import { DeckContext } from './components/deck';
const Sky = lazy(() => import('./three/Sky'));
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Rail from './components/Rail';
import Hero from './components/slides/Hero';
import Impact from './components/slides/Impact';
import Skills from './components/slides/Skills';
import Work from './components/slides/Work';
import Writing from './components/slides/Writing';
import Contact from './components/slides/Contact';

gsap.registerPlugin(ScrollTrigger);
/* our WebGL loop drives frames; don't let gsap postpone tweens on frame jank */
gsap.ticker.lagSmoothing(0);

export type Theme = 'light' | 'dark';

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );
  const [active, setActive] = useState(0);
  /** slide index the deck was last sent to by goTo (-1: none yet) */
  const flyingTo = useRef(-1);
  /** when that flight started (ms, performance.now) */
  const flightAt = useRef(0);
  const [skyReady, setSkyReady] = useState(false);
  useLayoutEffect(() => {
    const id = window.setTimeout(() => setSkyReady(true), 250);
    return () => window.clearTimeout(id);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const track = self.selector!('.js-track')[0] as HTMLElement;
      const slides = self.selector!('.js-slide') as HTMLElement[];
      const len = () => track.scrollWidth - window.innerWidth;

      const scrollTween = gsap.to(track, {
        x: () => -len(),
        ease: 'none',
        scrollTrigger: {
          id: 'stage',
          trigger: '.js-stage',
          start: 'top top',
          end: () => '+=' + len(),
          scrub: REDUCED ? true : 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            journey.p = st.progress;
            let idx = 0;
            slides.forEach((s, i) => {
              if (st.progress >= (len() ? Math.min(s.offsetLeft / len(), 1) : 0) - 0.04) idx = i;
            });
            setActive(idx);
          },
        },
      });

      /* slide content rises in as it flies into view — the blur focus-pull is
         desktop-only: on touch scrubbing it can freeze mid-blur and it costs
         paint time on phones. Reduced motion: content is simply there. */
      const focusPull = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
      if (!REDUCED) slides.forEach((slide, i) => {
        const bits = Array.from(slide.querySelectorAll('[data-reveal]'));
        if (bits.length && i > 0) {
          bits.forEach((el, j) => {
            gsap.from(el, {
              y: 54,
              opacity: 0,
              ...(focusPull ? { filter: 'blur(10px)' } : {}),
              delay: j * 0.07,
              duration: 0.9,
              ease: 'power3.out',
              overwrite: 'auto',
              scrollTrigger: {
                trigger: slide,
                containerAnimation: scrollTween,
                start: 'left 72%',
                toggleActions: 'play none none reverse',
              },
            });
          });
        }
      });

      /* animated counters: the real value is in the markup (crawlers, no-JS,
         screenshots, reduced motion) and in an sr-only copy (ui/Stat.tsx);
         count up from 0 once, when the slide comes into view */
      if (!REDUCED) (self.selector!('[data-count]') as HTMLElement[]).forEach((el) => {
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals ?? 0);
        const pre = el.dataset.prefix ?? '';
        const suf = el.dataset.suffix ?? '';
        ScrollTrigger.create({
          trigger: '.js-slide-impact', containerAnimation: scrollTween,
          start: 'left 60%', once: true,
          onEnter: () => {
            const n = { v: 0 };
            gsap.to(n, {
              v: target, duration: 1.6, ease: 'power2.out', snap: { v: 1 / 10 ** decimals },
              onUpdate: () => { el.textContent = pre + n.v.toFixed(decimals) + suf; },
            });
          },
        });
      });

      /* hero load choreography (skipped under reduced motion) */
      if (!REDUCED) {
        gsap.from('[data-hero-row]', {
          yPercent: 110, duration: 0.9, stagger: 0.1, ease: 'power4.out', delay: 0.05,
        });
        gsap.from('[data-hero-fade]', {
          opacity: 0, y: 26, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.45,
        });
      }
    }, root);

    const onMove = (e: PointerEvent) => {
      journey.px = (e.clientX / window.innerWidth) * 2 - 1;
      journey.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => { ctx.revert(); window.removeEventListener('pointermove', onMove); };
  }, []);

  /* fly the deck to slide i (rail, CTAs, keyboard focus, #hash). With
     `focus`, focus moves to that section (preventScroll: the browser must not
     scroll the overflow-hidden track itself), so Tab continues from there. */
  const goTo = useCallback((i: number, { focus = false } = {}) => {
    const st = ScrollTrigger.getById('stage');
    const el = root.current;
    if (!st || !el || i < 0) return;
    const track = el.querySelector('.js-track') as HTMLElement;
    const slide = el.querySelectorAll<HTMLElement>('.js-slide')[i];
    const len = track.scrollWidth - window.innerWidth;
    const p = len ? Math.min(slide.offsetLeft / len, 1) : 0;
    flyingTo.current = i;
    flightAt.current = performance.now();
    window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: REDUCED ? 'auto' : 'smooth' });
    if (focus) slide.focus({ preventScroll: true });
  }, []);
  const goToSlide = useCallback((name: SlideName) => goTo(SLIDES.indexOf(name), { focus: true }), [goTo]);

  /* keyboard + deep links: Tab into an off-screen slide flies the deck there
     (and undoes the browser's own scroll-into-view of the pinned track);
     /#work on load opens on that slide */
  useEffect(() => {
    const main = root.current!.querySelector('main')!;
    const slides = Array.from(main.querySelectorAll<HTMLElement>('.js-slide'));
    const unscroll = () => {
      if (main.scrollLeft || main.scrollTop) { main.scrollLeft = 0; main.scrollTop = 0; }
    };
    const onFocus = (e: FocusEvent) => {
      unscroll();
      const i = slides.findIndex((s) => s.contains(e.target as Node));
      if (i < 0) return;
      /* fly there whenever the slide is off screen. The flight guard only
         covers a flight that just started (goTo focusing its own target):
         after one, the user may have scrolled away, and Tab would otherwise
         land on a link they can't see */
      const r = slides[i].getBoundingClientRect();
      const inFlight = i === flyingTo.current && performance.now() - flightAt.current < 1500;
      if (Math.abs(r.left) > r.width / 2 && !inFlight) goTo(i);
    };
    /* the pin spacer that gives the deck its scroll height can land a few
       ms after the trigger exists. Under reduced motion goTo jumps instantly,
       and a jump made before then is clamped to 0 (a smooth scroll outlives
       the gap), so wait, frame by frame, until the page is tall enough */
    let raf = 0;
    let frames = 0;
    const fromHash = () => {
      cancelAnimationFrame(raf);
      const i = SLIDES.findIndex((s) => `#${SECTIONS[s].id}` === window.location.hash);
      if (i <= 0) return;
      const st = ScrollTrigger.getById('stage');
      const room = document.documentElement.scrollHeight - window.innerHeight;
      if ((!st || room < st.end - 1) && frames++ < 60) {
        raf = requestAnimationFrame(fromHash);
        return;
      }
      goTo(i);
    };
    main.addEventListener('focusin', onFocus);
    main.addEventListener('scroll', unscroll);
    const id = window.setTimeout(fromHash, 0);
    window.addEventListener('load', fromHash);
    return () => {
      main.removeEventListener('focusin', onFocus);
      main.removeEventListener('scroll', unscroll);
      window.clearTimeout(id);
      window.removeEventListener('load', fromHash);
      cancelAnimationFrame(raf);
    };
  }, [goTo]);

  return (
    <div ref={root}>
      {skyReady && (
        <Suspense fallback={null}>
          <Sky theme={theme} />
        </Suspense>
      )}
      <Cursor />
      <DeckContext.Provider value={goToSlide}>
        <Nav theme={theme} onToggleTheme={toggleTheme} />
        <main className="js-stage relative z-content h-svh overflow-hidden">
          <div className="js-track flex h-full w-max will-change-transform">
            <Hero />
            <Impact />
            <Skills />
            <Work />
            <Writing />
            <Contact />
          </div>
        </main>
      </DeckContext.Provider>
      <Rail stops={[...SLIDES]} active={active} onGo={(i) => goTo(i, { focus: true })} />
    </div>
  );
}
