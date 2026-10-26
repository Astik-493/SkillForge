import { apiFetch } from './api';

export const SUPPORTED_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Data Engineer',
  'Python Developer',
  'Java Developer',
  'Cybersecurity Analyst',
  'QA / Test Automation Engineer',
  'Mobile App Developer'
];

export const ROLE_METADATA = {
  'Frontend Developer': {
    category: 'Web & UI Engineering',
    description: 'Design and build responsive, accessible web interfaces and single-page applications.',
    coreSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Responsive Design', 'Web Performance', 'Git']
  },
  'Backend Developer': {
    category: 'System & API Engineering',
    description: 'Architect scalable web services, RESTful APIs, business logic, and databases.',
    coreSkills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'REST APIs', 'SQL', 'Docker', 'Git']
  },
  'Full Stack Developer': {
    category: 'End-to-End Engineering',
    description: 'Bridge client interfaces and backend architectures into complete production products.',
    coreSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'REST APIs', 'Docker']
  },
  'Data Analyst': {
    category: 'Analytics & Insights',
    description: 'Extract business insights, query analytical databases, and build executive dashboards.',
    coreSkills: ['SQL', 'Python', 'Pandas', 'Excel', 'Tableau', 'Power BI', 'Data Visualization', 'Statistics']
  },
  'Machine Learning Engineer': {
    category: 'AI & Data Science',
    description: 'Develop and train statistical models, neural networks, and scalable ML inference pipelines.',
    coreSkills: ['Python', 'Machine Learning', 'Scikit-Learn', 'Deep Learning', 'TensorFlow', 'PyTorch', 'DSA']
  },
  'DevOps Engineer': {
    category: 'Infrastructure & Automation',
    description: 'Automate build, test, and release lifecycles using containers and continuous delivery.',
    coreSkills: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux', 'Git', 'Cloud Computing', 'Python']
  },
  'Cloud Engineer': {
    category: 'Cloud Architecture',
    description: 'Design, provision, and maintain reliable cloud infrastructure, VPC networks, and IaC.',
    coreSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Networking', 'Python']
  },
  'Data Engineer': {
    category: 'Big Data Architecture',
    description: 'Construct resilient batch and stream ETL data pipelines, lakehouses, and warehouses.',
    coreSkills: ['Python', 'SQL', 'Apache Spark', 'Data Pipelines', 'Data Warehousing', 'Docker', 'Git']
  },
  'Python Developer': {
    category: 'Backend & Services',
    description: 'Build robust web backends, automation scripts, and REST services in Python frameworks.',
    coreSkills: ['Python', 'Django', 'FastAPI', 'REST APIs', 'PostgreSQL', 'Git', 'Docker']
  },
  'Java Developer': {
    category: 'Enterprise Engineering',
    description: 'Develop robust, high-throughput enterprise systems and microservices in Spring Boot.',
    coreSkills: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'Microservices', 'Git', 'Docker']
  },
  'Cybersecurity Analyst': {
    category: 'Security & Defense',
    description: 'Protect network perimeters, audit vulnerabilities, encrypt assets, and respond to threats.',
    coreSkills: ['Network Security', 'Linux', 'Cryptography', 'Vulnerability Assessment', 'Incident Response', 'Python']
  },
  'QA / Test Automation Engineer': {
    category: 'Quality & Test Engineering',
    description: 'Build robust end-to-end automation frameworks, integration tests, and CI/CD quality gates.',
    coreSkills: ['Test Automation', 'Selenium', 'Cypress / Playwright', 'API Testing', 'JavaScript', 'Python', 'Git']
  },
  'Mobile App Developer': {
    category: 'Mobile Applications',
    description: 'Engineer responsive cross-platform native iOS & Android applications with fluid gestures.',
    coreSkills: ['React Native', 'Flutter', 'Mobile UI/UX', 'REST APIs', 'JavaScript', 'TypeScript', 'Git']
  }
};

/**
 * Fetch the authenticated user's career goal.
 * Connects to GET /api/career-goal.
 * Returns null if no career goal is set yet (404).
 *
 * @returns {Promise<{ targetRole: string } | null>}
 */
export async function fetchCareerGoal() {
  try {
    const result = await apiFetch('/career-goal');
    return result?.careerGoal || null;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Save or update the authenticated user's target career goal.
 * Connects to PUT /api/career-goal.
 *
 * @param {string} targetRole
 * @returns {Promise<{ message: string, careerGoal: { targetRole: string } }>}
 */
export async function saveCareerGoal(targetRole) {
  return apiFetch('/career-goal', {
    method: 'PUT',
    body: JSON.stringify({ targetRole })
  });
}
