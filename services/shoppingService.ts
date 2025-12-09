import { ShoppingProduct, MediaItem } from "../types";

const API_KEY = "qSHPbbuNGuQbHrM8UUWqi9rT";
const BASE_URL = "https://www.searchapi.io/api/v1/search";

const fetchFromEngine = async (engine: string, query: string, sourceLabel: string): Promise<ShoppingProduct[]> => {
    try {
        const url = new URL(BASE_URL);
        url.searchParams.append("engine", engine);
        url.searchParams.append("api_key", API_KEY);
        url.searchParams.append("q", query);
        url.searchParams.append("gl", "us");
        url.searchParams.append("hl", "en");
        
        // Amazon/Ebay/Shein specific params can be tweaked here if needed
        if (engine === 'google_shopping') url.searchParams.append("num", "10");

        const response = await fetch(url.toString());
        if (!response.ok) return [];
        const data = await response.json();

        let results = [];
        
        if (engine === 'google_shopping' && data.shopping_results) {
            results = data.shopping_results;
        } else if (engine === 'amazon_search' && data.organic_results) {
            results = data.organic_results;
        } else if (engine === 'ebay_search' && data.organic_results) {
            results = data.organic_results;
        } else if (engine === 'shein_search' && data.organic_results) {
            results = data.organic_results;
        }

        return results.map((item: any, index: number) => ({
            position: index,
            title: item.title,
            link: item.link || item.product_link,
            source: item.source || sourceLabel, // Use provided label if source not in API
            price: item.price?.raw || item.price || '$0',
            extracted_price: item.price?.extracted || item.extracted_price || 0,
            thumbnail: item.thumbnail || item.image,
            rating: item.rating,
            reviews: item.reviews || item.reviews_count,
            delivery: item.delivery || (item.is_prime ? 'Prime' : ''),
            badge: item.badge || (item.is_best_seller ? 'Best Seller' : '')
        }));

    } catch (e) {
        console.error(`Error fetching ${engine}:`, e);
        return [];
    }
};

export const searchShopping = async (query: string): Promise<ShoppingProduct[]> => {
  // Parallel fetch from multiple vendors
  const promises = [
      fetchFromEngine('google_shopping', query, 'Google Shopping'),
      fetchFromEngine('amazon_search', query, 'Amazon'),
      fetchFromEngine('ebay_search', query, 'eBay'),
      fetchFromEngine('shein_search', query, 'Shein')
  ];

  const results = await Promise.allSettled(promises);
  
  // Flatten results
  let allProducts: ShoppingProduct[] = [];
  results.forEach(res => {
      if (res.status === 'fulfilled') {
          allProducts = [...allProducts, ...res.value];
      }
  });

  // Simple shuffle to mix results
  return allProducts.sort(() => Math.random() - 0.5);
};

export const fetchGoogleImages = async (query: string): Promise<MediaItem[]> => {
    try {
        const url = new URL(BASE_URL);
        url.searchParams.append("engine", "google_images");
        url.searchParams.append("api_key", API_KEY);
        url.searchParams.append("q", query);
        url.searchParams.append("gl", "us");

        const response = await fetch(url.toString());
        if (!response.ok) return [];
        const data = await response.json();

        if (!data.images_results) return [];

        return data.images_results.slice(0, 8).map((img: any, idx: number) => ({
            id: `gimg-${idx}`,
            type: 'image',
            thumbnailUrl: img.thumbnail,
            contentUrl: img.original,
            pageUrl: img.link,
            title: img.title,
            source: img.source || 'Google Images'
        }));

    } catch (e) {
        console.error("Google Images Error:", e);
        return [];
    }
};
