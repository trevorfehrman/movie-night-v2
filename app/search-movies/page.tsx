import { SearchTable } from "@/components/search-table";
import { searchMovies } from "@/tmdb/movies";

export default async function SearchMoviesPage({
  searchParams: { query = "" },
}: {
  searchParams: { query: string };
}) {
  const data = await searchMovies(query);
  return (
    <>
      {query}
      <SearchTable movies={data} />
    </>
  );
}
