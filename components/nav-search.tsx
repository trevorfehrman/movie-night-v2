"use client";
import * as React from "react";
import { CommandIcon, LoaderCircle, Plus, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes";

export function NavSearch() {
  const router = useRouter();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check if Command + K were pressed together
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault(); // Prevent the default action
        inputRef.current?.focus(); // Focus the input element
      }
    }
    // Attach the event listener to window for keydown events
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative ml-auto flex flex-1 gap-x-4 md:grow-0">
      {pending ? (
        <LoaderCircle className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-primary" />
      ) : (
        <span className="pointer-events-none absolute right-2.5 top-2.5 flex items-center justify-center gap-x-2 text-muted-foreground">
          <CommandIcon className="h-3 w-3" /> <Plus className="h-3 w-3" />{" "}
          <p className="text-sm font-semibold">K</p>
        </span>
      )}
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        disabled={pending}
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
