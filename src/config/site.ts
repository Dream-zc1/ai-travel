export const siteConfig = {
  name: "AI Travel",
  description: "AI-powered travel planning — smarter trips, less hassle.",
  url: "https://aitravel.com",
  ogImage: "/images/og.png",
  links: {
    github: "https://github.com/your-org/ai-travel",
  },
  mainNav: [
    { title: "游客返图", href: "#reviews" },
    { title: "AI行程", href: "#planner-section" },
    { title: "我的足迹", href: "#globe-section" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
