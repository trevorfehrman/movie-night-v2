"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { MovieDetails, MovieDetailsSchema } from "../tmdb/get-movie-details";
import { action } from "./safe-action";
import { z } from "zod";
import { createCrewMap } from "../utils";

export const safeAddMovie = action(
  MovieDetailsSchema.merge(z.object({ userId: z.string() })),
  addMovie,
);

async function addMovie(movieDetails: MovieDetails & { userId: string }) {
  const crewMap = createCrewMap(movieDetails.credits.crew);
  const { userId, id: tmdbId } = movieDetails;

  let director;

  if (crewMap?.director) {
    director = crewMap.director;
  } else {
    throw new Error("No director found");
  }

  const year = Number(movieDetails.release_date.split("-")[0]);

  if (isNaN(year)) {
    throw new Error("Invalid year");
  }
  const title = movieDetails.title;
  const country = movieDetails.production_countries[0].iso_3166_1;
  const budget = movieDetails.budget;
  const revenue = movieDetails.revenue;
  const runtime = movieDetails.runtime;
  const composer = crewMap.composer;
  const directorOfPhotography = crewMap.directorOfPhotography;

  await db.transaction(async (tx) => {
    // Insert movie
    const movieInsert = await tx
      .insert(schema.movies)
      .values({
        id: String(tmdbId),
        userId,
        title,
        director,
        year,
        country,
        budget,
        revenue,
        runtime,
        composer,
        directorOfPhotography,
      })
      .onConflictDoNothing()
      .returning({ movieId: schema.movies.id });

    // Get movieId
    const movieId = movieInsert[0].movieId;

    // Prepare actors and moviesToActors
    const cast = movieDetails.credits.cast.slice(0, 10).map((actor) => ({
      id: String(actor.id),
      movieId,
      name: actor.name,
    }));

    const moviesActors = cast.map((actor) => ({
      movieId,
      actorId: String(actor.id),
    }));

    // Insert actors and moviesToActors
    await tx.insert(schema.actors).values(cast).onConflictDoNothing();
    await tx
      .insert(schema.moviesToActors)
      .values(moviesActors)
      .onConflictDoNothing();

    // Prepare genres and moviesToGenres
    const genres = movieDetails.genres.map((genre) => ({
      id: String(genre.id),
      name: genre.name,
    }));

    const moviesGenres = genres.map((genre) => ({
      movieId,
      genreId: String(genre.id),
    }));

    // Insert genres and moviesToGenres
    await tx.insert(schema.genres).values(genres).onConflictDoNothing();
    await tx
      .insert(schema.moviesToGenres)
      .values(moviesGenres)
      .onConflictDoNothing();

    // Prepare keywords and moviesToKeywords
    const keywords = movieDetails.keywords.keywords.map((keyword) => ({
      id: String(keyword.id),
      name: keyword.name,
    }));

    const moviesKeywords = keywords.map((keyword) => ({
      movieId,
      keywordId: String(keyword.id),
    }));

    // Insert keywords and moviesToKeywords
    await tx.insert(schema.keywords).values(keywords).onConflictDoNothing();
    await tx
      .insert(schema.moviesToKeywords)
      .values(moviesKeywords)
      .onConflictDoNothing();

    return movieId;
  });
}

//   const writerInsert = await tx
//     .insert(schema.writers)
//     .values([
//       { id: "1", name: "mystery", movieId, tmdbId: 1 },
//       { id: "1", name: "mystery", movieId, tmdbId: 1 },
//     ])
//     .onConflictDoNothing()
//     .returning({ writerId: schema.writers.id });

//   writerInsert.forEach(async (writer) => {
//     await tx
//       .insert(schema.moviesToWriters)
//       .values({ movieId, writerId: writer.writerId })
//       .onConflictDoNothing();
//   });

//   return movieId;
// });
