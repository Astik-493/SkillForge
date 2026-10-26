/**
 * Curated Catalog of Technical Skills by Domain
 * Used by the Searchable Skill Library in Milestone 18.
 */

export const SKILL_CATEGORIES = [
  {
    id: 'languages',
    name: 'Programming Languages',
    icon: '💻',
    skills: [
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'C++',
      'C#',
      'Go',
      'Rust',
      'Ruby',
      'PHP',
      'Swift',
      'Kotlin',
      'SQL',
      'HTML',
      'CSS'
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend & Mobile Development',
    icon: '🎨',
    skills: [
      'React',
      'React Native',
      'Flutter',
      'Mobile UI/UX',
      'Vue.js',
      'Angular',
      'Next.js',
      'Svelte',
      'Tailwind CSS',
      'Bootstrap',
      'Redux',
      'Vite',
      'Webpack',
      'Web Performance',
      'Responsive Design',
      'Accessibility (a11y)'
    ]
  },
  {
    id: 'backend',
    name: 'Backend Development',
    icon: '⚙️',
    skills: [
      'Node.js',
      'Express.js',
      'Django',
      'FastAPI',
      'Spring Boot',
      'Flask',
      'ASP.NET Core',
      'Ruby on Rails',
      'REST APIs',
      'GraphQL',
      'Microservices',
      'gRPC'
    ]
  },
  {
    id: 'databases',
    name: 'Databases',
    icon: '🗄️',
    skills: [
      'MongoDB',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'SQLite',
      'Oracle',
      'Firebase Firestore',
      'Elasticsearch',
      'DynamoDB',
      'Cassandra'
    ]
  },
  {
    id: 'analytics',
    name: 'Data Analytics and Visualization',
    icon: '📊',
    skills: [
      'Excel',
      'Tableau',
      'Power BI',
      'Pandas',
      'NumPy',
      'Data Visualization',
      'Statistics',
      'Matplotlib',
      'Seaborn',
      'BigQuery'
    ]
  },
  {
    id: 'ml_ai',
    name: 'Machine Learning and AI',
    icon: '🤖',
    skills: [
      'Machine Learning',
      'Deep Learning',
      'TensorFlow',
      'PyTorch',
      'Scikit-Learn',
      'Computer Vision',
      'Natural Language Processing',
      'Large Language Models (LLMs)',
      'Keras'
    ]
  },
  {
    id: 'devops_cloud',
    name: 'Cloud and DevOps',
    icon: '☁️',
    skills: [
      'Docker',
      'Kubernetes',
      'CI/CD Pipelines',
      'Linux',
      'Cloud Computing',
      'AWS',
      'Google Cloud Platform (GCP)',
      'Microsoft Azure',
      'Terraform',
      'Networking',
      'Nginx',
      'Ansible'
    ]
  },
  {
    id: 'tools',
    name: 'Developer Tools & QA Automation',
    icon: '🛠️',
    skills: [
      'Git',
      'GitHub',
      'GitLab',
      'VS Code',
      'Postman',
      'Test Automation',
      'Selenium',
      'Cypress / Playwright',
      'API Testing',
      'JIRA',
      'npm',
      'Bash / Shell Scripting',
      'Docker Desktop'
    ]
  },
  {
    id: 'cs_fundamentals',
    name: 'Computer Science Fundamentals',
    icon: '🧠',
    skills: [
      'Data Structures & Algorithms',
      'System Design',
      'Operating Systems',
      'Computer Networks',
      'Object-Oriented Programming (OOP)',
      'Database Management Systems (DBMS)',
      'Software Testing & QA',
      'Network Security',
      'Cryptography',
      'Vulnerability Assessment',
      'Incident Response',
      'Apache Spark',
      'Data Pipelines',
      'Data Warehousing'
    ]
  }
];

// Flat deduplicated list of all catalog skills
export const ALL_CATALOG_SKILLS = Array.from(
  new Set(SKILL_CATEGORIES.flatMap((c) => c.skills))
).sort();

export default SKILL_CATEGORIES;
