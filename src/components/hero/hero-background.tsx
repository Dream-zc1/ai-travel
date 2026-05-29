export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Light mode image */}
      <div
        className="absolute inset-0 bg-cover bg-center dark:hidden"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80")',
        }}
      />

      {/* Dark mode image */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center dark:block"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80")',
        }}
      />

      {/* Overlay — light mode: subtle dark gradient to preserve photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent dark:hidden" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 dark:hidden" />

      {/* Overlay — dark mode: cinematic fade to background */}
      <div className="absolute inset-0 hidden bg-gradient-to-t from-background via-background/60 to-background/20 dark:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-background/20 via-transparent to-background/20 dark:block" />

      {/* Bottom fade to background */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
