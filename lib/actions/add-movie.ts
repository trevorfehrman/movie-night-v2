"use server";

// import { MovieDetails, MovieDetailsSchema } from "../tmdb/get-movie-details";
import { MovieDetailsSchema } from "../tmdb/get-movie-details";
import { action } from "./safe-action";

export const safeAddMovie = action(MovieDetailsSchema, addMovie);

// async function addMovie(movieDetails: MovieDetails) {
async function addMovie() {}
