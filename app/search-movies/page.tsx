import { searchMovies } from "@/tmdb/movies";

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
  movieSearchColumns,
} from "@/components/movie-search-table";
import { Routes } from "@/lib/routes";

type MovieSearchPageProps = {
  searchParams: typeof Routes.searchMovies.searchParams;
};

export default async function SearchMoviesPage({
  searchParams: { query, page },
}: MovieSearchPageProps) {
  const movies = await searchMovies({ query, page });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Results:</CardTitle>
        <CardDescription>
          Are these the movies you are looking for?
        </CardDescription>
      </CardHeader>
      {movies && movies.results.length > 0 && (
        <>
          <CardContent>
            <MovieSearchTable
              columns={movieSearchColumns}
              data={movies.results}
              totalResults={movies.total_results}
              totalPages={movies.total_pages}
              page={Number(page)}
              query={query}
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
  );
}
