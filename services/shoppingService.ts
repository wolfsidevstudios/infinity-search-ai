import { ShoppingProduct } from "../types";

const API_KEY = "qSHPbbuNGuQbHrM8UUWqi9rT";
const BASE_URL = "https://www.searchapi.io/api/v1/search";

export const searchShopping = async (query: string): Promise<ShoppingProduct[]> => {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.append("engine", "google_shopping");
    url.searchParams.append("api_key", API_KEY);
    url.searchParams.append("q", query);
    url.searchParams.append("gl", "us"); // Country: US
    url.searchParams.append("hl", "en"); // Language: English
    url.searchParams.append("num", "20"); // Number of results

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Shopping API Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.shopping_results) return [];

    return data.shopping_results.map((item: any) => ({
      position: item.position,
      title: item.title,
      link: item.link,
      source: item.source,
      price: item.price,
      extracted_price: item.extracted_price,
      thumbnail: item.thumbnail,
      rating: item.rating,
      reviews: item.reviews,
      delivery: item.delivery,
      badge: item.badge
    }));

  } catch (error) {
    console.error("Shopping Search Error:", error);
    return [];
  }
};
