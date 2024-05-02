"use client";
import * as React from "react";
import useSound from "use-sound";
import { ImageWithFallback } from "./image-with-fallback";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { db } from "@/db";
import { useAction } from "next-safe-action/hooks";
import { safeSetCursor } from "@/lib/actions/set-cursor";
import { Button } from "./ui/button";
import { pusherClient } from "@/lib/pusher/client";
import { z } from "zod";

import { LayoutGroup, motion } from "framer-motion";

type UserWithScore = Awaited<
  ReturnType<typeof db.query.users.findMany>
>[number] & { score: number };

export function MovieNightMemberOrderList({
  validatedMovieNightMembers: users,
  validatedCursor,
}: {
  validatedMovieNightMembers: UserWithScore[];
  validatedCursor: number;
}) {
  const { execute } = useAction(safeSetCursor);
  // const { execute, status } = useAction(safeSetCursor);

  const [play] = useSound("/boing.mp3");

  const [cursor, setCursor] = React.useState(validatedCursor);

  React.useEffect(() => {
    const channel = pusherClient
      .subscribe("movie_night_members")
      .bind("evt::set-cursor", (data: unknown) => {
        const validatedData = z.number().parse(data);
        setCursor(validatedData);
      });

    return () => {
      channel.unbind();
    };
  }, [cursor]);

  return (
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
        <LayoutGroup>
          {users
            .slice(cursor)
            .concat(users.slice(0, cursor))
            .map((user) => (
              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                }}
                className="flex items-center gap-x-2"
                key={user.id}
              >
                <ImageWithFallback
                  src={user.imgUrl}
                  height={40}
                  width={40}
                  className="rounded-full"
                  alt={`Profile picture of ${user.firstName}`}
                />
                <div>{user.firstName}</div>
                <Button
                  onClick={() => {
                    execute({ cursor: user.score });
                    play();
                  }}
                >
                  Set {user.score}
                </Button>
              </motion.div>
            ))}
        </LayoutGroup>
      </CardContent>
      <CardFooter className="flex items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2023-11-23">November 23, 2023</time>
        </div>
      </CardFooter>
    </Card>
  );
}
