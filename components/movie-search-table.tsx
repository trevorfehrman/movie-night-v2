"use client";

import { MovieSearchResult } from "@/tmdb/movies";

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
import { ImageWithFallback } from "./image-with-fallback";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const movieSearchColumns: ColumnDef<MovieSearchResult>[] = [
  {
    accessorKey: "poster_path",
    header: "Poster",
    cell: ({ row }) => {
      const posterPath = row.original.poster_path;

      return (
        <ImageWithFallback
          alt={`Poster for ${row.original.title}`}
          src={`https://image.tmdb.org/t/p/w92/${posterPath}`}
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "release_date",
    header: "Year",
    cell: ({ row }) => {
      const releaseDate = row.original.release_date;
      return <div>{releaseDate.split("-")[0]}</div>;
    },
  },
  {
    accessorKey: "vote_average",
    header: "Score",
    cell: ({ row }) => row.original.vote_average.toFixed(1),
  },
  {
    accessorKey: "overview",
    header: "Story",
    cell: ({ row }) => (
      <div className="line-clamp-2">{row.getValue("overview")}</div>
    ),
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalResults: number;
  totalPages: number;
  page: number;
  query?: string;
}

export function MovieSearchTable<TData, TValue>({
  columns,
  data,
  totalResults,
  totalPages,
  page,
  query,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
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

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  colSpan={columns.length}
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
