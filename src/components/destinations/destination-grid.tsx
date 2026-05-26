import { FeaturedCard } from "./featured-card";
import { SmallCard } from "./small-card";
import {
  featuredDestination,
  smallDestinations,
  bottomDestinations,
} from "./destination-data";

export function DestinationGrid() {
  return (
    <div>
      {/* Top: Bento pair — featured + stacked */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 md:basis-[66%]">
          <FeaturedCard destination={featuredDestination} />
        </div>
        <div className="flex flex-1 flex-col gap-4 md:basis-[34%]">
          {smallDestinations.map((dest, i) => (
            <SmallCard
              key={dest.id}
              destination={dest}
              index={i}
              variant="stacked"
            />
          ))}
        </div>
      </div>

      {/* Bottom: gallery row */}
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {bottomDestinations.map((dest, i) => (
          <SmallCard
            key={dest.id}
            destination={dest}
            index={i + 2}
            variant="bottom"
          />
        ))}
      </div>
    </div>
  );
}
