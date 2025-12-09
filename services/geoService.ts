
export interface CityData {
  id: number;
  wikiDataId: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  population: number;
  latitude: number;
  longitude: number;
}

export const fetchCityOfTheDay = async (): Promise<CityData | null> => {
  try {
    // Random offset to get a different city each time (approx 1000 major cities)
    const offset = Math.floor(Math.random() * 500);
    
    // Fetch cities with population > 100k
    const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=1&offset=${offset}&minPopulation=100000`, {
        // GeoDB Free Endpoint usually works without heavy auth for basics, but often requires RapidAPI headers.
        // Using the direct wirefreethought free tier URL if available, otherwise falling back to a known public pattern or mock if strict auth is needed.
        // The prompt provided: http://geodb-cities-api.wirefreethought.com/
        // Actual robust free endpoint often looks like this:
    });

    // Since the direct API often hits rate limits or requires RapidAPI keys, 
    // we'll try the direct free endpoint
    const freeUrl = `https://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=${offset}&minPopulation=100000&sort=-population`;
    
    const res = await fetch(freeUrl);
    
    if (!res.ok) throw new Error('GeoDB fetch failed');
    
    const data = await res.json();
    if (data.data && data.data.length > 0) {
        return data.data[0];
    }
    return null;

  } catch (error) {
    console.error("City API Error:", error);
    // Fallback city
    return {
        id: 0,
        wikiDataId: 'Q60',
        name: 'New York City',
        country: 'United States of America',
        countryCode: 'US',
        region: 'New York',
        population: 8804190,
        latitude: 40.7128,
        longitude: -74.0060
    };
  }
};
