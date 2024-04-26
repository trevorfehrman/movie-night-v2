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
import { planescapeDataURL } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
                blurDataURL={planescapeDataURL}
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

  const shownColumns = ["rouzies", "posterPath", "title", "director"];
  const shownColumnsSm = ["title", "user_firstName"];

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
                <TableHead
                  key={header.id}
                  className={cn("hidden", {
                    "md:table-cell": shownColumns.includes(header.column.id),
                    "table-cell": shownColumnsSm.includes(header.column.id),
                  })}
                >
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
                <TableCell
                  key={cell.id}
                  className={
                    cn("hidden", {
                      "md:table-cell": shownColumns.includes(cell.column.id),
                      "table-cell": shownColumnsSm.includes(cell.column.id),
                    })

                    // hiddenColumns.includes(cell.column.id) && "hidden",
                    // "md:table-cell",
                  }
                >
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
