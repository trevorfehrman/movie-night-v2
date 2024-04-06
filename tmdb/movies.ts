"use server";
import { env } from "process";
import { z } from "zod";

const MovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullish(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string().nullish(),
  popularity: z.number(),
  poster_path: z.string().nullish(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

const MovieSearchResponseSchema = z.object({
  page: z.number(),
  results: z.array(MovieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

// const searchMoviesUrl = 'https://api.themoviedb.org/3/search/movie?query=the%20godfather&include_adult=false&language=en-US&page=1';
const searchMoviesUrl = new URL(
  "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1",
);

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
  },
};

export async function searchMovies(query: string) {
  searchMoviesUrl.searchParams.set("query", query);
  const response = await fetch(searchMoviesUrl.toString(), options);
  const data = await response.json();
  const validatedData = MovieSearchResponseSchema.parse(data);
  return validatedData;
}
