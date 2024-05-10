"use server";

import { z } from "zod";
import { action } from "./safe-action";
import { InsertMovieSchema, movies } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";

export const safeUpdateMovie = action(InsertMovieSchema, updateMovie);

async function updateMovie(movie: z.infer<typeof InsertMovieSchema>) {
  const { userId: clerkUserId, orgId, has } = auth();

  if (!clerkUserId || !orgId || !has({ permission: "org:movie:create" })) {
    return;
  }

  await db.insert(movies).values(movie).onConflictDoUpdate({
    target: movies.id,
    set: movie,
  });
}
