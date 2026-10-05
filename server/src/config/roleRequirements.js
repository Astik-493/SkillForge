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
    'Git': 3
  },
  'Backend Developer': {
    'Node.js': 4,
    'Express.js': 4,
    'MongoDB': 4,
    'REST APIs': 4,
    'SQL': 3,
    'Git': 3
  },
  'Full Stack Developer': {
    'HTML': 4,
    'CSS': 4,
    'JavaScript': 4,
    'React': 4,
    'Node.js': 4,
    'Express.js': 4,
    'MongoDB': 4,
    'REST APIs': 4,
    'Git': 3
  },
  'Data Analyst': {
    'SQL': 4,
    'Python': 4,
    'Excel': 4,
    'Tableau': 3,
    'Data Visualization': 4,
    'Statistics': 3
  },
  'Machine Learning Engineer': {
    'Python': 5,
    'Machine Learning': 4,
    'Deep Learning': 4,
    'TensorFlow': 3,
    'SQL': 3,
    'Data Structures & Algorithms': 4,
    'Git': 3
  }
};

export const SUPPORTED_ROLES = Object.keys(ROLE_REQUIREMENTS);

export default ROLE_REQUIREMENTS;
