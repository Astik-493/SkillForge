/**
 * SkillForge Learning Resources Configuration
 * Maps supported skills to curated learning topics, reliable documentation URLs, and practical project ideas.
 */

export const LEARNING_RESOURCES = {
  'HTML': {
    learningTopic: 'Semantic HTML5, Document Structure, Forms, and Accessibility (a11y)',
    resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
    projectIdea: 'Build an accessible personal portfolio with semantic markup, form validations, and ARIA landmarks.'
  },
  'CSS': {
    learningTopic: 'Modern CSS Layouts: Flexbox, CSS Grid, Responsive Design, and CSS Variables',
    resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/CSS',
    projectIdea: 'Design a responsive SaaS landing page with dark/light themes, flexible grid layouts, and animated interactions.'
  },
  'JavaScript': {
    learningTopic: 'Modern ES6+ JavaScript, Asynchronous Programming (Promises & async/await), and DOM Manipulation',
    resourceUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    projectIdea: 'Create an interactive task and habit tracking dashboard with client-side state, search, and localStorage persistence.'
  },
  'React': {
    learningTopic: 'React Component Lifecycle, Hooks (useState, useEffect, useMemo), and State Architecture',
    resourceUrl: 'https://react.dev/learn',
    projectIdea: 'Build an e-commerce product catalog with category filtering, shopping cart state management, and toast notifications.'
  },
  'TypeScript': {
    learningTopic: 'Type Annotations, Interfaces, Generics, Union Types, and TypeScript with Modern Frameworks',
    resourceUrl: 'https://www.typescriptlang.org/docs/',
    projectIdea: 'Refactor an untyped JavaScript utility library into strictly typed TypeScript with custom generic interfaces.'
  },
  'Git': {
    learningTopic: 'Version Control Workflows, Branching Strategies, Merge Conflict Resolution, and Pull Requests',
    resourceUrl: 'https://git-scm.com/doc',
    projectIdea: 'Simulate a team release workflow on GitHub featuring feature branches, pull request reviews, and semantic version tagging.'
  },
  'Node.js': {
    learningTopic: 'Node.js Runtime Architecture, Event Loop, File System (fs), Streams, and Core Modules',
    resourceUrl: 'https://nodejs.org/docs/latest/api/',
    projectIdea: 'Develop a CLI log-analyzer tool that streams large server log files, extracts metrics, and generates formatted reports.'
  },
  'Express.js': {
    learningTopic: 'Express Middleware Pipeline, RESTful Routing, Centralized Error Handling, and Security Practices',
    resourceUrl: 'https://expressjs.com/',
    projectIdea: 'Build a production-grade REST API backend with modular routes, JWT authentication middleware, rate limiting, and input validation.'
  },
  'MongoDB': {
    learningTopic: 'NoSQL Schema Design, Mongoose ODM, Aggregation Pipelines, and Performance Indexing',
    resourceUrl: 'https://www.mongodb.com/docs/manual/',
    projectIdea: 'Architect a database for an online learning management system featuring student enrollments, course reviews, and aggregated analytics.'
  },
  'REST APIs': {
    learningTopic: 'REST Principles, HTTP Methods, Status Codes, Resource URI Design, and Payload Validation',
    resourceUrl: 'https://restfulapi.net/',
    projectIdea: 'Construct a structured RESTful API for an inventory management platform complete with pagination, sorting, and error schemas.'
  },
  'SQL': {
    learningTopic: 'Relational Database Schema Design, Multi-Table JOINs, Subqueries, Indexing, and ACID Transactions',
    resourceUrl: 'https://dev.mysql.com/doc/',
    projectIdea: 'Design a relational database schema for an order fulfillment platform with complex reporting queries and transaction safety.'
  },
  'Python': {
    learningTopic: 'Python Core Syntax, Data Structures, Object-Oriented Programming, and Virtual Environments',
    resourceUrl: 'https://docs.python.org/3/tutorial/',
    projectIdea: 'Build an automated data extraction and cleaning script that parses diverse JSON/CSV files and exports validated datasets.'
  },
  'Excel': {
    learningTopic: 'Advanced Formulas (XLOOKUP, INDEX/MATCH), Pivot Tables, Data Modeling, and What-If Analysis',
    resourceUrl: 'https://support.microsoft.com/en-us/excel',
    projectIdea: 'Develop a dynamic financial dashboard in Excel using Pivot Tables, slicers, and conditional formatting to analyze business performance.'
  },
  'Tableau': {
    learningTopic: 'Visual Analytics, Calculated Fields, Parameters, Table Calculations, and Interactive Dashboards',
    resourceUrl: 'https://help.tableau.com/current/guides/get-started-tutorial/en-us/get-started-tutorial-home.htm',
    projectIdea: 'Create an executive sales performance dashboard with interactive region drill-downs, trend lines, and KPI cards.'
  },
  'Data Visualization': {
    learningTopic: 'Data Storytelling, Visual Perception, Color Theory, and Exploratory Charting with Matplotlib/Seaborn',
    resourceUrl: 'https://seaborn.pydata.org/tutorial.html',
    projectIdea: 'Publish an exploratory data analysis (EDA) report with multivariate statistical plots highlighting real-world socioeconomic trends.'
  },
  'Statistics': {
    learningTopic: 'Descriptive Statistics, Probability Distributions, Hypothesis Testing (t-test, ANOVA), and Confidence Intervals',
    resourceUrl: 'https://openstax.org/details/books/introductory-statistics',
    projectIdea: 'Perform a statistical A/B test evaluation on simulated web product conversion metrics including p-value calculations and power analysis.'
  },
  'Machine Learning': {
    learningTopic: 'Supervised & Unsupervised Learning, Feature Engineering, Cross-Validation, and Scikit-Learn',
    resourceUrl: 'https://scikit-learn.org/stable/user_guide.html',
    projectIdea: 'Train and evaluate multiple machine learning classifiers to predict customer churn, fine-tuning hyperparameters with GridSearchCV.'
  },
  'Deep Learning': {
    learningTopic: 'Neural Network Architectures, Loss Optimization, Backpropagation, and Convolutional Networks (CNNs)',
    resourceUrl: 'https://www.deeplearningbook.org/',
    projectIdea: 'Build and train a deep convolutional neural network for image classification, incorporating dropout regularization and data augmentation.'
  },
  'TensorFlow': {
    learningTopic: 'TensorFlow 2.x & Keras Functional APIs, Model Training Callbacks, TensorBoard, and Model Persistence',
    resourceUrl: 'https://www.tensorflow.org/tutorials',
    projectIdea: 'Train an end-to-end sentiment classification model using TensorFlow/Keras and monitor training metrics with TensorBoard.'
  },
  'Data Structures & Algorithms': {
    learningTopic: 'Arrays, Trees, Graphs, Hash Tables, Sorting, Dynamic Programming, and Big-O Time/Space Complexity',
    resourceUrl: 'https://en.wikipedia.org/wiki/Introduction_to_Algorithms',
    projectIdea: 'Implement a comprehensive algorithmic library covering graph traversal (BFS/DFS), shortest path (Dijkstra), and dynamic programming.'
  }
};

/**
 * Helper to retrieve learning resource configuration for a given skill with case-insensitive matching.
 * Provides a fallback for unsupported or custom skill entries.
 *
 * @param {string} skillName
 * @returns {{ learningTopic: string, resourceUrl: string, projectIdea: string }}
 */
export const getLearningResource = (skillName) => {
  if (!skillName || typeof skillName !== 'string') {
    return {
      learningTopic: 'Core Concepts and Practical Fundamentals',
      resourceUrl: 'https://developer.mozilla.org/',
      projectIdea: 'Build a hands-on project to practice and reinforce fundamental concepts.'
    };
  }

  const trimmed = skillName.trim();

  // 1. Direct match
  if (LEARNING_RESOURCES[trimmed]) {
    return LEARNING_RESOURCES[trimmed];
  }

  // 2. Case-insensitive lookup
  const normalized = trimmed.toLowerCase();
  for (const [key, resource] of Object.entries(LEARNING_RESOURCES)) {
    if (key.toLowerCase() === normalized) {
      return resource;
    }
  }

  // 3. Fallback for unrecognized skill
  return {
    learningTopic: `${trimmed} Fundamentals, Patterns, and Best Practices`,
    resourceUrl: 'https://developer.mozilla.org/',
    projectIdea: `Build a comprehensive practice project applying ${trimmed} techniques and best practices.`
  };
};

export default LEARNING_RESOURCES;
