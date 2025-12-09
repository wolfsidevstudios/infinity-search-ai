
export interface CatData {
  id: string;
  url: string;
  breeds: {
      name: string;
      temperament: string;
      origin: string;
  }[];
}

export const fetchCatOfTheDay = async (): Promise<CatData | null> => {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search?has_breeds=1');
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error("Cat API Error:", error);
    return null;
  }
};
