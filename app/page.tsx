import { ImageWithFallback } from "@/components/image-with-fallback";
import { MessageList } from "@/components/message-list";
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

  return (
    <main className="grid w-full max-w-screen-2xl flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                I should say something there
              </CardTitle>
              <CardDescription>But what???</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <MovieNightTable movies={movies} />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-y-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
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
            {[...users, ...users, ...users].map((user) => (
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
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Updated <time dateTime="2023-11-23">November 23, 2023</time>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
            <CardTitle className="text-4xl">$1,329</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <div className="text-xs text-muted-foreground">
              +25% from last week
            </div> */}
            <MessageList prop="hi" />
          </CardContent>
          <CardFooter></CardFooter>
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
