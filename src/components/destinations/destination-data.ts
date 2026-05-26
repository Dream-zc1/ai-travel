export interface Destination {
  id: string;
  city: string;
  country: string;
  image: string;
  tags: string[];
  rating: number;
  description: string;
}

export const featuredDestination: Destination = {
  id: "paris",
  city: "Paris",
  country: "France",
  image:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=85",
  tags: ["Culture", "Romance", "Food"],
  rating: 4.8,
  description:
    "From the Eiffel Tower to hidden bistros, experience the city of light like never before.",
};

export const smallDestinations: Destination[] = [
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80",
    tags: ["Tradition", "Tech"],
    rating: 4.9,
    description: "",
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "UAE",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    tags: ["Luxury", "Modern"],
    rating: 4.7,
    description: "",
  },
];

export const bottomDestinations: Destination[] = [
  {
    id: "bali",
    city: "Bali",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    tags: ["Nature", "Wellness"],
    rating: 4.9,
    description: "",
  },
  {
    id: "santorini",
    city: "Santorini",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    tags: ["Scenic", "Romance"],
    rating: 4.8,
    description: "",
  },
  {
    id: "kyoto",
    city: "Kyoto",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
    tags: ["Temples", "Culture"],
    rating: 4.8,
    description: "",
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    tags: ["History", "Arts"],
    rating: 4.6,
    description: "",
  },
];
