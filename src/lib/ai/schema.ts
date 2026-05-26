import { z } from "zod";

export const itinerarySchema = z.object({
  title: z.string(),
  overview: z.string(),
  days: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      morning: z.array(z.string()),
      afternoon: z.array(z.string()),
      evening: z.array(z.string()),
      food: z.array(z.string()),
      hotel: z.string(),
      transportation: z.string(),
      route: z.array(
        z.object({
          lat: z.number(),
          lng: z.number(),
          label: z.string(),
        }),
      ),
    }),
  ),
});

export type Itinerary = z.infer<typeof itinerarySchema>;
