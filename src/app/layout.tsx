import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { BackToTop } from "@/components/back-to-top";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <Providers>
          <Navbar />
          <main className="flex flex-1 flex-col pt-16">{children}</main>
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
