"use client";
import * as React from "react";
import { CommandIcon, LoaderCircle, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function NavSearch() {
  const router = useRouter();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [showKeyboardShortcut, setShowKeyboardShortcut] = React.useState(true);

  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="group relative ml-auto flex flex-1 gap-x-4 md:grow-0">
      {pending ? (
        <LoaderCircle className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-primary" />
      ) : (
        <>
          {/* Show the shortcut when input is not focused */}
          {showKeyboardShortcut && (
            <span
              className={cn(
                "pointer-events-none absolute right-2.5 top-2.5 flex items-center justify-center gap-x-2 text-muted-foreground",
                // Hide the shortcut when input is hovered and populated with text
                searchTerm && "group-hover:hidden",
              )}
            >
              <CommandIcon className="h-3 w-3" />
              <p className="text-sm font-semibold">K</p>
            </span>
          )}
        </>
      )}
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        disabled={pending}
        onFocus={() => setShowKeyboardShortcut(false)}
        onBlur={() => setShowKeyboardShortcut(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            startTransition(() => {
              setSearchTerm("");
              router.push(
                Routes.searchMovies(
                  {},
                  {
                    search: { query: searchTerm, page: String(1) },
                  },
                ),
              );
            });
          }
        }}
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
    </div>
  );
}
