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
import { planescapeDataURL } from "@/lib/constants";
import { CardFooter } from "../ui/card";
import { TalentDetails } from "@/lib/tmdb/get-talent-details";
import Link from "next/link";

type TalentCrew = TalentDetails["movie_credits"]["crew"];
type TalentCrewMember = TalentCrew[number];

const talentCastColumnHelper = createColumnHelper<TalentCrewMember>();

export function TalentCrewTable({ talentCrew }: { talentCrew: TalentCrew }) {
  const talentCastColumns = React.useMemo(
    () => [
      talentCastColumnHelper.accessor("poster_path", {
        header: () => <></>,
        cell: ({ row }) => {
          const profilePath = row.original.poster_path;
          return (
            <div className="relative ml-4 aspect-movie-poster h-20">
              <ImageWithFallback
                alt={`Picture for ${row.original.title}`}
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
      talentCastColumnHelper.accessor("title", {
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
      talentCastColumnHelper.accessor("job", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Job" />
        ),
      }),
      talentCastColumnHelper.accessor("release_date", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Release Date" />
        ),
      }),
    ],
    [],
  );
  const castTable = useReactTable({
    data: talentCrew,
    columns: talentCastColumns,
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

  const hiddenColumns = ["poster_path"];
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
            <TableRow key={row.id} className="px-4">
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
