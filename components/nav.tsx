"use client";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Film, Search, UserCog, LoaderPinwheel } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Routes } from "@/lib/routes";
import { Protect } from "@clerk/nextjs";

export function Nav() {
  const pathname = usePathname();
  return (
    <TooltipProvider>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href={Routes.home()}
          className={cn(
            "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground outline-ring md:h-8 md:w-8 md:text-base",
            pathname === "/"
              ? "bg-primary"
              : "text-muted-foreground transition-colors hover:text-foreground",
          )}
        >
          <Film className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Link>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={Routes.searchMovies()}
              className={cn(
                "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground outline-ring md:h-8 md:w-8 md:text-base",
                pathname === "/search-movies"
                  ? "bg-primary"
                  : "text-muted-foreground transition-colors hover:text-foreground",
              )}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search Movies</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Search Movies</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={Routes.spinner()}
              className={cn(
                "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground outline-ring md:h-8 md:w-8 md:text-base",
                pathname === "/spinner"
                  ? "bg-primary"
                  : "text-muted-foreground transition-colors hover:text-foreground",
              )}
            >
              <LoaderPinwheel className="h-5 w-5" />
              <span className="sr-only">Spinner</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Spinner</TooltipContent>
        </Tooltip>
        <Protect permission="org:movie:create">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={Routes.adminDashboard()}
                className={cn(
                  "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground outline-ring md:h-8 md:w-8 md:text-base",
                  pathname === "/admin-dashboard"
                    ? "bg-primary"
                    : "text-muted-foreground transition-colors hover:text-foreground",
                )}
              >
                <UserCog className="h-5 w-5" />
                <span className="sr-only">Admin</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Admin Dashboard</TooltipContent>
          </Tooltip>
        </Protect>
      </nav>
      {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground outline-ring transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav> */}
    </TooltipProvider>
  );
}
