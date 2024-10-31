"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { MovieDetails, MovieDetailsSchema } from "../tmdb/get-movie-details";
import { action } from "./safe-action";
import { z } from "zod";
import { createCrewMap } from "../utils";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export const safeAddMovie = action(
  MovieDetailsSchema.merge(z.object({ userId: z.string() })),
  addMovie,
);

async function addMovie(movieDetails: MovieDetails & { userId: string }) {
  const { userId: clerkUserId, orgId, has } = await auth();

  if (!clerkUserId || !orgId || !has({ permission: "org:movie:create" })) {
    return;
  }

  const crewMap = createCrewMap(movieDetails.credits.crew);
  const { userId, id: tmdbId } = movieDetails;

  let director;
  let directorId;

  if (crewMap?.director && crewMap.director.id) {
    director = crewMap.director.name;
    directorId = crewMap.director.id;
  } else {
    throw new Error("No director found");
  }

  const year = Number(movieDetails.release_date.split("-")[0]);

  if (isNaN(year)) {
    throw new Error("Invalid year");
  }
  const posterPath = movieDetails.poster_path ?? "";
  const title = movieDetails.title;
  const country = movieDetails.production_countries[0].iso_3166_1;
  const budget = movieDetails.budget;
  const revenue = movieDetails.revenue;
  const runtime = movieDetails.runtime;
  const comp = crewMap.composer;
  const composer = comp?.name;
  const composerId = comp?.id;
  const dop = crewMap.directorOfPhotography;
  const directorOfPhotography = dop?.name;
  const directorOfPhotographyId = dop?.id;

  await db.transaction(async (tx) => {
    const payload = {
      id: String(tmdbId),
      userId,
      posterPath,
      title,
      director,
      directorId: String(directorId),
      directorOfPhotography,
      directorOfPhotographyId: String(directorOfPhotographyId),
      composer,
      composerId: String(composerId),
      year,
      country,
      budget,
      revenue,
      runtime,
    };

    // Insert movie
    const movieInsert = await tx
      .insert(schema.movies)
      .values(payload)
      .onConflictDoNothing()
      .returning({ movieId: schema.movies.id });

    // Get movieId
    const movieId = movieInsert[0].movieId;

    // Prepare actors and moviesToActors
    const cast = movieDetails.credits.cast.slice(0, 10).map((actor) => ({
      id: String(actor.id),
      name: actor.name,
    }));

    const moviesActors = cast.map((actor) => ({
      movieId,
      actorId: actor.id,
    }));

    // Insert actors and moviesToActors
    if (cast.length > 0) {
      await tx.insert(schema.actors).values(cast).onConflictDoNothing();
      await tx
        .insert(schema.moviesToActors)
        .values(moviesActors)
        .onConflictDoNothing();
    }

    // Prepare genres and moviesToGenres
    const genres = movieDetails.genres.map((genre) => ({
      id: String(genre.id),
      name: genre.name,
    }));

    const moviesGenres = genres.map((genre) => ({
      movieId,
      genreId: genre.id,
    }));

    // Insert genres and moviesToGenres
    if (genres.length > 0) {
      await tx.insert(schema.genres).values(genres).onConflictDoNothing();
      await tx
        .insert(schema.moviesToGenres)
        .values(moviesGenres)
        .onConflictDoNothing();
    }

    // Prepare keywords and moviesToKeywords
    const keywords = movieDetails.keywords.keywords.map((keyword) => ({
      id: String(keyword.id),
      name: keyword.name,
    }));

    const moviesKeywords = keywords.map((keyword) => ({
      movieId,
      keywordId: keyword.id,
    }));

    // Insert keywords and moviesToKeywords
    if (keywords.length > 0) {
      await tx.insert(schema.keywords).values(keywords).onConflictDoNothing();
      await tx
        .insert(schema.moviesToKeywords)
        .values(moviesKeywords)
        .onConflictDoNothing();
    }

    // Prepare writers and moviesToWriters
    const writers = crewMap.writers.map((writer) => ({
      id: String(writer.id),
      name: writer.name,
    }));

    const moviesWriters = writers.map((writer) => ({
      movieId,
      writerId: writer.id,
    }));

    // Insert writers and moviesToWriters
    if (writers.length > 0) {
      await tx.insert(schema.writers).values(writers).onConflictDoNothing();
      await tx
        .insert(schema.moviesToWriters)
        .values(moviesWriters)
        .onConflictDoNothing();
    }

    revalidatePath("/");

    return movieId;
  });
}
