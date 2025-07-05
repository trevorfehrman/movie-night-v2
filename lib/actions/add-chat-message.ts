"use server";

import { action } from "./safe-action";
import { auth } from "@clerk/nextjs/server";
import { redis } from "../redis/server";
import { getPusherInstance } from "../pusher/server";
import { nanoid } from "nanoid";
import {
  ChatMessagePayloadFromClientSchema,
  ChatMessageSchema,
} from "../schemas/chat";

export const safeAddChatMessage = action(
  ChatMessagePayloadFromClientSchema,
  addChatMessage,
);
const pusherServer = getPusherInstance();

async function addChatMessage({
  message,
  userFirstName = "",
  imgUrl = "",
}: {
  message: string;
  userFirstName?: string | null;
  imgUrl?: string;
}) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId || !userFirstName) {
    console.log("no clerkUserId or userFirstName", {
      clerkUserId: !!clerkUserId,
      userFirstName: !!userFirstName,
    });
    throw new Error("Missing required user information");
  }

  const payload = {
    message,
    clerkUserId,
    userFirstName,
    createdAt: new Date().toString(),
    imgUrl: imgUrl || "",
    id: nanoid(),
  };

  const validatedPayload = ChatMessageSchema.parse(payload);

  await pusherServer.trigger("chat", "evt::main-chat", validatedPayload);

  await redis.rpush("posts", JSON.stringify(validatedPayload));
}
