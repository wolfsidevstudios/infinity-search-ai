
export interface Source {
  title: string;
  uri: string;
  hostname: string;
}

export interface MediaItem {
  id: string | number;
  type: 'image' | 'video' | 'audio' | 'article' | 'bible' | 'podcast' | 'post' | 'file';
  thumbnailUrl: string;
  contentUrl: string; // Full image URL or Video file URL or Audio preview
  pageUrl: string; // Link to the source page
  title: string;
  source: string;
  duration?: number; // Optional for videos/audio
  artist?: string; // Specific to audio
  album?: string; // Specific to audio
  data?: any; // For additional metadata (e.g. Notion page details, Bible verses)
}

export interface CollectionItem {
  id: string;
  type: 'web' | 'image' | 'audio' | 'note' | 'product' | 'flight' | 'app';
  content: any; // Flexible payload based on type
  dateAdded: number;
}

export interface SearchState {
  status: 'idle' | 'searching' | 'thinking' | 'results';
  query: string;
  summary: string;
  sources: Source[];
  media: MediaItem[];
  shopping?: ShoppingProduct[];
  aiProductPicks?: ShoppingProduct[];
  productImages?: MediaItem[];
  flights?: Flight[];
  error?: string;
  isDeepSearch?: boolean;
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

export interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { name: string }[];
  duration_ms: number;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  hashtags: string[];
  created_at: string;
  likes_count: number;
  hype_count?: number;
  author_name?: string;
  author_avatar?: string;
}

export interface ShoppingProduct {
  position: number;
  title: string;
  link: string;
  source: string; // Merchant
  price: string;
  extracted_price?: number;
  thumbnail: string;
  rating?: number;
  reviews?: number;
  delivery?: string; // e.g. "Free delivery"
  badge?: string; // e.g. "Sale" or "Top Rated"
  aiReason?: string; // For AI picks
}

export interface Flight {
  id: string;
  airline: string;
  airline_logo: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  stops: string;
  link: string;
}

export interface AppStoreApp {
  id: string;
  title: string;
  category: string;
  image: string;
  rank: number;
  link: string;
  rating?: number;
}

export interface Email {
  _id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
  date: number;
  ip?: string;
}

export interface TempMailbox {
  address: string;
  token: string;
}
