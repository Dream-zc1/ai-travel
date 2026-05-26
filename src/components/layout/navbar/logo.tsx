import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  mobile?: boolean;
}

export function Logo({ mobile }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-lg font-semibold tracking-tight",
        "text-foreground",
        mobile && "text-xl",
      )}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="14" cy="14" r="14" className="fill-primary" />
        <path
          d="M9 14.5L12.5 18L19 10"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      AI Travel
    </Link>
  );
}
