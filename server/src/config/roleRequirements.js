/**
 * SkillForge Role Requirements Configuration
 * Defines target skills and expected proficiency levels (1-5 scale) for each supported career role.
 * 
 * Proficiency Scale:
 * 1 = Beginner
 * 2 = Basic
 * 3 = Intermediate
 * 4 = Advanced
 * 5 = Expert
 */

export const ROLE_REQUIREMENTS = {
  'Frontend Developer': {
    'HTML': 4,
    'CSS': 4,
    'JavaScript': 4,
    'React': 4,
    'TypeScript': 3,
    'Responsive Design': 4,
    'Web Performance': 3,
    'Git': 3
  },
  'Backend Developer': {
    'Node.js': 4,
    'Express.js': 4,
    'MongoDB': 4,
    'PostgreSQL': 3,
    'REST APIs': 4,
    'SQL': 3,
    'Docker': 3,
    'Git': 3
  },
  'Full Stack Developer': {
    'HTML': 4,
    'CSS': 4,
    'JavaScript': 4,
    'React': 4,
    'TypeScript': 3,
    'Node.js': 4,
    'Express.js': 4,
    'MongoDB': 4,
    'REST APIs': 4,
    'Docker': 3,
    'Git': 3
  },
  'Data Analyst': {
    'SQL': 4,
    'Python': 4,
    'Pandas': 4,
    'Excel': 4,
    'Tableau': 3,
    'Power BI': 3,
    'Data Visualization': 4,
    'Statistics': 3
  },
  'Machine Learning Engineer': {
    'Python': 5,
    'Machine Learning': 4,
    'Scikit-Learn': 4,
    'Deep Learning': 4,
    'TensorFlow': 3,
    'PyTorch': 3,
    'SQL': 3,
    'Data Structures & Algorithms': 4,
    'Git': 3
  },
  'DevOps Engineer': {
    'Docker': 4,
    'Kubernetes': 4,
    'CI/CD Pipelines': 4,
    'Linux': 4,
    'Git': 4,
    'Cloud Computing': 3,
    'Python': 3
  },
  'Cloud Engineer': {
    'AWS': 4,
    'Docker': 4,
    'Kubernetes': 3,
    'Terraform': 3,
    'Linux': 4,
    'Networking': 3,
    'Python': 3
  },
  'Data Engineer': {
    'Python': 5,
    'SQL': 5,
    'Apache Spark': 4,
    'Data Pipelines': 4,
    'Docker': 3,
    'Data Warehousing': 4,
    'Git': 3
  },
  'Python Developer': {
    'Python': 5,
    'Django': 4,
    'FastAPI': 4,
    'REST APIs': 4,
    'PostgreSQL': 4,
    'Git': 3,
    'Docker': 3
  },
  'Java Developer': {
    'Java': 5,
    'Spring Boot': 4,
    'REST APIs': 4,
    'SQL': 4,
    'Microservices': 3,
    'Git': 3,
    'Docker': 3
  },
  'Cybersecurity Analyst': {
    'Network Security': 4,
    'Linux': 4,
    'Cryptography': 3,
    'Vulnerability Assessment': 4,
    'Incident Response': 4,
    'Python': 3
  },
  'QA / Test Automation Engineer': {
    'Test Automation': 4,
    'Selenium': 4,
    'Cypress / Playwright': 4,
    'API Testing': 4,
    'JavaScript': 3,
    'Python': 3,
    'CI/CD Pipelines': 3,
    'Git': 3
  },
  'Mobile App Developer': {
    'React Native': 4,
    'Flutter': 4,
    'Mobile UI/UX': 4,
    'REST APIs': 4,
    'JavaScript': 4,
    'TypeScript': 3,
    'Git': 3
  }
};

export const SUPPORTED_ROLES = Object.keys(ROLE_REQUIREMENTS);

export default ROLE_REQUIREMENTS;
