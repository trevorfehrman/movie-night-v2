"use client";
import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export function NavSearch() {
  const router = useRouter();

  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        onChange={(e) =>
          inputRef.current && (inputRef.current.value = e.target.value)
        }
        value={inputRef.current?.value}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.push(`/search-movies?query=${inputRef.current?.value}`);
            inputRef.current && (inputRef.current.value = "");
          }
        }}
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
    </div>
  );
}
