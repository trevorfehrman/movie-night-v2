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
  Row,
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
import { planescapeDataURL } from "@/lib/constants";
import { cn, getReadableDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { safeUpdateMovie } from "@/lib/actions/update-movie";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DevTool } from "@hookform/devtools";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InsertMovieSchema } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

type Movie = Awaited<ReturnType<typeof db.query.movies.findMany>>[number];
type MovieWithUserName = Movie & {
  user: { firstName: string };
};
type MoviesWithUserNames = MovieWithUserName[];

type Users = Awaited<ReturnType<typeof db.query.users.findMany>>;

const movieNightColumnHelper = createColumnHelper<MovieWithUserName>();

const shownColumns = ["rouzies", "posterPath", "title", "createdAt"];
const shownColumnsSm = ["title", "user_firstName"];

export function AdminMoveTable({
  movies,
  users,
}: {
  movies: MoviesWithUserNames;
  users: Users;
}) {
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
      }),
      movieNightColumnHelper.accessor("createdAt", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),

        cell: ({ row }) => (
          <div>
            {row.original.createdAt
              ? getReadableDate(row.original.createdAt)
              : ""}
          </div>
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
      <CardHeader className="flex items-center  justify-between bg-muted/50 md:flex-row">
        <div>
          <CardTitle>Edit Move Night Entries</CardTitle>
        </div>
        <Input
          placeholder="Filter..."
          onChange={(event) =>
            movieNightTable.setGlobalFilter(() => event.target.value)
          }
          className="max-w-xs"
        />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            {movieNightTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-inherit">
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
            {movieNightTable.getRowModel().rows.map((row) => {
              return <AdminMovieRow key={row.id} row={row} users={users} />;
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-center border-t bg-muted/50 px-6 py-3">
        <DataTablePagination table={movieNightTable} />
      </CardFooter>
    </>
  );
}

function AdminMovieRow({
  row,
  users,
}: {
  row: Row<MovieWithUserName>;
  users: Users;
}) {
  const { title, createdAt, rouzies, userId } = row.original;

  const { execute, status } = useAction(safeUpdateMovie);

  const EditableMovieDetailsSchema = InsertMovieSchema.pick({
    userId: true,
    rouzies: true,
    createdAt: true,
  });

  const form = useForm<z.infer<typeof EditableMovieDetailsSchema>>({
    resolver: zodResolver(EditableMovieDetailsSchema),
    defaultValues: {
      userId,
      rouzies,
      createdAt,
    },
  });

  function onSubmit(values: z.infer<typeof EditableMovieDetailsSchema>) {
    console.log(values);
    execute({ ...row.original, ...values });
  }

  return (
    <Collapsible key={row.id} asChild>
      <>
        <TableRow key={row.id} className="cursor-pointer">
          {row.getVisibleCells().map((cell) => (
            <CollapsibleTrigger key={cell.id} asChild>
              <TableCell
                key={cell.id}
                className={cn("hidden", {
                  "md:table-cell": shownColumns.includes(cell.column.id),
                  "table-cell": shownColumnsSm.includes(cell.column.id),
                })}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            </CollapsibleTrigger>
          ))}
        </TableRow>
        <CollapsibleContent asChild>
          <TableRow className="bg-muted/50">
            <TableCell colSpan={6}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Edit Entry for:{" "}
                    <span className="text-primary">{title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-base">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User:</FormLabel>
                            <Select
                              onValueChange={(val) => {
                                form.setValue("userId", val);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue>
                                    {
                                      users.find(
                                        (user) => user.id === field.value,
                                      )?.firstName
                                    }
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.firstName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>User</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rouzies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rouzies</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter rouzies..."
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is for rouzies
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="createdAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Created At</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      getReadableDate(field.value)
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={new Date(field.value ?? Date.now())}
                                  onSelect={(val) => {
                                    const date = format(
                                      val ?? Date.now(),
                                      "yyyy-MM-dd HH:mm:ss",
                                    );
                                    field.onChange(date);
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>Date of addition</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Submit</Button>
                      {status === "executing" && <div>Executing</div>}
                      {status === "hasSucceeded" && <div>Success</div>}
                      {status === "hasErrored" && <div>Nope</div>}
                    </form>
                  </Form>
                  <DevTool control={form.control} />
                </CardContent>
                <CardFooter>move on cowboy</CardFooter>
              </Card>
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  );
}
