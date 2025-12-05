export interface WeatherData {
  temperature: number;
  weathercode: number;
  city: string;
}

export const fetchWeather = async (lat: number = 40.7128, lon: number = -74.0060): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    
    if (!response.ok) throw new Error('Weather fetch failed');
    
    const data = await response.json();
    return {
      temperature: data.current_weather.temperature,
      weathercode: data.current_weather.weathercode,
      city: "Current Location" 
    };
  } catch (error) {
    console.error("Weather service error:", error);
    return { temperature: 72, weathercode: 0, city: "New York" }; // Fallback
  }
};

export const getWeatherIcon = (code: number) => {
  // Simple mapping of WMO codes
  if (code === 0) return 'sunny';
  if (code >= 1 && code <= 3) return 'partly-cloudy';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 67) return 'rain';
  if (code >= 71 && code <= 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'cloudy';
};