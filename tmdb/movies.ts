"use server";
import { env } from "process";
import { z } from "zod";

const MovieSearchResultSchema = z.object({
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

export type MovieSearchResult = z.infer<typeof MovieSearchResultSchema>;

const MovieSearchResponseSchema = z.object({
  page: z.number(),
  results: z.array(MovieSearchResultSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

// const searchMoviesUrl = 'https://api.themoviedb.org/3/search/movie?query=the%20godfather&include_adult=false&language=en-US&page=1';

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
  },
};

export async function searchMovies({
  query,
  page,
}: {
  query?: string;
  page?: string;
}) {
  const searchMoviesUrl = new URL(
    `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US`,
  );
  if (!query || !page) {
    return { page: 0, results: [], total_pages: 0, total_results: 0 };
  }
  searchMoviesUrl.searchParams.set("query", query);
  searchMoviesUrl.searchParams.set("page", page);
  const response = await fetch(searchMoviesUrl.toString(), options);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();

  try {
    const validatedData = MovieSearchResponseSchema.parse(data);
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Error validating data", error.issues);
    }
  }
}
