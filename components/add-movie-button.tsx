"use client";
import { Check, Loader, Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Button } from "./ui/button";
import { safeAddMovie } from "@/lib/actions/add-movie";
import { MovieDetails } from "@/lib/tmdb/get-movie-details";
import { useOrganization } from "@clerk/nextjs";

export function AddMovieButton({
  movieDetails,
  userId,
}: {
  movieDetails: MovieDetails;
  userId: string;
}) {
  const { execute, result, status } = useAction(safeAddMovie);
  const thing = useOrganization();
  console.log(thing);
  return (
    <>
      <Button
        variant={status === "hasSucceeded" ? "default" : "outline"}
        size="icon"
        onClick={() => execute({ ...movieDetails, userId })}
      >
        {status === "idle" && <Plus />}
        {status === "executing" && <Loader />}
        {status === "hasSucceeded" && <Check />}
        {status === "hasErrored" && <Check />}
      </Button>
      {result.data && <div>Data: {result.data}</div>}
      {result.fetchError && <div>Fetch Error: {result.fetchError}</div>}
      {result.validationErrors && (
        <pre>{JSON.stringify(result.validationErrors, null, 2)}</pre>
      )}
    </>
  );
}
