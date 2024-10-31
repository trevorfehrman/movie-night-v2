"use server";

import { z } from "zod";
import { action } from "./safe-action";
import { redis } from "../redis/server";
import { auth } from "@clerk/nextjs/server";
import { getPusherInstance } from "../pusher/server";

const CursorSchema = z.object({
  cursor: z.number(),
});
export const safeSetCursor = action(CursorSchema, setCursor);

const pusherServer = getPusherInstance();

async function setCursor({ cursor }: { cursor: number }) {
  const { userId: clerkUserId, orgId, has } = await auth();

  if (!clerkUserId || !orgId || !has({ permission: "org:movie:create" })) {
    console.log("no clerkUserId, orgId, or userFirstName");
    return;
  }

  console.log("setting cursor", cursor);

  await pusherServer.trigger("movie_night_members", "evt::set-cursor", cursor);

  await redis.set("cursor", cursor);
}
