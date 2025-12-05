export interface Source {
  title: string;
  uri: string;
  hostname: string;
}

export interface MediaItem {
  id: string | number;
  type: 'image' | 'video';
  thumbnailUrl: string;
  contentUrl: string; // Full image URL or Video file URL
  pageUrl: string; // Link to the source page
  title: string;
  source: string;
  duration?: number; // Optional for videos
}

export interface SearchState {
  status: 'idle' | 'searching' | 'results';
  query: string;
  summary: string;
  sources: Source[];
  media: MediaItem[];
  error?: string;
}

export interface PixabayImage {
  id: number;
  webformatURL: string;
  tags: string;
  pageURL: string;
  largeImageURL: string;
}

export interface PixabayVideo {
  id: number;
  pageURL: string;
  tags: string;
  videos: {
    medium: {
      url: string;
      thumbnail: string;
    };
  };
  duration: number;
}

export interface PixabayResponse {
  hits: any[];
}

export interface ArchiveDoc {
  identifier: string;
  title: string;
  description?: string;
}

export interface ArchiveResponse {
  response: {
    docs: ArchiveDoc[];
  };
}

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface HistoryItem {
  id: string;
  type: 'search' | 'article';
  title: string;
  subtitle?: string;
  timestamp: Date;
  summary?: string;
  sources?: Source[];
  data?: any; // To store search state or article data to restore it
}