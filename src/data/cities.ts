export interface City {
  name: string;
  lat: number;
  lng: number;
}

export const cities: City[] = [
  // Asia
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Kyoto", lat: 35.0116, lng: 135.7681 },
  { name: "Osaka", lat: 34.6937, lng: 135.5023 },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { name: "Seoul", lat: 37.5665, lng: 126.978 },
  { name: "Beijing", lat: 39.9042, lng: 116.4074 },
  { name: "Shanghai", lat: 31.2304, lng: 121.4737 },
  { name: "Xi'an", lat: 34.3416, lng: 108.9398 },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Bali", lat: -8.3405, lng: 115.092 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Taipei", lat: 25.033, lng: 121.5654 },
  { name: "Chiang Mai", lat: 18.7883, lng: 98.9853 },
  { name: "Hanoi", lat: 21.0278, lng: 105.8342 },
  { name: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297 },
  { name: "Siem Reap", lat: 13.362, lng: 103.8597 },
  { name: "Kuala Lumpur", lat: 3.139, lng: 101.6869 },
  { name: "Manila", lat: 14.5995, lng: 120.9842 },
  { name: "Phuket", lat: 7.8804, lng: 98.3923 },

  // Europe
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Barcelona", lat: 41.3874, lng: 2.1686 },
  { name: "Rome", lat: 41.9028, lng: 12.4964 },
  { name: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Prague", lat: 50.0755, lng: 14.4378 },
  { name: "Vienna", lat: 48.2082, lng: 16.3738 },
  { name: "Budapest", lat: 47.4979, lng: 19.0402 },
  { name: "Florence", lat: 43.7696, lng: 11.2558 },
  { name: "Venice", lat: 45.4408, lng: 12.3155 },
  { name: "Santorini", lat: 36.3932, lng: 25.4615 },
  { name: "Lisbon", lat: 38.7223, lng: -9.1393 },
  { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Milan", lat: 45.4642, lng: 9.19 },
  { name: "Zurich", lat: 47.3769, lng: 8.5417 },
  { name: "Interlaken", lat: 46.6863, lng: 7.8632 },
  { name: "Edinburgh", lat: 55.9533, lng: -3.1883 },
  { name: "Dublin", lat: 53.3498, lng: -6.2603 },
  { name: "Stockholm", lat: 59.3293, lng: 18.0686 },
  { name: "Copenhagen", lat: 55.6761, lng: 12.5683 },
  { name: "Reykjavik", lat: 64.1466, lng: -21.9426 },
  { name: "Moscow", lat: 55.7558, lng: 37.6173 },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784 },
  { name: "Dubrovnik", lat: 42.6507, lng: 18.0944 },
  { name: "Santorini", lat: 36.3932, lng: 25.4615 },

  // North America
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { name: "Las Vegas", lat: 36.1699, lng: -115.1398 },
  { name: "Miami", lat: 25.7617, lng: -80.1918 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Vancouver", lat: 49.2827, lng: -123.1207 },
  { name: "Cancun", lat: 21.1619, lng: -86.8515 },
  { name: "Mexico City", lat: 19.4326, lng: -99.1332 },
  { name: "Havana", lat: 23.1136, lng: -82.3666 },
  { name: "Grand Canyon", lat: 36.1069, lng: -112.1129 },
  { name: "Chicago", lat: 41.8781, lng: -87.6298 },

  // South America
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
  { name: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  { name: "Lima", lat: -12.0464, lng: -77.0428 },
  { name: "Cusco", lat: -13.532, lng: -71.9675 },
  { name: "Santiago", lat: -33.4489, lng: -70.6693 },
  { name: "Cartagena", lat: 10.391, lng: -75.5144 },

  // Oceania
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Melbourne", lat: -37.8136, lng: 144.9631 },
  { name: "Auckland", lat: -36.8485, lng: 174.7633 },
  { name: "Queenstown", lat: -45.0312, lng: 168.6626 },

  // Africa
  { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
  { name: "Marrakech", lat: 31.6295, lng: -7.9811 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Nairobi", lat: -1.2921, lng: 36.8219 },
  { name: "Zanzibar", lat: -6.1659, lng: 39.2026 },
  { name: "Victoria Falls", lat: -17.9244, lng: 25.8567 },

  // Middle East
  { name: "Jerusalem", lat: 31.7683, lng: 35.2137 },
  { name: "Tel Aviv", lat: 32.0853, lng: 34.7818 },
  { name: "Abu Dhabi", lat: 24.4539, lng: 54.3773 },
  { name: "Doha", lat: 25.2854, lng: 51.531 },
];

export function searchCities(query: string): City[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return cities.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
}
