
import { NewsArticle } from "../types";

// Using ESPN's public API for NFL news as it reliably includes images
const ESPN_API = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news";

export const fetchSportsNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(ESPN_API);
    if (!response.ok) return [];

    const data = await response.json();
    return data.articles.map((article: any) => ({
      source: { id: 'espn', name: 'ESPN' },
      author: article.byline || 'ESPN Staff',
      title: article.headline,
      description: article.description,
      url: article.links?.web?.href || '',
      urlToImage: article.images?.[0]?.url || null,
      publishedAt: article.published,
      content: article.description
    })).filter((a: NewsArticle) => a.urlToImage); // Only keep ones with images
  } catch (error) {
    console.error("Sports API Error:", error);
    return [];
  }
};
