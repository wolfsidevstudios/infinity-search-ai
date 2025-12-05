import { MediaItem, NewsArticle } from "../types";

const API_KEY = "bWwaw0OmxV1oyXt0v3pVV1Ed6uUfu42VKHLFGi0N";

export const fetchNasaImages = async (query: string): Promise<MediaItem[]> => {
  try {
    // NASA Image and Video Library (public endpoint, robust for search)
    const response = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`);

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    const items = data.collection?.items || [];

    // Map top 5 results
    return items.slice(0, 5).map((item: any) => {
        const data = item.data?.[0];
        const links = item.links || [];
        const preview = links.find((l: any) => l.rel === 'preview') || links[0];
        
        if (!data || !preview) return null;

        return {
            id: `nasa-${data.nasa_id}`,
            type: 'image',
            thumbnailUrl: preview.href,
            contentUrl: preview.href, // Simplification: using preview as content. Full res requires another fetch.
            pageUrl: `https://images.nasa.gov/details/${data.nasa_id}`,
            title: data.title,
            source: 'NASA'
        };
    }).filter((item: any) => item !== null) as MediaItem[];

  } catch (error) {
    console.error("NASA Fetch Error:", error);
    return [];
  }
};

export const fetchNasaNews = async (page: number = 1): Promise<NewsArticle[]> => {
  try {
    // Rotate topics based on page number to keep content fresh
    const topics = ['space', 'mars', 'earth', 'galaxy', 'technology', 'solar system'];
    const topic = topics[(page - 1) % topics.length];
    
    const response = await fetch(`https://images-api.nasa.gov/search?q=${topic}&media_type=image&year_start=2023`);

    if (!response.ok) return [];

    const data = await response.json();
    const items = data.collection?.items || [];

    // Map NASA image results to NewsArticle format
    return items.slice(0, 6).map((item: any) => {
        const data = item.data?.[0];
        const links = item.links || [];
        const image = links.find((l: any) => l.rel === 'preview')?.href || links[0]?.href;
        
        if (!data) return null;

        return {
            source: { id: "nasa", name: "NASA" },
            author: "NASA",
            title: data.title,
            description: data.description_508 || data.description || "Latest updates from NASA's exploration missions.",
            url: `https://images.nasa.gov/details/${data.nasa_id}`,
            urlToImage: image || 'https://images.nasa.gov/images/nasa_logo-large.png',
            publishedAt: data.date_created || new Date().toISOString(),
            content: data.description
        };
    }).filter((item: any) => item !== null) as NewsArticle[];

  } catch (error) {
      console.error("NASA News Fetch Error", error);
      return [];
  }
};