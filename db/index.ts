import "dotenv/config";
import * as schema from "./schema";

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { env } from "@/env";
const client = createClient({
  url: env.TURSO_CONNECTION_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});
export const db = drizzle(client, { schema });

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
