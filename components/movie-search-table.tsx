"use client";

import { MovieSearchResult } from "@/lib/tmdb/movies";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Routes } from "@/lib/routes";
import { ImageWithFallback } from "./image-with-fallback";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface DataTableProps<TData, TValue> {
  data: TData[];
  totalResults: number;
  totalPages: number;
  page: number;
  query?: string;
  blurDataURLs: (string | undefined)[];
}

export function MovieSearchTable<TData extends MovieSearchResult, TValue>({
  // columns,
  data,
  totalResults,
  totalPages,
  page,
  query,
  blurDataURLs,
}: DataTableProps<TData, TValue>) {
  const movieSearchColumns: ColumnDef<MovieSearchResult>[] = [
    {
      accessorKey: "poster_path",

      header: "Poster",
      cell: ({ row }) => {
        const posterPath = row.original.poster_path;

        return (
          <div className="aspect-movie-poster relative h-20">
            <ImageWithFallback
              alt={`Poster for ${row.original.title}`}
              src={`https://image.tmdb.org/t/p/w92/${posterPath}`}
              placeholder="blur"
              blurDataURL={
                blurDataURLs[row.index] ||
                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAA7AGkDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAIDAQQG/8QAGhABAQEBAQEBAAAAAAAAAAAAAAECEhEDE//EABgBAQEBAQEAAAAAAAAAAAAAAAECAAME/8QAFxEBAQEBAAAAAAAAAAAAAAAAABEBEv/aAAwDAQACEQMRAD8A9Oys9Za8L0xlJo1pNVoqEpKa0lpgAhfRKYVZT5RlUzWK0PEpTSsIoPS+j0phOmdJ9M6aOvKl0TWi3SetmGG1pO6Lrad2YmKdDpG7HbQOiaPnTmmzzbRWY6po805Zs820VHR0Okeh0YOSdsu0Oy3a+XRa7T1tK7T19GidV1sl2jr6J36NEavdjtzfo2bMZ1TZ5tyTZ5s8qx1zZ5tyzZps8rx1dt7c3Y7bkl6LdMLVxDNaT1puktJ3BrNbTuxolCTdtmkjQ4cWmlM6QyplcUtNHmkoeGFTodFDM//Z"
              }
              sizes="auto"
              fill
              className="rounded-md object-cover"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: "release_date",
      header: () => "Year",
      cell: ({ row }) => {
        const releaseDate = row.original.release_date;
        return releaseDate.split("-")[0];
      },
    },
    {
      accessorKey: "vote_average",
      header: () => "Score",
      cell: ({ row }) => row.original.vote_average.toFixed(1),
    },
    {
      accessorKey: "overview",
      header: () => "Story",
      cell: ({ row }) => (
        <div className="line-clamp-2">{row.original.overview}</div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns: movieSearchColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: totalResults,
    pageCount: totalPages,
    initialState: {
      pagination: {
        pageIndex: page - 1,
        pageSize: 20,
      },
    },
    autoResetPageIndex: false,
  });

  const router = useRouter();

  const hiddenColumns = ["overview", "vote_average", "release_date"];
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        hiddenColumns.includes(header.column.id) && "hidden",
                        "md:table-cell",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(
                      Routes.movieDetails({
                        movieId: String(row.original.id),
                      }),
                    );
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        hiddenColumns.includes(cell.column.id) && "hidden",
                        "md:table-cell",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={movieSearchColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.setPageIndex((prev) => prev - 1);
            router.push(
              `/search-movies?query=${query}&page=${String(page - 1)}`,
            );
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(!table.getCanNextPage() && "cursor-pointer")}
          onClick={() => {
            table.setPageIndex((prev) => prev + 1);
            router.push(
              `/search-movies?query=${query}&page=${String(page + 1)}`,
            );
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
