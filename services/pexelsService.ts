import { MediaItem } from "../types";

const API_KEY = "8Mh8jDK5VAgGnnmNYO2k0LqdaLL8lbIR4ou5Vnd8Zod0cETWahEx1MKf";

export const fetchPexelsImages = async (query: string, perPage: number = 6): Promise<MediaItem[]> => {
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`, {
      headers: {
        Authorization: API_KEY
      }
    });

    if (!response.ok) {
      // If 429 or other error, return empty
      return [];
    }

    const data = await response.json();

    return data.photos.map((photo: any) => ({
      id: `pexels-${photo.id}`,
      type: 'image',
      thumbnailUrl: photo.src.medium,
      contentUrl: photo.src.large2x,
      pageUrl: photo.url,
      title: photo.alt || query,
      source: 'Pexels'
    }));
  } catch (error) {
    console.error("Pexels Image Fetch Error:", error);
    return [];
  }
};

export const fetchPexelsVideos = async (query: string, perPage: number = 6): Promise<MediaItem[]> => {
    try {
      const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`, {
        headers: {
          Authorization: API_KEY
        }
      });
  
      if (!response.ok) {
        return [];
      }
  
      const data = await response.json();
  
      return data.videos.map((video: any) => ({
        id: `pexels-video-${video.id}`,
        type: 'video',
        thumbnailUrl: video.image,
        contentUrl: video.video_files.sort((a: any, b: any) => b.width - a.width)[0]?.link, // Best quality
        pageUrl: video.url,
        title: query, 
        source: 'Pexels',
        duration: video.duration
      }));
    } catch (error) {
      console.error("Pexels Video Fetch Error:", error);
      return [];
    }
  };