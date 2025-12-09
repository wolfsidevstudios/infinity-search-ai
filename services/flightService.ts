
import { Flight } from "../types";

const API_KEY = "qSHPbbuNGuQbHrM8UUWqi9rT";
const BASE_URL = "https://www.searchapi.io/api/v1/search";

export const searchFlights = async (query: string): Promise<Flight[]> => {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.append("engine", "google_flights");
    url.searchParams.append("api_key", API_KEY);
    // Google Flights engine usually expects departure_id, arrival_id etc, but basic `q` works for generic searches like "flights from NYC to London"
    url.searchParams.append("q", query); 
    url.searchParams.append("gl", "us");
    url.searchParams.append("hl", "en");

    const response = await fetch(url.toString());
    if (!response.ok) return [];
    
    const data = await response.json();
    
    // Structure depends on SearchAPI response for flights, mapping common fields
    const flights = data.organic_results || data.flights_results || [];

    return flights.map((f: any, idx: number) => ({
        id: `flight-${idx}`,
        airline: f.airline || f.carrier?.name || 'Unknown Airline',
        airline_logo: f.airline_logo || f.carrier?.logo || '',
        departure: f.departure_time || f.departure || '',
        arrival: f.arrival_time || f.arrival || '',
        duration: f.duration || '',
        price: f.price?.raw || f.price || 'Check Link',
        stops: f.stops || (f.number_of_stops === 0 ? 'Non-stop' : `${f.number_of_stops} stops`),
        link: f.link || f.booking_link || '#'
    }));

  } catch (error) {
    console.error("Flight Search Error:", error);
    return [];
  }
};
