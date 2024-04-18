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
  movies: many(movies),
}));

export const movies = sqliteTable(
  "movies",
  {
    id: text("id").primaryKey(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    userId: text("user")
      .notNull()
      .references(() => users.id),
    tmdbId: int("tmdb_id").notNull().unique(),
    director: text("director").notNull(),
    directorOfPhotography: text("director_of_photography"),
    composer: text("composer"),
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

export const moviesRelations = relations(movies, ({ one, many }) => ({
  user: one(users, {
    fields: [movies.userId],
    references: [users.id],
  }),
  actors: many(moviesToActors),
  genres: many(moviesToGenres),
  keywords: many(moviesToKeywords),
  writers: many(moviesToWriters),
}));

export const actors = sqliteTable(
  "actors",
  {
    id: text("id").primaryKey(),
    createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
    tmdbId: int("tmdb_id").notNull().unique(),
    name: text("name").notNull().unique(),
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.name),
    tmdbIdIndex: index("tmdb_id_index").on(table.tmdbId),
  }),
);

export const actorsRelations = relations(actors, ({ many }) => ({
  movies: many(moviesToActors),
}));

export const moviesToActors = sqliteTable(
  "movies_to_actors",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    actorId: text("actor_id")
      .notNull()
      .references(() => actors.id, { onDelete: "cascade" }),
    createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.movieId, table.actorId] }),
    movieIdIndex: index("movie_id_index").on(table.movieId),
    actorIdIndex: index("actor_id_index").on(table.actorId),
  }),
);

export const moviesToActorsRelations = relations(moviesToActors, ({ one }) => ({
  movie: one(movies, {
    fields: [moviesToActors.movieId],
    references: [movies.id],
  }),

  actor: one(actors, {
    fields: [moviesToActors.actorId],
    references: [actors.id],
  }),
}));

export const genres = sqliteTable(
  "genres",
  {
    id: text("id").primaryKey(),
    createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
    name: text("name").notNull().unique(),
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.name),
    movieIdIndex: index("movie_id_index").on(table.movieId),
  }),
);

export const genresRelations = relations(genres, ({ many }) => ({
  movies: many(moviesToGenres),
}));

export const moviesToGenres = sqliteTable(
  "movies_to_genres",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    genreId: text("genre_id")
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
    createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.movieId, table.genreId] }),
    movieIdIndex: index("movie_id_index").on(table.movieId),
    genreIdIndex: index("genre_id_index").on(table.genreId),
  }),
);

export const moviesToGenresRelations = relations(moviesToGenres, ({ one }) => ({
  movie: one(movies, {
    fields: [moviesToGenres.movieId],
    references: [movies.id],
  }),

  genre: one(genres, {
    fields: [moviesToGenres.genreId],
    references: [genres.id],
  }),
}));

export const keywords = sqliteTable(
  "keywords",
  {
    id: text("id").primaryKey(),
    createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
    name: text("name").notNull().unique(),
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.name),
    movieIdIndex: index("movie_id_index").on(table.movieId),
  }),
);

export const keyWordsRelations = relations(keywords, ({ many }) => ({
  movies: many(moviesToKeywords),
}));

export const moviesToKeywords = sqliteTable(
  "movies_to_keywords",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    keywordId: text("keywords_id")
      .notNull()
      .references(() => keywords.id, { onDelete: "cascade" }),
    createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.movieId, table.keywordId] }),
    movieIdIndex: index("movie_id_index").on(table.movieId),
    keywordIdIndex: index("genre_id_index").on(table.keywordId),
  }),
);

export const moviesToKeywordsRelations = relations(
  moviesToKeywords,
  ({ one }) => ({
    movie: one(movies, {
      fields: [moviesToKeywords.movieId],
      references: [movies.id],
    }),

    genre: one(keywords, {
      fields: [moviesToKeywords.keywordId],
      references: [keywords.id],
    }),
  }),
);

export const writers = sqliteTable(
  "writers",
  {
    id: text("id").primaryKey(),
    createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
    tmdbId: int("tmdb_id").notNull().unique(),
    name: text("name").notNull().unique(),
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.name),
    tmdbIdIndex: index("tmdb_id_index").on(table.tmdbId),
    movieNightMovieIdIndex: index("movie_id_index").on(table.movieId),
  }),
);

export const writersRelations = relations(writers, ({ many }) => ({
  movies: many(moviesToWriters),
}));

export const moviesToWriters = sqliteTable(
  "movies_to_writers",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    writerId: text("writer_id")
      .notNull()
      .references(() => actors.id, { onDelete: "cascade" }),
    createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.movieId, table.writerId] }),
    movieIdIndex: index("movie_id_index").on(table.movieId),
    writerIdIndex: index("writer_id_index").on(table.writerId),
  }),
);

export const moviesToWritersRelations = relations(
  moviesToWriters,
  ({ one }) => ({
    movie: one(movies, {
      fields: [moviesToWriters.movieId],
      references: [movies.id],
    }),

    writer: one(writers, {
      fields: [moviesToWriters.writerId],
      references: [writers.id],
    }),
  }),
);
