import { MediaItem, ArchiveResponse } from "../types";

const ARCHIVE_API_URL = "https://archive.org/advancedsearch.php";

export const fetchArchiveVideos = async (query: string): Promise<MediaItem[]> => {
  try {
    // Construct query: search for movies/video matching the query
    const q = `(${encodeURIComponent(query)}) AND mediatype:(movies)`;
    const fields = "identifier,title,description";
    const url = `${ARCHIVE_API_URL}?q=${q}&fl[]=${fields}&output=json&rows=15&sort[]=downloads desc`;

    const response = await fetch(url);
    if (!response.ok) {
        return [];
    }

    const data: ArchiveResponse = await response.json();

    if (!data.response || !data.response.docs) {
        return [];
    }

    return data.response.docs.map((doc) => ({
      id: doc.identifier,
      type: 'video',
      // Construct thumbnail URL: https://archive.org/services/img/{identifier}
      thumbnailUrl: `https://archive.org/services/img/${doc.identifier}`,
      // We don't have a direct MP4 link easily without a second call, so we point content to the page or thumbnail for now
      // Ideally, we'd use the pageURL for viewing.
      contentUrl: `https://archive.org/details/${doc.identifier}`, 
      pageUrl: `https://archive.org/details/${doc.identifier}`,
      title: doc.title || doc.identifier,
      source: 'Archive.org'
    }));

  } catch (error) {
    console.error("Archive.org Fetch Error:", error);
    return [];
  }
};