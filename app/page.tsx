import dynamic from "next/dynamic";
// import { ChatBox } from "@/components/chat-box";
const ChatBox = dynamic(() => import("@/components/chat-box"), { ssr: false });
import { ChatInput } from "@/components/chat-input";
import { ImageWithFallback } from "@/components/image-with-fallback";
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
import { redis } from "@/lib/redis/client";
import { ChatMessagesSchema } from "@/lib/schemas/chat";

export default async function Home() {
  const users = await db.query.users.findMany();
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

  const validatedPosts = ChatMessagesSchema.parse(posts);

  return (
    <main className="grid w-full max-w-screen-2xl flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card>
          <MovieNightTable movies={movies} />
        </Card>
      </div>
      <div className="flex flex-col gap-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="flex items-center gap-2 text-lg">
                Whose turn is it
              </CardTitle>
              <CardDescription>
                {Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }).format(new Date())}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4 p-6 text-sm">
            {users.map((user) => (
              <div
                className="flex items-center gap-x-2"
                key={String(Math.random())}
              >
                <ImageWithFallback
                  src={user.imgUrl}
                  height={40}
                  width={40}
                  className="rounded-full"
                  alt={`Profile picture of ${user.firstName}`}
                />
                <div>{user.firstName}</div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Updated <time dateTime="2023-11-23">November 23, 2023</time>
            </div>
          </CardFooter>
        </Card>
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
          <CardFooter className="flex items-center gap-4 border-t bg-muted/50 px-6 py-3">
            <ChatInput />
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
