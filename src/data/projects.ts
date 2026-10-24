import type { Project } from '@/types/portfolio'

export const projects: Project[] = [
  {
    id: 'nextick', slug: 'nextick', title: 'NexTick', featured: true,
    category: 'Data Engineering',
    summary: 'From market noise to meaningful signals.',
    description: 'A real-time cryptocurrency candle streaming platform. Binance trade ticks flow through Kafka, become OHLCV candles, and reach a React chart through a NestJS backend—with historical data stored in QuestDB.',
    technologies: ['Python', 'Kafka', 'QuestDB', 'NestJS', 'React', 'TypeScript', 'Docker'],
    githubUrl: 'https://github.com/iamzaneth/NexTick',
    detailsUrl: 'https://github.com/iamzaneth/NexTick#readme',
    highlights: ['Event-driven data pipeline', 'Real-time & historical visualization', 'Containerized data infrastructure'],
    visualization: 'pipeline',
  },
]
