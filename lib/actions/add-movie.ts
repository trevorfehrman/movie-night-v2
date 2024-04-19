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

    const movieId = movieInsert[0].movieId;

    const cast = movieDetails.credits.cast.slice(0, 10).map((actor) => ({
      id: String(actor.id),
      movieId,
      name: actor.name,
    }));

    const moviesActors = cast.map((actor) => ({
      movieId,
      actorId: String(actor.id),
    }));

    console.log(cast.length, cast);
    console.log(moviesActors.length, moviesActors);

    await tx.insert(schema.actors).values(cast).onConflictDoNothing();

    await tx
      .insert(schema.moviesToActors)
      .values(moviesActors)
      .onConflictDoNothing();

    return movieId;
  });
}
// const x = await db.transaction(async (tx) => {
//   const movieInsert = await tx
//     .insert(schema.movies)
//     .values({
//       id: "1",
//       userId: "1",
//       tmdbId: 1,
//       director: "1",
//       year: 1,
//       country: "1",
//       budget: 1,
//       revenue: 1,
//       runtime: 1,
//       rouzies: "1",
//       composer: "1",
//       directorOfPhotography: "1",
//     })
//     .onConflictDoNothing()
//     .returning({ movieId: schema.movies.id });

//   const movieId = movieInsert[0].movieId;

//   const actorInsert = await tx
//     .insert(schema.actors)
//     .values([
//       { id: "1", movieId, name: "1", tmdbId: 1 },
//       { id: "2", movieId, name: "2", tmdbId: 2 },
//     ])
//     .onConflictDoNothing()
//     .returning({ actorId: schema.actors.id });

//   actorInsert.forEach(async (actor) => {
//     await tx
//       .insert(schema.moviesToActors)
//       .values({ movieId, actorId: actor.actorId })
//       .onConflictDoNothing();
//   });

//   const genreInsert = await tx
//     .insert(schema.genres)
//     .values([
//       { id: "1", name: "mystery", movieId },
//       { id: "1", name: "mystery", movieId },
//     ])
//     .onConflictDoNothing()
//     .returning({ genreId: schema.genres.id });

//   genreInsert.forEach(async (genre) => {
//     await tx
//       .insert(schema.moviesToGenres)
//       .values({ movieId, genreId: genre.genreId })
//       .onConflictDoNothing();
//   });

//   const keywordInsert = await tx
//     .insert(schema.keywords)
//     .values([
//       { id: "1", name: "mystery", movieId },
//       { id: "1", name: "mystery", movieId },
//     ])
//     .onConflictDoNothing()
//     .returning({ keywordId: schema.keywords.id });

//   keywordInsert.forEach(async (keyword) => {
//     await tx
//       .insert(schema.moviesToKeywords)
//       .values({ movieId, keywordId: keyword.keywordId })
//       .onConflictDoNothing();
//   });

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
