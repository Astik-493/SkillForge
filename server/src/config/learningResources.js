/**
 * SkillForge Learning Resources Configuration
 * Maps supported skills to curated learning topics, reliable documentation URLs, and practical project ideas.
 */

export const LEARNING_RESOURCES = {
  // Existing skills (Preserved)
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
  },

  // Expanded Skills for New Career Roles
  'Docker': {
    learningTopic: 'Containerization Fundamentals, Dockerfiles, Multi-Stage Builds, Volumes, and Docker Compose',
    resourceUrl: 'https://docs.docker.com/get-started/',
    projectIdea: 'Containerize a multi-tier microservices application with separate frontend, API, and database containers using Docker Compose.'
  },
  'Kubernetes': {
    learningTopic: 'Pod Architecture, Deployments, Services, Ingress Controllers, ConfigMaps, and Rolling Updates',
    resourceUrl: 'https://kubernetes.io/docs/tutorials/',
    projectIdea: 'Deploy a high-availability web service to a local Kubernetes cluster (Minikube/Kind) with autoscaling and zero-downtime rollouts.'
  },
  'CI/CD Pipelines': {
    learningTopic: 'Continuous Integration, Automated Testing, Build Artifacts, Release Stages, and GitHub Actions / GitLab CI',
    resourceUrl: 'https://docs.github.com/en/actions',
    projectIdea: 'Author a complete GitHub Actions workflow that runs linter and unit tests on PRs, builds Docker images, and deploys to staging.'
  },
  'Linux': {
    learningTopic: 'Shell Navigation, Permissions, Process Management, Bash Scripting, and System Administration',
    resourceUrl: 'https://linuxjourney.com/',
    projectIdea: 'Write a suite of automated Bash maintenance scripts for server health monitoring, disk usage alerts, and log rotation.'
  },
  'Cloud Computing': {
    learningTopic: 'Cloud Service Models (IaaS/PaaS/SaaS), Virtual Networks, Identity and Access Management (IAM), and Object Storage',
    resourceUrl: 'https://aws.amazon.com/what-is-cloud-computing/',
    projectIdea: 'Architect a serverless document-processing solution utilizing cloud storage triggers and cloud compute functions.'
  },
  'AWS': {
    learningTopic: 'Amazon Web Services: EC2, S3, RDS, Lambda, VPC Architecture, IAM Policies, and CloudWatch',
    resourceUrl: 'https://docs.aws.amazon.com/',
    projectIdea: 'Deploy a secure, auto-scaling web application behind an AWS Application Load Balancer with an RDS Postgres backend.'
  },
  'Terraform': {
    learningTopic: 'Infrastructure as Code (IaC), HCL Syntax, Providers, State Management, Modules, and Plan/Apply Workflows',
    resourceUrl: 'https://developer.hashicorp.com/terraform/tutorials',
    projectIdea: 'Write modular Terraform templates to provision a complete cloud VPC network with public/private subnets and security groups.'
  },
  'Networking': {
    learningTopic: 'TCP/IP Model, DNS Resolution, HTTP/HTTPS Protocols, Routing, Firewalls, and Load Balancing',
    resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanisms/How_does_the_Internet_work',
    projectIdea: 'Configure a reverse proxy with TLS certificate termination and path-based routing for local microservices.'
  },
  'Apache Spark': {
    learningTopic: 'Distributed Computing with PySpark, Resilient Distributed Datasets (RDDs), DataFrames, and Spark SQL',
    resourceUrl: 'https://spark.apache.org/docs/latest/',
    projectIdea: 'Process a multi-gigabyte clickstream dataset using PySpark to compute aggregated user retention and session metrics.'
  },
  'Data Pipelines': {
    learningTopic: 'ETL/ELT Architecture, Batch vs Stream Processing, Data Validation, and Pipeline Orchestration',
    resourceUrl: 'https://airflow.apache.org/docs/apache-airflow/stable/',
    projectIdea: 'Build an end-to-end data pipeline that ingests daily public API data, transforms records, and loads them into analytical tables.'
  },
  'Data Warehousing': {
    learningTopic: 'Dimensional Modeling, Star & Snowflake Schemas, Columnar Databases, and Analytical SQL Optimization',
    resourceUrl: 'https://cloud.google.com/bigquery/docs',
    projectIdea: 'Design a dimensional data warehouse schema for an online retail platform with fact tables and date/product dimensions.'
  },
  'Django': {
    learningTopic: 'Django MVT Architecture, ORM, Admin Panel, Authentication, Middleware, and Form Handling',
    resourceUrl: 'https://docs.djangoproject.com/en/stable/',
    projectIdea: 'Develop a multi-user blog and content management system with user profiles, role permissions, and rich-text editing.'
  },
  'FastAPI': {
    learningTopic: 'Asynchronous Python Web APIs, Pydantic Data Models, Dependency Injection, and OpenAPI Specs',
    resourceUrl: 'https://fastapi.tiangolo.com/tutorial/',
    projectIdea: 'Create a high-performance asynchronous REST API with automatic OpenAPI documentation and JWT authentication.'
  },
  'PostgreSQL': {
    learningTopic: 'Advanced Relational Database Concepts, JSONB Querying, Window Functions, Triggers, and Indexes',
    resourceUrl: 'https://www.postgresql.org/docs/',
    projectIdea: 'Build a complex geospatial or tagging system in PostgreSQL leveraging JSONB indexing and window analytical queries.'
  },
  'Java': {
    learningTopic: 'Java Core, OOP Principles, Collections Framework, Generics, Concurrency (Threads & Executors), and Streams',
    resourceUrl: 'https://docs.oracle.com/en/java/',
    projectIdea: 'Build a multi-threaded banking transaction simulator demonstrating thread safety, synchronized locks, and custom exceptions.'
  },
  'Spring Boot': {
    learningTopic: 'Spring Framework Core, Dependency Injection, Spring Data JPA, REST Controllers, and Spring Security',
    resourceUrl: 'https://spring.io/guides',
    projectIdea: 'Develop a full-featured microservice for an employee management system featuring Spring Data JPA and token authentication.'
  },
  'Microservices': {
    learningTopic: 'Decoupled Architectures, Service Discovery, API Gateways, Event-Driven Communication, and Resilience',
    resourceUrl: 'https://microservices.io/',
    projectIdea: 'Design an event-driven ordering system with independent order, payment, and notification microservices.'
  },
  'Network Security': {
    learningTopic: 'Network Defense, Port Scanning, Firewalls, Intrusion Detection Systems (IDS/IPS), and Packet Analysis with Wireshark',
    resourceUrl: 'https://www.wireshark.org/docs/',
    projectIdea: 'Analyze pcap network traffic captures using Wireshark to identify reconnaissance scans, unauthorized logins, and data exfiltration.'
  },
  'Cryptography': {
    learningTopic: 'Symmetric & Asymmetric Encryption, Hashing (SHA-256), Digital Signatures, PKI, and TLS Handshake',
    resourceUrl: 'https://csrc.nist.gov/publications',
    projectIdea: 'Implement a secure file encryption and digital signing utility in Python using AES-GCM and RSA key pairs.'
  },
  'Vulnerability Assessment': {
    learningTopic: 'Vulnerability Scanning, OWASP Top 10, Common Vulnerabilities and Exposures (CVE), and Remediation Strategies',
    resourceUrl: 'https://owasp.org/www-project-top-ten/',
    projectIdea: 'Audit a sample vulnerable web application, document findings according to CVSS scoring, and implement source-code patches.'
  },
  'Incident Response': {
    learningTopic: 'Incident Response Lifecycle (NIST SP 800-61), Forensic Triage, Log Correlation (SIEM), and Threat Containment',
    resourceUrl: 'https://www.cisa.gov/resources-tools/resources',
    projectIdea: 'Draft an incident response runbook and analyze simulated compromised server logs to document root cause and remediation.'
  },
  'Responsive Design': {
    learningTopic: 'Fluid Layouts, Media Queries, Container Queries, Mobile-First UX, and Viewport Meta',
    resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design',
    projectIdea: 'Redesign an existing desktop dashboard into a fluid, accessible mobile-first responsive layout.'
  },
  'Web Performance': {
    learningTopic: 'Core Web Vitals, Asset Optimization, Code Splitting, Lazy Loading, and Lighthouse Auditing',
    resourceUrl: 'https://web.dev/explore/fast',
    projectIdea: 'Audit and optimize a high-traffic web application to achieve 95+ Lighthouse performance scores.'
  },
  'Power BI': {
    learningTopic: 'DAX Formulas, Power Query Transformations, Data Modeling, and Interactive Executive Reports',
    resourceUrl: 'https://learn.microsoft.com/en-us/power-bi/',
    projectIdea: 'Build a comprehensive business intelligence report with custom KPIs, drill-downs, and automated refresh.'
  },
  'Pandas': {
    learningTopic: 'DataFrames, Series, Data Cleaning, Merging & Grouping, and Time-Series Analysis',
    resourceUrl: 'https://pandas.pydata.org/docs/user_guide/index.html',
    projectIdea: 'Clean, normalize, and analyze a real-world multi-million row financial transactions dataset.'
  },
  'Scikit-Learn': {
    learningTopic: 'Model Evaluation Metrics, Pipelines, Feature Selection, and Ensemble Methods',
    resourceUrl: 'https://scikit-learn.org/stable/user_guide.html',
    projectIdea: 'Construct an end-to-end predictive machine learning pipeline with cross-validation and hyperparameter tuning.'
  },
  'PyTorch': {
    learningTopic: 'Tensors, Autograd, Neural Network Modules (nn.Module), Loss Functions, and GPU Acceleration',
    resourceUrl: 'https://pytorch.org/tutorials/',
    projectIdea: 'Train a deep recurrent or transformer neural network for text generation with PyTorch.'
  },
  'Test Automation': {
    learningTopic: 'Testing Pyramid, Test-Driven Development (TDD), Assertion Libraries, and Mocking Strategies',
    resourceUrl: 'https://martinfowler.com/testing/',
    projectIdea: 'Create an automated integration and end-to-end test suite for an e-commerce checkout flow.'
  },
  'Selenium': {
    learningTopic: 'WebDriver Architecture, Element Locators (XPath/CSS), Page Object Model (POM), and Headless Testing',
    resourceUrl: 'https://www.selenium.dev/documentation/',
    projectIdea: 'Implement an automated cross-browser testing suite using Selenium and the Page Object Model.'
  },
  'Cypress / Playwright': {
    learningTopic: 'Modern E2E Testing, Network Interception, Visual Regression, and Parallel CI Execution',
    resourceUrl: 'https://playwright.dev/docs/intro',
    projectIdea: 'Build a lightning-fast Playwright end-to-end regression suite covering complex multi-step user workflows.'
  },
  'API Testing': {
    learningTopic: 'REST API Contract Testing, Schema Validation, Auth Headers, Status Code Assertions, and Postman/Newman',
    resourceUrl: 'https://learning.postman.com/docs/writing-scripts/test-scripts/',
    projectIdea: 'Create an automated Postman test collection with environment variables and run it via Newman in CI.'
  },
  'React Native': {
    learningTopic: 'Mobile Components, Native Navigation, Gesture Handlers, Async Storage, and Cross-Platform Architecture',
    resourceUrl: 'https://reactnative.dev/docs/getting-started',
    projectIdea: 'Develop a cross-platform mobile fitness tracker with offline persistence and push notifications.'
  },
  'Flutter': {
    learningTopic: 'Dart Language, Widget Tree, State Management (Provider/Bloc), Platform Channels, and Material/Cupertino',
    resourceUrl: 'https://docs.flutter.dev/',
    projectIdea: 'Build a high-performance cross-platform mobile crypto tracking app with real-time websocket price charts.'
  },
  'Mobile UI/UX': {
    learningTopic: 'Mobile Touch Targets, Ergonomics, Safe Area Insets, Responsive Mobile Typography, and Accessibility',
    resourceUrl: 'https://developer.apple.com/design/human-interface-guidelines/',
    projectIdea: 'Design and prototype an intuitive mobile onboarding experience respecting Apple and Android guidelines.'
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

  // 3. Fallback for unrecognized custom skill
  return {
    learningTopic: `${trimmed} Fundamentals, Architecture, and Best Practices`,
    resourceUrl: 'https://developer.mozilla.org/',
    projectIdea: `Build a comprehensive practice project applying ${trimmed} techniques and real-world patterns.`
  };
};

export default LEARNING_RESOURCES;
