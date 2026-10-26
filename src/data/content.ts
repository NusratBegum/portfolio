export const LINKS = {
  email: 'mailto:rupunzelnusrat5@gmail.com',
  emailText: 'rupunzelnusrat5@gmail.com',
  linkedin: 'https://linkedin.com/in/nusrat-begum',
  github: 'https://github.com/NusratBegum',
  medium: 'https://medium.com/@rupunzelnusrat5',
  cv: '/Nusrat-Begum-CV.pdf',
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
    chips: ['Pydantic', 'SQLAlchemy', 'REST APIs', 'OAuth2 / JWT', 'pytest', 'Docker', 'GitHub Actions'],
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

export const CLOUD_LEARNING = ['Kubernetes', 'AWS', 'GCP', 'Redis', 'Microservices'];

export type Project = {
  num: string;
  title: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  /** live demo, or the paper when there is no demo */
  href: string;
  code?: string;
};

export const PROJECTS: Project[] = [
  {
    num: '01',
    title: 'Smart Calculator API',
    metric: '20',
    metricLabel: 'automated API tests in CI',
    tags: ['FastAPI', 'PostgreSQL', 'JWT', 'Docker'],
    href: 'https://smart-calculator-api.vercel.app',
    code: 'https://github.com/NusratBegum/smart-calculator',
  },
  {
    num: '02',
    title: 'Diabetes Risk API',
    metric: '0.83',
    metricLabel: 'held-out ROC AUC',
    tags: ['FastAPI', 'scikit-learn', 'Pydantic', 'GitHub Actions'],
    href: 'https://nusrat-diabetes-api.vercel.app',
    code: 'https://github.com/NusratBegum/Diabetes-Prediction',
  },
  {
    num: '03',
    title: 'Bangkok Air Quality Tracker',
    metric: '570',
    metricLabel: 'days auto-collected',
    tags: ['Python', 'GitHub Actions', 'Chart.js', 'REST APIs'],
    href: 'https://bangkok-air-quality.vercel.app',
    code: 'https://github.com/NusratBegum/Data-Science-Final-Project',
  },
  {
    num: '04',
    title: 'EADD Drift Detector',
    metric: '4/4',
    metricLabel: 'drift types caught, 0 false alarms',
    tags: ['Python', 'LightGBM', 'SHAP', 'pytest'],
    href: 'https://ieeexplore.ieee.org/document/11596765',
  },
];

export const CERTS = [
  'IEEE JCSSE 2026 paper (first author)',
  'Microsoft Azure Fundamentals (AZ-900)',
  'Google Data Analytics Certificate',
  'Hult Prize 2021 · Campus Winner',
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
    href: 'https://medium.com/@rupunzelnusrat5/before-you-touch-a-neural-network-master-these-3-classifiers-817ec9ef8883',
    cta: 'Read on Medium',
  },
];
