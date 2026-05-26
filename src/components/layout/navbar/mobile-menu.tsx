"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function MobileMenu() {
  const { data: session } = useSession();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Main navigation links and theme toggle
        </SheetDescription>
        <div className="mt-8 flex flex-1 flex-col gap-8">
          <Logo mobile />
          <NavLinks mobile onNavClick={() => {}} />
        </div>
        <div className="space-y-4 border-t pt-4">
          {session?.user ? (
            <div className="flex items-center justify-between">
              <span className="max-w-40 truncate text-sm text-muted-foreground">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="block rounded-full bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
            >
              Login
            </Link>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
