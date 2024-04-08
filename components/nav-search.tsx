"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { Routes } from "@/lib/routes";

export function NavSearch() {
  const router = useRouter();

  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="relative ml-auto flex flex-1 gap-x-4 md:grow-0">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        onChange={(e) =>
          inputRef.current && (inputRef.current.value = e.target.value)
        }
        value={inputRef.current?.value}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.push(
              Routes.searchMovies(
                {},
                {
                  search: { query: inputRef.current?.value, page: String(1) },
                },
              ),
            );
            inputRef.current && (inputRef.current.value = "");
          }
        }}
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
      <Button
        variant="default"
        size="icon"
        className="min-w-10"
        onClick={() => {
          router.push(
            "/" +
              Routes.searchMovies(
                {},
                { search: { query: inputRef.current?.value, page: String(1) } },
              ),
          );
          inputRef.current && (inputRef.current.value = "");
        }}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
