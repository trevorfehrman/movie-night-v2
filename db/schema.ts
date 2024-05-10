import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  int,
  index,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
  email: text("email").unique().notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  imgUrl: text("imgUrl").notNull(),
});

export const SelectUserSchema = createSelectSchema(users);

export const usersRelations = relations(users, ({ many }) => ({
  movies: many(movies),
}));

export const movies = sqliteTable(
  "movies",
  {
    id: text("id").primaryKey(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    posterPath: text("poster_path").notNull(),
    title: text("title").notNull(),
    director: text("director").notNull(),
    directorId: text("director_id").notNull(),
    directorOfPhotography: text("director_of_photography"),
    directorOfPhotographyId: text("director_of_photography_id"),
    composer: text("composer"),
    composerId: text("composer_id"),
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
    titleIndex: index("title_index").on(table.title),
    yearIndex: index("year_index").on(table.year),
    countryIndex: index("country_index").on(table.country),
  }),
);

export const InsertMovieSchema = createInsertSchema(movies);

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
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    name: text("name").notNull().unique(),
  },
  (table) => ({
    actorsNameIndex: index("actors_name_index").on(table.name),
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
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.movieId, table.actorId] }),
    moviesActorsMovieIdIndex: index("movies_actors_movie_id_index").on(
      table.movieId,
    ),
    mvoiesActorsActorIdIndex: index("movies_actors_actor_id_index").on(
      table.actorId,
    ),
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
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    name: text("name").notNull().unique(),
  },
  (table) => ({
    genresNameIndex: index("genres_name_index").on(table.name),
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
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.movieId, table.genreId] }),
    moviesGenresMovieIdIndex: index("movies_genres_movie_id_index").on(
      table.movieId,
    ),
    moviesGenresGenreIdIndex: index("movies_genres_genre_id_index").on(
      table.genreId,
    ),
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
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    name: text("name").notNull().unique(),
  },
  (table) => ({
    keywordsNameIndex: index("keywords_name_index").on(table.name),
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
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.movieId, table.keywordId] }),
    moviesKeywordsMovieIdIndex: index("movies_keywords_movie_id_index").on(
      table.movieId,
    ),
    moviesKeywordsKewordIdIndex: index("movies_keywords_keyword_id_index").on(
      table.keywordId,
    ),
  }),
);

export const moviesToKeywordsRelations = relations(
  moviesToKeywords,
  ({ one }) => ({
    movie: one(movies, {
      fields: [moviesToKeywords.movieId],
      references: [movies.id],
    }),

    keyword: one(keywords, {
      fields: [moviesToKeywords.keywordId],
      references: [keywords.id],
    }),
  }),
);

export const writers = sqliteTable(
  "writers",
  {
    id: text("id").primaryKey(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    name: text("name").notNull().unique(),
  },
  (table) => ({
    writersNameIndex: index("writers_name_index").on(table.name),
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
      .references(() => writers.id, { onDelete: "cascade" }),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.movieId, table.writerId] }),
    moviesWritersMovieIdIndex: index("movies_writers_movie_id_index").on(
      table.movieId,
    ),
    moviesWritersWriterIdIndex: index("movies_writers_writer_id_index").on(
      table.writerId,
    ),
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
