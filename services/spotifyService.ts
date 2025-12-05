import { MediaItem, SpotifyTrack } from "../types";

export const searchSpotify = async (query: string, token: string): Promise<MediaItem[]> => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Spotify token expired");
        }
        return [];
    }

    const data = await response.json();
    
    if (!data.tracks || !data.tracks.items) return [];

    return data.tracks.items.map((track: SpotifyTrack) => ({
        id: track.id,
        type: 'audio',
        thumbnailUrl: track.album.images[0]?.url || '',
        contentUrl: track.preview_url || track.external_urls.spotify, // Use preview if available, else link
        pageUrl: track.external_urls.spotify,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        source: 'Spotify',
        duration: track.duration_ms / 1000
    }));

  } catch (error) {
    console.error("Spotify Search Error:", error);
    throw error;
  }
};
