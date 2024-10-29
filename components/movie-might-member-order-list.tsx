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
import { Protect } from "@clerk/nextjs";
import { MoveUp } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";

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
  const safeCursor = useAction(safeSetCursor);
  const isInitialMount = React.useRef(true); // Create a ref to track the initial mount

  const [playBoing] = useSound("/boing.mp3");

  const [cursor, setCursor] = React.useState(validatedCursor);
  const [isBoingEnabled, setIsBoingEnabled] = React.useState(false);

  React.useEffect(() => {
    const channel = pusherClient.subscribe("movie_night_members");

    channel.bind("evt::set-cursor", (data: unknown) => {
      const validatedData = z.number().parse(data);
      setCursor(validatedData);
    });
    if (isInitialMount.current) {
      isInitialMount.current = false; // Modify ref to false after the first render
    } else {
      isBoingEnabled && playBoing();
    }

    return () => {
      channel.unbind();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- play has an unstable reference so we don't include it here
  }, [cursor]);

  const rearrangedUsers = users.slice(cursor).concat(users.slice(0, cursor));

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
          {rearrangedUsers.map((user) => (
            <motion.div
              layout
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 20,
              }}
              className="flex items-center justify-between"
              key={user.id}
            >
              <div className="flex items-center gap-x-2">
                <ImageWithFallback
                  src={user.imgUrl}
                  height={40}
                  width={40}
                  className="rounded-full"
                  alt={`Profile picture of ${user.firstName}`}
                />
                <Link
                  className="decoration-primary hover:underline"
                  href={`/rouzer-details/${user.id}`}
                >
                  {user.firstName}
                </Link>
              </div>
              <Protect permission="org:movie:create">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    safeCursor.execute({ cursor: user.score });
                    setCursor(user.score);
                  }}
                  className="size-8"
                  aria-label="Move up"
                >
                  <MoveUp className="size-4" />
                </Button>
              </Protect>
            </motion.div>
          ))}
        </LayoutGroup>
      </CardContent>
      <CardFooter className="flex items-center border-t bg-muted/50 px-6 py-3">
        <div className="flex items-center gap-x-2 text-xs text-muted-foreground">
          <Checkbox
            aria-label="Enable boing sound effect"
            id="boing"
            onCheckedChange={() => setIsBoingEnabled((prev) => !prev)}
            checked={isBoingEnabled}
          />
          <label
            htmlFor="boing"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable boing
          </label>
        </div>
      </CardFooter>
    </Card>
  );
}
