import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  int,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
  email: text("email").unique().notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  imgUrl: text("imgUrl").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  movieNightMovies: many(movieNightMovies),
}));

export const movieNightMovies = sqliteTable(
  "movie_night_movies",
  {
    id: text("id").primaryKey(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    userId: text("user")
      .notNull()
      .references(() => users.id),
    tmdbId: text("tmdb_id").notNull().unique(),
    director: text("director").notNull(),
    directorOfPhotography: text("director_of_photography"),
    year: int("year").notNull(),
    country: text("country").notNull(),
    budget: int("budget"),
    revenue: int("revenue"),
    runtime: int("runtime"),
    rouzies: text("rouzies"),
  },
  (table) => ({
    createdAtIndex: index("created_at_index").on(table.createdAt),
    userIdIndex: index("user_id_index").on(table.userId),
    directorIndex: index("director_index").on(table.director),
    directorOfPhotographyIndex: index("director_of_photography_index").on(
      table.directorOfPhotography,
    ),
    yearIndex: index("year_index").on(table.year),
    countryIndex: index("country_index").on(table.country),
  }),
);

export const movieNightMoviesRelations = relations(
  movieNightMovies,
  ({ one, many }) => ({
    user: one(users, {
      fields: [movieNightMovies.userId],
      references: [users.id],
    }),
    moviesToActors: many(moviesToActors),
  }),
);

export const moviesToActors = sqliteTable(
  "movies_to_actors",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => movieNightMovies.id, { onDelete: "cascade" }),
    actorId: text("actor_id")
      .notNull()
      .references(() => movieNightActors.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.movieId, table.actorId] }),
    movieIdIndex: index("movie_id_index").on(table.movieId),
    actorIdIndex: index("actor_id_index").on(table.actorId),
  }),
);

export const movieNightActors = sqliteTable(
  "actors",
  {
    id: text("id").primaryKey(),
    tmdbId: int("tmdb_id").notNull(),
    name: text("name").notNull(),
    movieNightMovieId: text("movie_night_movie_id")
      .notNull()
      .references(() => movieNightMovies.id, { onDelete: "cascade" }),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.name),
    tmdbIdIndex: index("tmdb_id_index").on(table.tmdbId),
    movieNightMovieIdIndex: index("movie_night_movie_id_index").on(
      table.movieNightMovieId,
    ),
  }),
);

export const movieNightActorsRelations = relations(
  movieNightActors,
  ({ many }) => ({
    movies: many(moviesToActors),
  }),
);

export const moviesToActorsRelations = relations(moviesToActors, ({ one }) => ({
  movie: one(movieNightMovies, {
    fields: [moviesToActors.movieId],
    references: [movieNightMovies.id],
  }),

  actors: one(movieNightActors, {
    fields: [moviesToActors.actorId],
    references: [movieNightActors.id],
  }),
}));

// actors
// genres
// keywords
// productionCompanies
// writers
// reactions? emojis likes etc.
