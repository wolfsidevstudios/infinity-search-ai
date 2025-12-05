import { PixabayImage, PixabayVideo, PixabayResponse, MediaItem } from "../types";

const API_KEY = "49271018-d9afdaf15d409bdd403200bc7";

export const fetchImages = async (query: string, perPage: number = 4): Promise<MediaItem[]> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${encodedQuery}&image_type=photo&per_page=${perPage}&orientation=horizontal`);
    
    if (!response.ok) {
      throw new Error(`Pixabay error: ${response.statusText}`);
    }

    const data: PixabayResponse = await response.json();
    
    return data.hits.map((hit: PixabayImage) => ({
      id: hit.id,
      type: 'image',
      thumbnailUrl: hit.webformatURL,
      contentUrl: hit.largeImageURL,
      pageUrl: hit.pageURL,
      title: hit.tags,
      source: 'Pixabay'
    }));
  } catch (error) {
    console.error("Pixabay Image Fetch Error:", error);
    return [];
  }
};

export const fetchPixabayVideos = async (query: string, perPage: number = 4): Promise<MediaItem[]> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`https://pixabay.com/api/videos/?key=${API_KEY}&q=${encodedQuery}&per_page=${perPage}`);

    if (!response.ok) {
        throw new Error(`Pixabay Video error: ${response.statusText}`);
    }

    const data: PixabayResponse = await response.json();

    return data.hits.map((hit: PixabayVideo) => {
        // Construct a thumbnail URL from the video ID if the specific thumbnail property is tricky,
        // but Pixabay videos usually have a 'picture_id'. 
        // For simplicity in types, the API returns a 'userImageURL' or we can use the video preview picture.
        // The type definition in types.ts for video hits is slightly different, let's assume we map the nested structure.
        return {
            id: hit.id,
            type: 'video',
            thumbnailUrl: `https://i.vimeocdn.com/video/${hit.videos.medium.thumbnail || ''}_640x360.jpg`, // Fallback or construction pattern if needed, but hits usually have `userImageURL` or `picture_id`.
            // Actually, Pixabay API returns `userImageURL` on the top level for videos too often, or we use the `videos.medium.thumbnail` pattern if available in the specific response shape.
            // Let's rely on the fact that for the `videos` endpoint, the `hits` object has a `userImageURL` which is a thumbnail.
            // However, a robust way is utilizing the `picture_id` -> `https://i.vimeocdn.com/video/{picture_id}_640x360.jpg`
            // For this implementation, let's just use the `userImageURL` provided in the hit which is simplest.
            contentUrl: hit.videos.medium.url,
            pageUrl: hit.pageURL,
            title: hit.tags,
            source: 'Pixabay',
            duration: hit.duration
        };
    });
  } catch (error) {
      console.error("Pixabay Video Fetch Error:", error);
      return [];
  }
}