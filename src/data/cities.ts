export interface City {
  name: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  emoji: string;
  date?: string;
}

export const POPULAR_CITIES: City[] = [
  { name: "New York", country: "USA", coordinates: [-74.006, 40.7128], emoji: "🗽" },
  { name: "London", country: "UK", coordinates: [-0.1276, 51.5074], emoji: "🇬🇧" },
  { name: "Paris", country: "France", coordinates: [2.3522, 48.8566], emoji: "🗼" },
  { name: "Tokyo", country: "Japan", coordinates: [139.6917, 35.6895], emoji: "🗾" },
  { name: "Sydney", country: "Australia", coordinates: [151.2093, -33.8688], emoji: "🦘" },
  { name: "Dubai", country: "UAE", coordinates: [55.2708, 25.2048], emoji: "🏙️" },
  { name: "Rome", country: "Italy", coordinates: [12.4964, 41.9028], emoji: "🏛️" },
  { name: "Bangkok", country: "Thailand", coordinates: [100.5018, 13.7563], emoji: "🛕" },
  { name: "Barcelona", country: "Spain", coordinates: [2.1734, 41.3851], emoji: "🇪🇸" },
  { name: "Istanbul", country: "Turkey", coordinates: [28.9784, 41.0082], emoji: "🕌" },
  { name: "Singapore", country: "Singapore", coordinates: [103.8198, 1.3521], emoji: "🇸🇬" },
  { name: "Los Angeles", country: "USA", coordinates: [-118.2437, 34.0522], emoji: "🎬" },
  { name: "Berlin", country: "Germany", coordinates: [13.405, 52.52], emoji: "🇩🇪" },
  { name: "Amsterdam", country: "Netherlands", coordinates: [4.9041, 52.3676], emoji: "🌷" },
  { name: "Seoul", country: "South Korea", coordinates: [126.978, 37.5665], emoji: "🇰🇷" },
  { name: "Mumbai", country: "India", coordinates: [72.8777, 19.076], emoji: "🇮🇳" },
  { name: "Cairo", country: "Egypt", coordinates: [31.2357, 30.0444], emoji: "🏺" },
  { name: "Rio de Janeiro", country: "Brazil", coordinates: [-43.1729, -22.9068], emoji: "🎭" },
  { name: "Cape Town", country: "South Africa", coordinates: [18.4241, -33.9249], emoji: "🌍" },
  { name: "Mexico City", country: "Mexico", coordinates: [-99.1332, 19.4326], emoji: "🇲🇽" },
  { name: "Lisbon", country: "Portugal", coordinates: [-9.1393, 38.7223], emoji: "🇵🇹" },
  { name: "Prague", country: "Czech Republic", coordinates: [14.4378, 50.0755], emoji: "🏰" },
  { name: "Vienna", country: "Austria", coordinates: [16.3738, 48.2082], emoji: "🎵" },
  { name: "Buenos Aires", country: "Argentina", coordinates: [-58.3816, -34.6037], emoji: "🇦🇷" },
  { name: "Marrakech", country: "Morocco", coordinates: [-7.9811, 31.6295], emoji: "🕌" },
  { name: "Reykjavik", country: "Iceland", coordinates: [-21.8174, 64.1466], emoji: "🧊" },
  { name: "Havana", country: "Cuba", coordinates: [-82.3666, 23.1136], emoji: "🇨🇺" },
  { name: "Nairobi", country: "Kenya", coordinates: [36.8219, -1.2921], emoji: "🦁" },
  { name: "Athens", country: "Greece", coordinates: [23.7275, 37.9838], emoji: "🏛️" },
  { name: "Hong Kong", country: "Hong Kong", coordinates: [114.1694, 22.3193], emoji: "🌃" },
  { name: "Taipei", country: "Taiwan", coordinates: [121.5654, 25.033], emoji: "🇹🇼" },
];
