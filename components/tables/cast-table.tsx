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

type Cast = MovieDetails["credits"]["cast"];
type CastMember = MovieDetails["credits"]["cast"][number];

const castColumnHelper = createColumnHelper<CastMember>();

export function CastTable({ cast }: { cast: Cast }) {
  const castColumns = React.useMemo(
    () => [
      castColumnHelper.accessor("profile_path", {
        header: () => <span>Picture</span>,
        cell: ({ row }) => {
          const profilePath = row.original.profile_path;
          return (
            <div className="relative aspect-movie-poster h-20">
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
      }),
      castColumnHelper.accessor("character", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Character" />
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
      <div className="flex items-center py-4">
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
      <DataTablePagination table={castTable} />
    </>
  );
}
