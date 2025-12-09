import { MediaItem } from "../types";

// User provided key for PodcastIndex (Note: Full implementation requires API Secret + SHA1 Auth Header)
const PODCAST_INDEX_KEY = "CEYYXZFMGCUREX7JMYRA";

export const searchPodcasts = async (query: string): Promise<MediaItem[]> => {
  try {
    // NOTE: PodcastIndex.org requires a calculated "Authorization" header using SHA-1 of Key + Secret + Date.
    // Since the Secret is not provided and cannot be safely exposed in the frontend, 
    // we fallback to the iTunes Search API which is public, free, and robust for this demo.
    
    // Fallback: iTunes API
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`https://itunes.apple.com/search?term=${encodedQuery}&media=podcast&entity=podcastEpisode&limit=12`);

    if (!response.ok) {
        throw new Error("Podcast fetch failed");
    }

    const data = await response.json();
    
    if (!data.results) return [];

    return data.results.map((item: any) => ({
        id: `podcast-${item.trackId}`,
        type: 'podcast',
        thumbnailUrl: item.artworkUrl600 || item.artworkUrl100,
        contentUrl: item.episodeUrl || item.previewUrl, // The audio file
        pageUrl: item.trackViewUrl || item.collectionViewUrl,
        title: item.trackName || item.collectionName,
        artist: item.artistName,
        album: item.collectionName,
        source: 'Podcast',
        duration: item.trackTimeMillis ? item.trackTimeMillis / 1000 : 0,
        data: {
            releaseDate: item.releaseDate,
            genres: item.genres
        }
    }));

  } catch (error) {
    console.error("Podcast Search Error:", error);
    return [];
  }
};