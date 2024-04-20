"use client";
import * as React from "react";
import { db } from "@/db";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ImageWithFallback } from "../image-with-fallback";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTablePagination } from "./data-table-pagination";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";

type Movie = Awaited<ReturnType<typeof db.query.movies.findMany>>[number];
type MovieWithUserName = Movie & {
  user: { firstName: string };
};
type Movies = MovieWithUserName[];

const movieNightColumnHelper = createColumnHelper<MovieWithUserName>();

export function MovieNightTable({ movies }: { movies: Movies }) {
  const movieNightColumns = React.useMemo(
    () => [
      movieNightColumnHelper.accessor("posterPath", {
        header: () => <></>,
        cell: ({ row }) => {
          const posterPath = row.original.posterPath;
          return (
            <div className="relative aspect-movie-poster h-20">
              <ImageWithFallback
                alt={`Picture for ${row.original.title}`}
                src={`https://image.tmdb.org/t/p/w92/${posterPath}`}
                placeholder="blur"
                blurDataURL={
                  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAA7AGkDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAIDAQQG/8QAGhABAQEBAQEBAAAAAAAAAAAAAAECEhEDE//EABgBAQEBAQEAAAAAAAAAAAAAAAECAAME/8QAFxEBAQEBAAAAAAAAAAAAAAAAABEBEv/aAAwDAQACEQMRAD8A9Oys9Za8L0xlJo1pNVoqEpKa0lpgAhfRKYVZT5RlUzWK0PEpTSsIoPS+j0phOmdJ9M6aOvKl0TWi3SetmGG1pO6Lrad2YmKdDpG7HbQOiaPnTmmzzbRWY6po805Zs820VHR0Okeh0YOSdsu0Oy3a+XRa7T1tK7T19GidV1sl2jr6J36NEavdjtzfo2bMZ1TZ5tyTZ5s8qx1zZ5tyzZps8rx1dt7c3Y7bkl6LdMLVxDNaT1puktJ3BrNbTuxolCTdtmkjQ4cWmlM6QyplcUtNHmkoeGFTodFDM//Z"
                }
                sizes="auto"
                fill
                className="rounded-md object-cover"
              />
            </div>
          );
        },
        enableGlobalFilter: false,
      }),
      movieNightColumnHelper.accessor("title", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => (
          <Link
            href={`/movie-details/${row.original.id}`}
            className="decoration-primary hover:underline"
          >
            {row.original.title}
          </Link>
        ),
      }),
      movieNightColumnHelper.accessor("director", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Director" />
        ),
      }),
      movieNightColumnHelper.accessor("country", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Country" />
        ),
      }),
      movieNightColumnHelper.accessor("year", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Year" />
        ),
      }),
      movieNightColumnHelper.accessor("user.firstName", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Picked By" />
        ),
      }),
      movieNightColumnHelper.accessor("rouzies", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Rouzies" />
        ),
      }),
    ],
    [],
  );

  const movieNightTable = useReactTable({
    data: movies,
    columns: movieNightColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter..."
          onChange={(event) =>
            movieNightTable.setGlobalFilter(() => event.target.value)
          }
          className="max-w-xs"
        />
      </div>
      <Table>
        <TableHeader>
          {movieNightTable.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {movieNightTable.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DataTablePagination table={movieNightTable} />
    </>
  );
}
