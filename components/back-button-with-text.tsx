"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function BackButtonWithText() {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4">
      <Button
        id="back-button"
        variant="outline"
        size="icon"
        className="h-7 w-7"
        role="link"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>
      <label
        htmlFor="back-button"
        className="flex-1 shrink-0 cursor-pointer whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0"
      >
        Back
      </label>
    </div>
  );
}
