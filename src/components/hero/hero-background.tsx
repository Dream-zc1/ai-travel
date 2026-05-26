import Image from "next/image";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Image */}
      <Image
        src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=85"
        alt="Travel destination"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />

      {/* Bottom fade for content readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
