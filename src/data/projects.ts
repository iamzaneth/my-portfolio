import type { Project } from '@/types/portfolio'

export const projects: Project[] = [
  {
    id: 'nextick', slug: 'nextick', title: 'NexTick', featured: true,
    category: 'Data Engineering',
    summary: 'A real-time crypto data pipeline, from Binance trades to chart-ready candles.',
    description: 'A real-time cryptocurrency candle streaming platform. Binance trade ticks flow through Kafka, become OHLCV candles, and reach a React chart through a NestJS backend—with historical data stored in QuestDB.',
    technologies: ['Python', 'Kafka', 'QuestDB', 'NestJS', 'React', 'TypeScript', 'Docker'],
    githubUrl: 'https://github.com/iamzaneth/NexTick',
    detailsUrl: 'https://github.com/iamzaneth/NexTick#readme',
    highlights: ['Event-driven data pipeline', 'Real-time & historical visualization', 'Containerized data infrastructure'],
    visualization: 'pipeline',
    visualTitle: 'From a tick to a chart.',
    visualNote: 'Illustrated event flow · not live market data',
    story: [
      { label: 'The problem', text: 'Individual market trades arrive as a stream of noisy events. A useful chart needs both fresh candles and historical context.' },
      { label: 'The approach', text: 'Separate ingestion, event streaming, time-series storage, and delivery so each part has a clear responsibility.' },
      { label: 'The evidence', text: 'Explore the source and README for the pipeline, container setup, and real-time and historical chart implementation.' },
    ],
    pipeline: [
      { id: 'binance', name: 'Binance', detail: 'trade source', icon: 'source', description: 'A Python producer ingests Binance trade ticks and publishes them into the event pipeline.', output: 'Trade events → Kafka', companion: 'Every pipeline starts with a little curiosity.' },
      { id: 'kafka', name: 'Kafka', detail: 'event stream', icon: 'stream', description: 'Kafka carries trade events between ingestion and downstream candle processing, separating the producer from its consumers.', output: 'Event stream → candle processing', companion: 'Following the event trail. One tick at a time.' },
      { id: 'questdb', name: 'QuestDB', detail: 'candle storage', icon: 'storage', description: 'OHLCV candles are stored in QuestDB, giving the application a time-series history alongside its real-time updates.', output: 'Historical candles → backend', companion: 'A place for every candle. Neat.' },
      { id: 'nestjs', name: 'NestJS', detail: 'delivery layer', icon: 'backend', description: 'The NestJS backend connects the data pipeline to the interface, serving historical data and delivering real-time candle updates.', output: 'History & updates → React', companion: 'Connecting the dots, backend to frontend.' },
      { id: 'react', name: 'React', detail: 'chart interface', icon: 'chart', description: 'The React interface brings historical candles and incoming updates together in a chart visitors can explore.', output: 'Trade events → a readable chart', companion: 'From raw events to something you can see.' },
    ],
  },
]
