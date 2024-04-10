import { searchMovies } from "@/lib/tmdb/movies";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MovieSearchTable,
  // movieSearchColumns,
} from "@/components/movie-search-table";
import { Routes } from "@/lib/routes";
import { getBase64 } from "@/lib/get-base-64";

type MovieSearchPageProps = {
  searchParams: typeof Routes.searchMovies.searchParams;
};

export default async function SearchMoviesPage({
  searchParams: { query, page },
}: MovieSearchPageProps) {
  const movies = await searchMovies({ query, page });
  const posterPaths = movies?.results.map((movie) => movie.poster_path) || [];
  const posterPathPromises = posterPaths.map((posterPath) =>
    getBase64(`https://image.tmdb.org/t/p/w92/${posterPath}` || ""),
  );
  const blurDataURLs = await Promise.all(posterPathPromises);
  return (
    <main className="mx-auto grid w-full max-w-screen-2xl flex-1 items-start gap-4 p-0 sm:px-6 sm:py-0 md:gap-8">
      <h1>{JSON.stringify(blurDataURLs.length)}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Results:</CardTitle>
          <CardDescription>
            Are these the movies you are looking for?
          </CardDescription>
        </CardHeader>
        {movies && movies.results.length > 0 && (
          <>
            <CardContent className="px-0 sm:p-6">
              <MovieSearchTable
                data={movies.results}
                totalResults={movies.total_results}
                totalPages={movies.total_pages}
                page={Number(page)}
                query={query}
                blurDataURLs={blurDataURLs}
              />
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                {Number(page) < movies.total_pages && (
                  <strong>
                    {Number(page) * 20 - 19} - {Number(page) * 20}
                  </strong>
                )}
                {Number(page) === movies.total_pages && (
                  <strong>
                    {Number(page) * 20 - 19} -{" "}
                    {Number(page) * 20 - 20 + (movies.total_results % 20)}
                  </strong>
                )}{" "}
                of <strong>{movies.total_results}</strong> results
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </main>
  );
}
