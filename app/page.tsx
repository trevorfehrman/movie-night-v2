import dynamic from "next/dynamic";
const ChatBox = dynamic(() => import("@/components/chat-box"), { ssr: false });
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

export default async function Home() {
  // const users = await db.query.users.findMany();
  const movies = await db.query.movies.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    with: {
      user: {
        columns: {
          firstName: true,
        },
      },
    },
  });

  const posts = await redis.lrange("posts", -50, -1);
  const movieNightMembers = await redis.zrange("movie_night_members", 0, -1);
  const cursor = await redis.get("cursor");
  const validatedCursor = z.number().parse(cursor);

  // const thing = await redis.zadd("movie_night_members", {
  //   score: 1,
  //   member: JSON.stringify({ ...users[1], score: 1 }),
  // });

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
            <Protect permission="org:movie:create">
              <ChatInput />
            </Protect>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-4xl">$5,329</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +10% from last month
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
