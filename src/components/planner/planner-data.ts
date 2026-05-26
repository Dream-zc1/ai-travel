export interface Activity {
  time: string;
  title: string;
  description: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  activities: Activity[];
  hotel: string;
  budgetEstimate: string;
}

export interface GeneratedPlan {
  id: string;
  destination: string;
  duration: string;
  tagline: string;
  days: DayPlan[];
}

export interface ExamplePrompt {
  id: string;
  text: string;
}

export const samplePlan: GeneratedPlan = {
  id: "barcelona-food",
  destination: "Barcelona",
  duration: "3 Days",
  tagline: "A food lover's weekend in Catalonia",
  days: [
    {
      dayNumber: 1,
      title: "Arrival & Gothic Quarter",
      activities: [
        { time: "10:00", title: "Arrive at Barcelona-El Prat Airport", description: "" },
        { time: "12:00", title: "Check into Hotel Arts Barcelona", description: "Luxury seaside hotel with rooftop pool" },
        { time: "13:30", title: "Lunch at La Boqueria Market", description: "Sample jamon iberico and fresh seafood" },
        { time: "15:00", title: "Wander Gothic Quarter", description: "Explore narrow medieval streets and hidden plazas" },
        { time: "20:00", title: "Dinner at Tickets Bar", description: "Michelin-starred tapas experience" },
      ],
      hotel: "Hotel Arts Barcelona",
      budgetEstimate: "$250–300",
    },
    {
      dayNumber: 2,
      title: "Modernist Marvels & Local Flavors",
      activities: [
        { time: "09:00", title: "Visit Sagrada Familia", description: "Gaudí's unfinished masterpiece" },
        { time: "11:30", title: "Walk Passeig de Gràcia", description: "See Casa Batlló and La Pedrera" },
        { time: "13:00", title: "Lunch at Cal Pep", description: "Iconic seafood tapas bar in El Born" },
        { time: "15:00", title: "Cooking Class", description: "Learn to make paella and crema catalana" },
        { time: "21:00", title: "Flamenco Show at Tablao Cordobés", description: "Traditional flamenco with dinner" },
      ],
      hotel: "Hotel Arts Barcelona",
      budgetEstimate: "$200–250",
    },
    {
      dayNumber: 3,
      title: "Markets & Departure",
      activities: [
        { time: "09:00", title: "Breakfast at Federal Café", description: "Specialty coffee and pastries" },
        { time: "10:30", title: "Explore El Born District", description: "Boutique shopping and street art" },
        { time: "12:30", title: "Final Lunch at Can Culleretes", description: "Barcelona's oldest restaurant (est. 1786)" },
        { time: "14:30", title: "Transfer to Airport", description: "" },
      ],
      hotel: "N/A (checkout)",
      budgetEstimate: "$100–150",
    },
  ],
};

export const examplePrompts: ExamplePrompt[] = [
  { id: "1", text: "A weekend in Barcelona for food lovers" },
  { id: "2", text: "10-day Japan itinerary: culture, tech, nature" },
  { id: "3", text: "Honeymoon in Santorini on a budget" },
  { id: "4", text: "Digital nomad guide to Chiang Mai" },
];
