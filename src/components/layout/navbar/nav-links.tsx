"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  mobile?: boolean;
  onNavClick?: () => void;
}

export function NavLinks({ mobile, onNavClick }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex",
        mobile
          ? "flex-col gap-1"
          : "items-center gap-1",
      )}
    >
      {siteConfig.mainNav.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors",
              mobile
                ? "rounded-lg text-lg"
                : "rounded-full",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.title}
            {isActive && !mobile && (
              <span className="absolute inset-0 -z-10 rounded-full bg-accent" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
