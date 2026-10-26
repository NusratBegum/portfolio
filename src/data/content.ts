export const LINKS = {
  email: 'mailto:rupunzelnusrat5@gmail.com',
  emailText: 'rupunzelnusrat5@gmail.com',
  linkedin: 'https://linkedin.com/in/nusrat-begum',
  github: 'https://github.com/NusratBegum',
  medium: 'https://medium.com/@rupunzelnusrat5',
  phone: 'tel:+66802240539',
  phoneText: '+66 80 224 0539',
};

export const SLIDES = ['Intro', 'Impact', 'Skills', 'Work', 'Writing', 'Contact'] as const;

export const SKILL_FLOCKS = [
  {
    glyph: '</>',
    title: 'Backend',
    sub: 'Python APIs',
    lead: ['Python', 'FastAPI'],
    chips: ['Pydantic', 'SQLAlchemy', 'REST APIs', 'OAuth2 / JWT', 'pytest', 'Docker', 'uv'],
  },
  {
    glyph: '✦',
    title: 'Frontend',
    sub: 'Interfaces that move',
    lead: ['React', 'TypeScript'],
    chips: ['Vite', 'Tailwind CSS', 'Three.js', 'GSAP', 'Playwright'],
  },
  {
    glyph: '▚',
    title: 'Data & ML',
    sub: 'Storage to models',
    lead: ['PostgreSQL', 'SQL'],
    chips: ['MongoDB', 'pandas', 'scikit-learn', 'LightGBM', 'SHAP', 'Git', 'Linux'],
  },
];

export const PROJECTS = [
  {
    num: '01',
    title: 'EADD Drift Detector',
    metric: '13',
    metricLabel: 'real-world streams benchmarked',
    tags: ['Python', 'LightGBM', 'SHAP', 'pytest'],
    href: 'https://github.com/NusratBegum/unsupervised-concept-drift-detection',
  },
  {
    num: '02',
    title: 'Smart Calculator API',
    metric: '3',
    metricLabel: 'Docker services',
    tags: ['FastAPI', 'PostgreSQL', 'JWT', 'Docker'],
    href: 'https://smart-calculator-api.vercel.app',
  },
  {
    num: '03',
    title: 'Diabetes Risk API',
    metric: '0.83',
    metricLabel: 'held-out ROC AUC',
    tags: ['FastAPI', 'scikit-learn', 'Pydantic', 'GitHub Actions'],
    href: 'https://nusrat-diabetes-api.vercel.app',
  },
  {
    num: '04',
    title: 'Bangkok Air Quality Tracker',
    metric: '570',
    metricLabel: 'days auto-collected',
    tags: ['Python', 'GitHub Actions', 'pandas', 'REST APIs'],
    href: 'https://bangkok-air-quality.vercel.app',
  },
];

export const CERTS = [
  'IEEE JCSSE 2026 paper (first author)',
  'MongoDB Schema Design',
  'Ethical Hacker',
  'Hult Prize 2021 · Bangkok Regional',
];

export const POSTS = [
  {
    num: '№1',
    kind: 'IEEE · JCSSE 2026',
    title: 'Enhanced Adversarial Drift Detection for MLOps Feature Monitoring',
    href: 'https://ieeexplore.ieee.org/document/11596765',
    cta: 'Read on IEEE Xplore',
  },
  {
    num: '№2',
    kind: 'Medium',
    title: 'Before You Touch a Neural Network, Master These 3 Classifiers',
    href: 'https://medium.com/@rupunzelnusrat5',
    cta: 'Read on Medium',
  },
];
