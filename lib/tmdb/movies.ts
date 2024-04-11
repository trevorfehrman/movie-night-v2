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
const MovieCastSchema = z.object({
  adult: z.boolean(),
  gender: z.number().int(),
  id: z.number().int(),
  known_for_department: z.string(),
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullish(),
  cast_id: z.number().int(),
  character: z.string(),
  credit_id: z.string(),
  order: z.number().int(),
});

const MovieCrewSchema = z.object({
  adult: z.boolean(),
  gender: z.number().int(),
  id: z.number().int(),
  known_for_department: z.string(),
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
  credit_id: z.string(),
  department: z.string(),
  job: z.string(),
});

const MovieKeywordsSchema = z.object({
  keywords: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
});

const MovieVideoSchema = z.object({
  iso_639_1: z.string(),
  iso_3166_1: z.string(),
  name: z.string(),
  key: z.string(),
  site: z.string(),
  size: z.number().int(),
  type: z.string(),
  official: z.boolean(),
  published_at: z.string().datetime(),
  id: z.string(),
});

const MovieDetailsSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullish(),
  belongs_to_collection: z.union([z.null(), z.any()]),
  budget: z.number(),
  genres: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
  homepage: z.string(),
  id: z.number(),
  imdb_id: z.string().nullish(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string().nullish(),
      name: z.string(),
      origin_country: z.string(),
    }),
  ),
  production_countries: z.array(
    z.object({
      iso_3166_1: z.string(),
      name: z.string(),
    }),
  ),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  spoken_languages: z.array(
    z.object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    }),
  ),
  status: z.string(),
  tagline: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
  keywords: MovieKeywordsSchema,
  credits: z.object({
    cast: z.array(MovieCastSchema),
    crew: z.array(MovieCrewSchema),
  }),
  videos: z.object({
    results: z.array(MovieVideoSchema),
  }),
});

export async function getMovieDetails({ movieId }: { movieId?: string }) {
  if (!movieId) {
    return;
  }

  const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits%2Ckeywords%2Cvideos&language=en-US`;
  const response = await fetch(movieDetailsUrl, options);

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();

  try {
    const validatedData = MovieDetailsSchema.parse(data);
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Error validating data", error.issues);
    }
  }
}
