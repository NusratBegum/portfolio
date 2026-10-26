/* All site copy and structured data. Facts only: every number, date and link
   here is backed by the projects, paper and README. Voice: plain and specific,
   first person; the flamingo/flight theme gets two light touches at most
   (the hero scroll hint and the contact headline). */

/* ── links ─────────────────────────────────────────────────────────────── */

export const LINKS = {
  email: 'mailto:rupunzelnusrat5@gmail.com',
  emailText: 'rupunzelnusrat5@gmail.com',
  linkedin: 'https://linkedin.com/in/nusrat-begum',
  github: 'https://github.com/NusratBegum',
  medium: 'https://medium.com/@rupunzelnusrat5',
  phone: 'tel:+66802240539',
  phoneText: '+66 80 224 0539',
  paper: 'https://ieeexplore.ieee.org/document/11596765',
  siteSource: 'https://github.com/NusratBegum/Portfolio-New',
};

/* ── deck structure ────────────────────────────────────────────────────── */

/* Rail labels, in slide order. 'Work' stays (scripts/motion-check.mjs clicks it). */
export const SLIDES = ['Intro', 'Highlights', 'Skills', 'Work', 'Writing', 'Contact'] as const;
export type SlideName = (typeof SLIDES)[number];

/** Per-slide id (anchor / no-JS fallback) and heading. Replaces the
    sr-only `ghost` words ("PORTFOLIO", "SAY HI") with real section names. */
export const SECTIONS: Record<SlideName, { id: string; heading: string }> = {
  Intro: { id: 'intro', heading: 'Introduction' },
  Highlights: { id: 'highlights', heading: 'Highlights' },
  Skills: { id: 'skills', heading: 'Skills' },
  Work: { id: 'work', heading: 'Work' },
  Writing: { id: 'writing', heading: 'Writing' },
  Contact: { id: 'contact', heading: 'Contact' },
};

/** A call to action. `slide` marks an in-deck target: wire it to the rail's
    goTo(SLIDES.indexOf(slide)); `href` is the no-JS fallback. */
export type Cta = { label: string; href: string; slide?: SlideName };

/* ── nav + rail ────────────────────────────────────────────────────────── */

export const NAV = {
  brand: 'Nusrat Begum',
  cta: { label: 'Email me', href: LINKS.email } satisfies Cta,
  themeToggle: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
};

export const RAIL = {
  ariaLabel: 'Sections',
};

/* ── 1 · intro ─────────────────────────────────────────────────────────── */

export const HERO = {
  name: 'Nusrat Begum',
  nameLines: ['Nusrat', 'Begum'],
  roles: ['Python backend', 'Full-stack', 'ML research'],
  /** one sentence, ≤ 25 words: what she builds + the single best proof */
  summary:
    "I build Python APIs and React front ends, and I'm first author of an IEEE JCSSE 2026 paper on drift detection.",
  /** level + timing */
  status: 'M.Sc. Computer Science, Mahidol University (MUICT) · final defense December 2026',
  /** what she's looking for + where */
  availability: 'Open to software, backend & full-stack internships · Bangkok',
  primaryCta: { label: 'See my work', href: '#work', slide: 'Work' } satisfies Cta,
  secondaryCta: { label: 'Read the paper', href: LINKS.paper } satisfies Cta,
  scrollHint: 'Scroll to fly',
};

/* ── 2 · highlights (Impact.tsx) ───────────────────────────────────────── */

/** Numeric `value` drives the GSAP counter (data-count). The counter in
    App.tsx snaps to integers; set `decimals` only after it formats them. */
export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  /** which project the number comes from */
  source?: string;
};

export const IMPACT: {
  eyebrow: string;
  headline: Stat & { context: string };
  stats: Stat[];
  education: { degree: string; school: string; detail: string; timing: string };
} = {
  eyebrow: 'Thesis result',
  headline: {
    value: 90,
    suffix: '%',
    label: 'less permutation-test compute in my drift detector',
    context: "Master's thesis · first-author paper, IEEE JCSSE 2026",
  },
  stats: [
    { value: 13, label: 'real-world data streams benchmarked', source: 'Thesis' },
    { value: 7, label: 'drift detectors compared', source: 'Thesis' },
    { value: 570, label: 'days of PM2.5 data auto-collected', source: 'Air quality tracker' },
  ],
  education: {
    degree: 'M.Sc. Computer Science',
    school: 'Faculty of ICT, Mahidol University (MUICT)',
    detail: 'Thesis: Feature Drift Detection via Adversarial Validation',
    timing: 'Final defense December 2026',
  },
};

/* ── 3 · skills ────────────────────────────────────────────────────────── */

/* Skills.tsx destructures these as [backend, frontend, data] — keep 3, in order.
   `lead` = core skills (highlighted); `chips` ordered by relevance to a
   backend / full-stack role. */
export const SKILL_FLOCKS = [
  {
    glyph: '</>',
    title: 'Backend',
    sub: 'APIs, auth, testing, CI',
    lead: ['Python', 'FastAPI'],
    chips: ['REST APIs', 'Pydantic', 'SQLAlchemy', 'OAuth2 / JWT', 'pytest', 'Docker', 'GitHub Actions', 'Git', 'Linux', 'uv'],
  },
  {
    glyph: '✦',
    title: 'Frontend',
    sub: 'Typed, tested web UIs',
    lead: ['React', 'TypeScript'],
    chips: ['Vite', 'Tailwind CSS', 'Playwright', 'Three.js', 'GSAP'],
  },
  {
    glyph: '▚',
    title: 'Data & ML',
    sub: 'Databases, analysis, models',
    lead: ['PostgreSQL', 'SQL'],
    chips: ['MongoDB', 'pandas', 'scikit-learn', 'LightGBM', 'SHAP'],
  },
];

export const SKILLS_COPY = {
  credentialsLabel: 'Credentials',
};

export const CERTS = [
  'First-author paper, IEEE JCSSE 2026',
  'MongoDB Schema Design',
  'Ethical Hacker',
  'Hult Prize 2021 · Bangkok Regional',
];

/* ── 4 · work ──────────────────────────────────────────────────────────── */

export type Project = {
  num: string;
  title: string;
  /** short category label, e.g. "Master's thesis" */
  kind: string;
  /** one plain sentence, ≤ 20 words: what it is / does */
  summary: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  href: string;
  /** card call to action — names where the link goes */
  cta: string;
  /** true when `href` is a deployed site/API, false for source code */
  live: boolean;
};

/* Order for a backend / full-stack screen: the fullest backend stack first
   (auth + database + containers), then a live model-serving API with a
   measured result, then the thesis (already the headline on Highlights and
   Writing), then the long-running data pipeline. */
export const PROJECTS: Project[] = [
  {
    num: '01',
    title: 'Smart Calculator API',
    kind: 'REST API',
    summary: 'Calculator REST API with JWT authentication and a PostgreSQL database, containerized with Docker Compose.',
    metric: '3',
    metricLabel: 'Docker Compose services',
    tags: ['FastAPI', 'PostgreSQL', 'JWT', 'Docker'],
    href: 'https://smart-calculator-api.vercel.app',
    cta: 'Open live API',
    live: true,
  },
  {
    num: '02',
    title: 'Diabetes Risk API',
    kind: 'ML model API',
    summary: 'API that returns a diabetes risk prediction from a trained scikit-learn model, with Pydantic-validated input.',
    metric: '0.83',
    metricLabel: 'ROC AUC on held-out data',
    tags: ['FastAPI', 'Pydantic', 'scikit-learn', 'GitHub Actions'],
    href: 'https://nusrat-diabetes-api.vercel.app',
    cta: 'Open live API',
    live: true,
  },
  {
    num: '03',
    title: 'EADD Drift Detector',
    kind: "Master's thesis",
    summary: "Unsupervised detector that flags drift in a model's input features using adversarial validation, for MLOps monitoring.",
    metric: '13',
    metricLabel: 'real-world streams benchmarked',
    tags: ['Python', 'pytest', 'LightGBM', 'SHAP'],
    href: 'https://github.com/NusratBegum/unsupervised-concept-drift-detection',
    cta: 'View code on GitHub',
    live: false,
  },
  {
    num: '04',
    title: 'Bangkok Air Quality Tracker',
    kind: 'Data pipeline',
    summary: "Python pipeline, scheduled on GitHub Actions, that collects Bangkok's PM2.5 data every day for a public tracker.",
    metric: '570',
    metricLabel: 'days of data auto-collected',
    tags: ['Python', 'GitHub Actions', 'REST APIs', 'pandas'],
    href: 'https://bangkok-air-quality.vercel.app',
    cta: 'Open live tracker',
    live: true,
  },
];

/* ── 5 · writing ───────────────────────────────────────────────────────── */

export type Post = {
  num: string;
  kind: string;
  title: string;
  /** author line — shows first authorship at a glance */
  byline?: string;
  summary?: string;
  href: string;
  cta: string;
};

export const POSTS: Post[] = [
  {
    num: '№1',
    kind: 'Paper · IEEE JCSSE 2026',
    title: 'Enhanced Adversarial Drift Detection for MLOps Feature Monitoring',
    byline: 'N. Begum (first author), P. Yamchote, C. Amornbunchornvej, T. Noraset',
    summary: 'Detects feature drift with adversarial validation, using 90% less permutation-test compute.',
    href: LINKS.paper,
    cta: 'Read on IEEE Xplore',
  },
  {
    num: '№2',
    kind: 'Article · Medium',
    title: 'Before You Touch a Neural Network, Master These 3 Classifiers',
    href: LINKS.medium,
    cta: 'Read on Medium',
  },
];

/* ── 6 · contact + footer ──────────────────────────────────────────────── */

export const CONTACT = {
  /** rendered as: before <accent>accent</accent><br/>after — the one brand touch */
  headline: { before: "Let's", accent: 'fly', after: 'together' },
  /** plain-text version for aria-label / meta */
  headlineText: "Let's fly together",
  blurb: 'Hiring a Python backend or full-stack intern? Email me, or reach me on LinkedIn.',
  footer: {
    copyright: '© 2026 Nusrat Begum',
    location: 'Bangkok, Thailand',
  },
};

/** Contact.tsx keeps the icons; labels + targets live here. */
export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: LINKS.linkedin },
  { label: 'GitHub', href: LINKS.github },
  { label: 'Medium', href: LINKS.medium },
];

export const COLOPHON = {
  text: 'Built with React, TypeScript and Three.js · Set in Inter and JetBrains Mono',
  link: { label: 'Source on GitHub', href: LINKS.siteSource },
};
