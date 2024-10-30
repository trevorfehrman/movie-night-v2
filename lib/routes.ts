import { z } from "zod";
import { makeRoute } from "./make-route";

export const SearchMoviesSearchParams = z.object({
  query: z.string().optional(),
  page: z.string().optional(),
});

export const Routes = {
  home: makeRoute(() => `/`, z.object({})),
  searchMovies: makeRoute(
    () => `/search-movies`,
    z.object({}),
    SearchMoviesSearchParams,
  ),
  movieDetails: makeRoute(
    ({ movieId }) => `/movie-details/${movieId}`,
    z.object({ movieId: z.string() }),
  ),
  talentDetails: makeRoute(
    ({ talentId }) => `/talent-details/${talentId}`,
    z.object({ talentId: z.string() }),
  ),
  rouzerDetails: makeRoute(
    ({ rouzerId }) => `/rouzer-details/${rouzerId}`,
    z.object({ rouzerId: z.string() }),
  ),
  adminDashboard: makeRoute(() => `/admin-dashboard`),
  spinner: makeRoute(() => `/spinner`),
};
