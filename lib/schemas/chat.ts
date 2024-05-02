import { z } from "zod";

export const ChatMessageSchema = z.object({
  message: z.string().min(1),
  imgUrl: z.string(),
  userFirstName: z.string().min(1),
  clerkUserId: z.string().min(1),
  createdAt: z.string(),
  id: z.string().min(1),
});

export const ChatMessagesSchema = z.array(ChatMessageSchema);

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatMessages = z.infer<typeof ChatMessagesSchema>;

export const ChatMessagePayloadFromClientSchema = z.object({
  message: z.string().min(1),
  imgUrl: z.string().min(1).optional(),
  userFirstName: z.string().min(1).optional().nullish(),
});
