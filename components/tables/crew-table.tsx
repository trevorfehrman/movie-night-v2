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

type Cast = MovieDetails["credits"]["crew"];
type CastMember = MovieDetails["credits"]["crew"][number];

const castColumnHelper = createColumnHelper<CastMember>();

export function CrewTable({ cast }: { cast: Cast }) {
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
      castColumnHelper.accessor("name", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      }),
      castColumnHelper.accessor("department", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Department" />
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
