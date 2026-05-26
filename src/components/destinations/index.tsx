import { SectionHeader } from "./section-header";
import { DestinationGrid } from "./destination-grid";

export function Destinations() {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader />
        <DestinationGrid />
      </div>
    </section>
  );
}
