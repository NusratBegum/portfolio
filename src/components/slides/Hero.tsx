import Slide from './Slide';

export default function Hero() {
  return (
    <Slide ghost="PORTFOLIO">
      <h1 className="text-display my-4 uppercase">
        <span className="block overflow-hidden"><span data-hero-row className="block">Nusrat</span></span>
        <span className="block overflow-hidden"><span data-hero-row className="block text-muted">Begum</span></span>
      </h1>
      <p data-hero-fade className="text-body md:text-body-lg flex flex-wrap items-center gap-3 font-medium text-muted">
        Python Backend <i className="not-italic text-accent">✦</i> Full-Stack
        <i className="not-italic text-accent">✦</i> <span className="text-ink">ML Research</span>
      </p>
      <div
        data-hero-fade
        className="font-mono text-label absolute right-6 bottom-24 flex items-center gap-3 uppercase text-muted md:right-16"
        aria-hidden
      >
        Scroll to fly
        <span className="relative h-px w-16 bg-line">
          <i className="absolute -top-[2px] left-0 size-1.5 animate-[lane_2s_ease-out_infinite] rounded-full bg-accent" />
        </span>
      </div>
      <style>{'@keyframes lane{0%{transform:translateX(0);opacity:0}25%{opacity:1}100%{transform:translateX(58px);opacity:0}}'}</style>
    </Slide>
  );
}
