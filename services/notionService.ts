import { MediaItem } from "../types";

export interface NotionPage {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  lastEdited: string;
  preview: string;
  url: string;
  tags: string[];
}

// Simulated Notion Search (Real API requires a backend proxy for CORS)
export const searchNotion = async (query: string, token: string): Promise<MediaItem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock Data that adapts to query
  const mockPages: NotionPage[] = [
    {
      id: '1',
      title: 'Q3 Product Roadmap',
      icon: '🗺️',
      lastEdited: '2025-05-10',
      preview: 'Focus on AI integration and mobile responsiveness. Key milestones included.',
      url: 'https://notion.so/product-roadmap',
      tags: ['Product', 'Planning']
    },
    {
      id: '2',
      title: 'Engineering Sync Notes',
      icon: '🛠️',
      lastEdited: '2025-05-12',
      preview: 'Discussed API latency issues and database migration strategy for the new cluster.',
      url: 'https://notion.so/eng-sync',
      tags: ['Engineering', 'Meeting']
    },
    {
      id: '3',
      title: 'Marketing Brand Guidelines',
      icon: '🎨',
      cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80',
      lastEdited: '2025-04-20',
      preview: 'Primary colors are #000000 and #FFFFFF. Font family is Plus Jakarta Sans.',
      url: 'https://notion.so/brand-guidelines',
      tags: ['Design', 'Marketing']
    },
    {
      id: '4',
      title: 'Q2 Financial Report',
      icon: '📊',
      lastEdited: '2025-04-01',
      preview: 'Revenue up by 20% compared to last quarter. Operational costs stable.',
      url: 'https://notion.so/q2-finance',
      tags: ['Finance', 'Confidential']
    }
  ];

  return mockPages.map(page => ({
    id: page.id,
    type: 'article', // Using 'article' type for generic text content
    thumbnailUrl: page.cover || '', 
    contentUrl: page.url,
    pageUrl: page.url,
    title: page.title,
    source: 'Notion',
    data: {
      ...page,
      type: 'notion'
    }
  }));
};