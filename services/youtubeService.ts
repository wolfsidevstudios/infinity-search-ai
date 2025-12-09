import { MediaItem } from "../types";

const API_KEY = "AIzaSyBd5o02cc1ArgEyHPRZZ_H0k0Ro_AqMbcY";

export const searchYoutube = async (query: string): Promise<MediaItem[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}&maxResults=6`
    );

    if (!response.ok) {
      console.error("YouTube API Error:", response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.items) return [];

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      type: 'video',
      thumbnailUrl: item.snippet.thumbnails.high.url || item.snippet.thumbnails.medium.url,
      contentUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      pageUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      title: item.snippet.title,
      source: 'YouTube',
      artist: item.snippet.channelTitle,
      data: {
          description: item.snippet.description,
          publishTime: item.snippet.publishTime
      }
    }));
  } catch (error) {
    console.error("YouTube Fetch Error:", error);
    return [];
  }
};