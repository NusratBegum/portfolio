import Slide from './Slide';
import { BentoCard, BentoGrid } from '../ui/Bento';
import { POSTS } from '../../data/content';
import wader from '../../assets/flat/wader.webp';
import curl from '../../assets/flat/curl.webp';

const COVERS = [wader, curl];
const TONES = ['cream', 'glass'] as const;

export default function Writing() {
  return (
    <Slide ghost="WRITING">
      <BentoGrid className="grid-cols-1 lg:grid-cols-2">
        {POSTS.map((post, i) => (
          <BentoCard
            key={post.num}
            href={post.href}
            cta={post.cta}
            tone={TONES[i]}
            className="min-h-0 md:min-h-[22rem]"
            background={
              <img
                src={COVERS[i]}
                alt=""
                className="absolute top-2 right-2 h-12 object-contain opacity-60 transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:rotate-2 md:-top-1 md:right-1 md:h-44 md:opacity-95"
              />
            }
          >
            <span
              aria-hidden
              className="hidden text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-tighter text-muted transition-colors duration-300 group-hover:text-accent md:block"
            >
              {post.num}
            </span>
            <span className="text-label uppercase text-muted md:mt-auto">{post.kind}</span>
            <h3 className="text-title pr-14 text-ink md:pr-0">{post.title}</h3>
          </BentoCard>
        ))}
      </BentoGrid>
    </Slide>
  );
}
