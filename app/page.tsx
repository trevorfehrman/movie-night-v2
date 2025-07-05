import { ChatInput } from "@/components/chat-input";
import { MovieNightTable } from "@/components/tables/movie-night-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { redis } from "@/lib/redis/server";
import { ChatMessagesSchema } from "@/lib/schemas/chat";
import { Protect } from "@clerk/nextjs";
import { MovieNightMemberOrderList } from "@/components/movie-might-member-order-list";
import { SelectUserSchema } from "@/db/schema";
import { z } from "zod";
import { ChatBox } from "@/components/chat-box";

export default async function Home() {
  const movies = await db.query.movies.findMany({
    with: {
      user: {
        columns: {
          firstName: true,
        },
      },
    },
  });

  const directorsMap = movies.reduce(
    (acc, movie) => {
      if (acc[movie.director]) {
        acc[movie.director] += 1;
      } else {
        acc[movie.director] = 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const directors = Object.entries(directorsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const countriesMap = movies.reduce(
    (acc, movie) => {
      if (acc[movie.country]) {
        acc[movie.country] += 1;
      } else {
        acc[movie.country] = 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const countries = Object.entries(countriesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  function getCountryName(code: string) {
    return regionNames.of(code.toUpperCase()) || "Unknown country code";
  }

  const posts = await redis.lrange("posts", -50, -1);
  const movieNightMembers = await redis.zrange("movie_night_members", 0, -1);
  const cursor = await redis.get("cursor");
  const validatedCursor = z.number().parse(cursor);

  // TODO: Obviously need a better way to deal with this
  // const users = await db.query.users.findMany();

  // const thing = await redis.zadd("movie_night_members", {
  //   score: 14,
  //   member: JSON.stringify({ ...users[14], score: 14 }),
  // });

  // console.log(users.length, users);

  const SelectUsersWithScore = z.array(
    SelectUserSchema.extend({ score: z.number() }),
  );

  const validatedPosts = ChatMessagesSchema.parse(posts);
  const validatedMovieNightMembers =
    SelectUsersWithScore.parse(movieNightMembers);

  return (
    <main className="grid w-full max-w-screen-2xl flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card>
          <MovieNightTable movies={movies} />
        </Card>
      </div>
      <div className="flex flex-col gap-y-4">
        <MovieNightMemberOrderList
          validatedMovieNightMembers={validatedMovieNightMembers}
          validatedCursor={validatedCursor}
        />
        <Card className="relative">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="flex items-center gap-2 text-lg">
                Chat
              </CardTitle>
              <CardDescription>Say something</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="max-h-96 min-h-96 p-0">
            <ChatBox posts={validatedPosts} />
          </CardContent>
          <CardFooter className="flex min-h-10 items-center gap-4 border-t bg-muted/50 px-6 py-3">
            <Protect>
              <ChatInput />
            </Protect>
          </CardFooter>
        </Card>
        <Card className="relative">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="flex items-center gap-2 text-lg">
                Directors
              </CardTitle>
              <CardDescription>Leaderboard</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="mt-5">
            {directors.map((director) => (
              <div key={director[0]} className="flex justify-between">
                <span>{director[0]}</span>
                <span>{director[1]}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex min-h-10 items-center gap-4 border-t bg-muted/50 px-6 py-3">
            Down with the patriarchy
          </CardFooter>
        </Card>
        <Card className="relative">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="flex items-center gap-2 text-lg">
                Countries
              </CardTitle>
              <CardDescription>Leaderboard</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="mt-5">
            {countries.map((country) => (
              <div key={country[0]} className="flex justify-between">
                <span>{getCountryName(country[0])}</span>
                <span>{country[1]}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex min-h-10 items-center gap-4 border-t bg-muted/50 px-6 py-3">
            USA #1!
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
