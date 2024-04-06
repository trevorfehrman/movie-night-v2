"use client";

import { Film, PanelLeft, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
              pathname === "/" && "text-foreground",
            )}
          >
            <Film
              className={cn("h-5 w-5", pathname === "/" && "text-primary")}
            />
            Home
          </Link>
          <Link
            href="/search-movies"
            className={cn(
              "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
              pathname === "/search-movies" && "text-foreground",
            )}
          >
            <Search
              className={cn(
                "h-5 w-5",
                pathname === "/search-movies" && "text-primary",
              )}
            />
            Search
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
