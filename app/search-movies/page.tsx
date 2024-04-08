import { searchMovies } from "@/tmdb/movies";
import { File, ListFilter, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MovieSearchTable,
  movieSearchColumns,
} from "@/components/movie-search-table";

export default async function SearchMoviesPage({
  searchParams: { query = "", page = "" },
}: {
  searchParams: { query: string; page: string };
}) {
  const movies = await searchMovies({ query, page });
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1 bg-primary">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        {movies && movies.results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Are these the movies you are looking for?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MovieSearchTable
                columns={movieSearchColumns}
                data={movies.results}
                totalResults={movies.total_results}
                totalPages={movies.total_pages}
                page={Number(page)}
                query={query}
              />
              {/* <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Poster</span>
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Score
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Story
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.results.map((movie) => (
                    <TableRow key={movie.id} className="w-full">
                      <TableCell className="hidden sm:table-cell">
                        <ImageWithDataUrl
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height={64}
                          width={64}
                          src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {movie.title}
                      </TableCell>
                      <TableCell>{movie.release_date.split("-")[0]}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {movie.vote_average}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {movie.overview}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <strong>
                  {Number(page) * 20 - 19} - {Number(page) * 20}
                </strong>{" "}
                of <strong>{movies.total_results}</strong> results
              </div>
            </CardFooter>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}

//
