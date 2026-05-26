export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
}

export const stats: Stat[] = [
  { id: "travelers", value: 10000, suffix: "+", label: "Travelers served" },
  { id: "destinations", value: 500, suffix: "+", label: "Destinations covered" },
  { id: "rating", value: 49, suffix: "", label: "Average rating", prefix: "4." },
  { id: "satisfaction", value: 99, suffix: "%", label: "Satisfaction rate" },
];

export const testimonials: Testimonial[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "Product Designer",
    location: "San Francisco, USA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
    quote:
      "The AI itinerary was spot-on. It found hidden gems I never would have discovered on my own. Every restaurant it recommended was incredible.",
  },
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    role: "Software Engineer",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    quote:
      "I've used three other travel planners this year. This one got my Tokyo trip perfect on the first try — including the jet-lag-friendly schedule.",
  },
  {
    id: "emilia-rodriguez",
    name: "Emilia Rodriguez",
    role: "Marketing Director",
    location: "Barcelona, Spain",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    quote:
      "It planned our entire honeymoon in Santorini. The sunset dinner reservation it booked was the highlight of our trip.",
  },
  {
    id: "daiki-tanaka",
    name: "Daiki Tanaka",
    role: "Photographer",
    location: "Tokyo, Japan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    rating: 4,
    quote:
      "The itinerary balanced sightseeing and free time perfectly. I had enough space to wander off and take photos without feeling rushed.",
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    role: "Consultant",
    location: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    rating: 5,
    quote:
      "I was skeptical about AI travel planning, but this changed my mind. The Kyoto itinerary included a tea ceremony class that became my favorite memory.",
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    role: "Architect",
    location: "Melbourne, Australia",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating: 5,
    quote:
      "Traveling with two kids is chaos. The AI planned kid-friendly activities alongside cultural spots. Best family vacation we've ever had.",
  },
];
