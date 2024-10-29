"use client";
import * as React from "react";

import { pusherClient } from "@/lib/pusher/client";
import { ChatMessageSchema, ChatMessages } from "@/lib/schemas/chat";
import { ImageWithFallback } from "./image-with-fallback";
import { CardDescription } from "./ui/card";
import { getReadableDateTime } from "@/lib/utils";

export default function ChatBox({ posts }: { posts: ChatMessages }) {
  const [messages, setMessages] = React.useState(posts);
  const bottomRef = React.useRef<HTMLLIElement>(null);

  React.useEffect(() => {
    const channel = pusherClient
      .subscribe("private-chat")
      .bind("evt::main-chat", (data: unknown) => {
        const validatedData = ChatMessageSchema.parse(data);

        setMessages([...messages, validatedData]);
      });
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });

    return () => {
      channel.unbind();
    };
  }, [messages]);

  return (
    <>
      <ul className="flex max-h-96 min-h-96 flex-col gap-y-4 overflow-auto">
        {messages.map((message) => (
          <li
            key={message.id}
            className="flex gap-x-4 px-6 py-2 hover:bg-muted/50"
          >
            <div className="relative size-8">
              <ImageWithFallback
                src={message.imgUrl}
                className="h-fit w-fit rounded-full"
                alt={`Profile picture of ${message.userFirstName}`}
                fill
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <p className="font-semibold">{message.userFirstName}</p>
                <CardDescription>
                  {getReadableDateTime(message.createdAt)}
                </CardDescription>
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          </li>
        ))}
        <li ref={bottomRef} />
      </ul>
    </>
  );
}
