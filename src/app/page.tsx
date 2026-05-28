import { Hero } from "@/components/hero";
import { Experiences } from "@/components/experiences";
import { Planner } from "@/components/planner";
import { MyGlobe } from "@/components/globe";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { PlannerProvider } from "@/components/planner/planner-context";

function SectionDivider() {
  return (
    <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent opacity-30" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PlannerProvider>
      <Hero />
      <SectionDivider />
      <Experiences />
      <Planner />
      <SectionDivider />
      <MyGlobe />
      <SectionDivider />
      <CTA />
      <Footer />
    </PlannerProvider>
  );
}
