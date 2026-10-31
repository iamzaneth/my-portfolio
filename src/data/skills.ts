export const skills = [
  {
    id: 'ai', number: '01', title: 'AI & Mathematics', icon: 'brain', focus: 'core',
    description: 'Understanding the ideas behind intelligent systems.',
    practice: 'Exploring how mathematical foundations shape machine learning and recommendation systems, from the model assumptions to the questions they can answer.',
    technologies: ['Machine Learning', 'Recommendation Systems', 'Statistics', 'Linear Algebra'],
  },
  {
    id: 'data', number: '02', title: 'Data Engineering', icon: 'database', focus: 'core',
    description: 'Connecting raw events to reliable, usable data.',
    practice: 'Building streaming pipelines with Python and Kafka, and working with SQL and time-series storage to connect raw events to usable applications.',
    technologies: ['Python', 'SQL', 'Kafka', 'QuestDB', 'PostgreSQL', 'MySQL'],
  },
  {
    id: 'analysis', number: '03', title: 'Data Analysis', icon: 'chart', focus: 'supporting',
    description: 'Finding clarity in the details, one question at a time.',
    practice: 'Starting with data cleaning and validation, then using SQL and statistics to understand what the data can reliably tell us.',
    technologies: ['Data Cleaning', 'Data Validation', 'SQL', 'Statistics'],
  },
  {
    id: 'engineering', number: '04', title: 'Engineering & Tools', icon: 'terminal', focus: 'supporting',
    description: 'The tools that turn an idea into something that works.',
    practice: 'Connecting TypeScript interfaces and backend services, keeping work versioned with Git, and packaging development environments with Docker.',
    technologies: ['TypeScript', 'React', 'NestJS', 'Docker', 'Git', 'Linux / WSL'],
  },
] as const
