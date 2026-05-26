"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="hidden h-8 w-20 animate-pulse rounded-full bg-primary/10 md:block" />
    );
  }

  if (session?.user) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <span className="max-w-24 truncate text-xs text-muted-foreground">
          {session.user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full border border-border/30 px-3.5 py-1.5 text-xs text-muted-foreground/70 transition-colors hover:border-primary/30 hover:text-foreground"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-block"
    >
      Login
    </Link>
  );
}
