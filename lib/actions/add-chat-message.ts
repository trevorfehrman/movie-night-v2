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
  const { userId: clerkUserId, orgId, has } = auth();

  if (
    !clerkUserId ||
    !orgId ||
    !has({ permission: "org:movie:create" }) ||
    !userFirstName
  ) {
    console.log("no clerkUserId, orgId, or userFirstName");
    return;
  }

  const payload = {
    message,
    clerkUserId,
    userFirstName,
    createdAt: new Date().toString(),
    imgUrl,
    id: nanoid(),
  };

  const validatedPayload = ChatMessageSchema.parse(payload);

  await pusherServer.trigger(
    "private-chat",
    "evt::main-chat",
    validatedPayload,
  );

  await redis.rpush("posts", JSON.stringify(validatedPayload));
}
