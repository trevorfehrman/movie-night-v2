"use client";
import * as React from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ImageWithFallback } from "../image-with-fallback";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableColumnHeader } from "./data-table-column-header";
import { MovieDetails } from "@/lib/tmdb/get-movie-details";
import { planescapeDataURL } from "@/lib/constants";
import { CardFooter } from "../ui/card";
import Link from "next/link";

type Cast = MovieDetails["credits"]["crew"];
type CastMember = MovieDetails["credits"]["crew"][number];

const castColumnHelper = createColumnHelper<CastMember>();

export function CrewTable({ cast }: { cast: Cast }) {
  const castColumns = React.useMemo(
    () => [
      castColumnHelper.accessor("profile_path", {
        header: () => <></>,
        cell: ({ row }) => {
          const profilePath = row.original.profile_path;
          return (
            <div className="relative ml-4 aspect-movie-poster h-20">
              <ImageWithFallback
                alt={`Picture for ${row.original.name}`}
                src={`https://image.tmdb.org/t/p/w92/${profilePath}`}
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
      castColumnHelper.accessor("name", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <Link
            className="decoration-primary hover:underline"
            href={`/talent-details/${row.original.id}`}
          >
            {row.original.name}
          </Link>
        ),
      }),
      castColumnHelper.accessor("job", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
      }),
      castColumnHelper.accessor("popularity", {
        size: 50,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Popularity Score" />
        ),
        cell: ({ row }) => Math.ceil(row.original.popularity),
      }),
    ],
    [],
  );
  const castTable = useReactTable({
    data: cast,
    columns: castColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const hiddenColumns = ["profile_path", "popularity"];
  return (
    <>
      <div className="ml-6 flex items-center py-4">
        <Input
          placeholder="Filter..."
          onChange={(event) =>
            castTable.setGlobalFilter(() => event.target.value)
          }
          className="max-w-xs"
        />
      </div>
      <Table>
        <TableHeader>
          {castTable.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  className={cn(
                    hiddenColumns.includes(header.column.id) && "hidden",
                    "md:table-cell",
                  )}
                  key={header.id}
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
          {castTable.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    hiddenColumns.includes(cell.column.id) && "hidden",
                    "md:table-cell",
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CardFooter className="justify-center border-t bg-muted/50 px-6 py-3">
        <DataTablePagination table={castTable} />
      </CardFooter>
    </>
  );
}
