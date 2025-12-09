
import { AppStoreApp } from "../types";

const API_KEY = "qSHPbbuNGuQbHrM8UUWqi9rT";
const BASE_URL = "https://www.searchapi.io/api/v1/search";

export const fetchTopApps = async (): Promise<AppStoreApp[]> => {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.append("engine", "apple_app_store_top_charts");
    url.searchParams.append("api_key", API_KEY);
    url.searchParams.append("store", "us"); // US Store
    url.searchParams.append("chart", "top-free"); // Top Free Apps

    const response = await fetch(url.toString());
    if (!response.ok) return [];
    
    const data = await response.json();
    
    // Check organic_results or specific chart array
    const apps = data.organic_results || [];

    return apps.slice(0, 12).map((app: any) => ({
        id: String(app.position),
        title: app.title,
        category: app.category,
        image: app.thumbnail,
        rank: app.position,
        link: app.link,
        rating: app.rating
    }));

  } catch (error) {
    console.error("App Store Fetch Error:", error);
    return [];
  }
};
