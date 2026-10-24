export const skills = [
  {
    id: 'ai', number: '01', title: 'AI & Mathematics', icon: 'brain',
    description: 'Understanding the ideas behind intelligent systems.',
    technologies: ['Machine Learning', 'Recommendation Systems', 'Statistics', 'Linear Algebra'],
  },
  {
    id: 'data', number: '02', title: 'Data Engineering', icon: 'database',
    description: 'Connecting raw events to reliable, usable data.',
    technologies: ['Python', 'SQL', 'Kafka', 'QuestDB', 'PostgreSQL', 'MySQL'],
  },
  {
    id: 'analysis', number: '03', title: 'Data Analysis', icon: 'chart',
    description: 'Finding clarity in the details, one question at a time.',
    technologies: ['Data Cleaning', 'Data Validation', 'SQL', 'Statistics'],
  },
  {
    id: 'engineering', number: '04', title: 'Engineering & Tools', icon: 'terminal',
    description: 'The tools that turn an idea into something that works.',
    technologies: ['TypeScript', 'React', 'NestJS', 'Docker', 'Git', 'Linux / WSL'],
  },
] as const
