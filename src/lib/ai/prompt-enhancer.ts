export function enhancePrompt(input: string) {
  const trimmed = input.trim();

  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();

  // already detailed enough
  if (trimmed.length > 80) {
    return trimmed;
  }

  // Japan
  if (lower.includes("japan") || lower.includes("tokyo")) {
    return `
7-day immersive Japan itinerary focused on:
- authentic ramen spots
- anime culture
- hidden cafes
- modern Tokyo experiences
- scenic train rides
- local nightlife
- cinematic travel moments
`;
  }

  // Paris
  if (lower.includes("paris")) {
    return `
5-day romantic Paris getaway featuring:
- boutique hotels
- luxury cafes
- art museums
- sunset photography spots
- fine dining
- hidden local streets
`;
  }

  // Thailand
  if (lower.includes("thailand")) {
    return `
10-day Thailand backpacking adventure including:
- island hopping
- night markets
- local street food
- affordable stays
- tropical beaches
- hidden temples
`;
  }

  // Switzerland
  if (lower.includes("switzerland")) {
    return `
7-day Swiss Alps wellness retreat featuring:
- panoramic train rides
- luxury spas
- mountain villages
- scenic hiking
- premium resorts
- cinematic landscapes
`;
  }

  // generic fallback
  return `
Create a premium travel itinerary for:

${trimmed}

Include:
- hidden gems
- local food
- realistic pacing
- morning / afternoon / evening sections
- premium recommendations
`;
}
