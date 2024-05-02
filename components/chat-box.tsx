"use client";
import * as React from "react";

import { pusherClient } from "@/lib/pusher/client";
import { ChatMessageSchema, ChatMessages } from "@/lib/schemas/chat";
import { ImageWithFallback } from "./image-with-fallback";
import { CardDescription } from "./ui/card";
import { getReadableDateTime } from "@/lib/utils";

export default function ChatBox({ posts }: { posts: ChatMessages }) {
  const [messages, setMessages] = React.useState(posts);
  const containerRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    const channel = pusherClient
      .subscribe("private-chat")
      .bind("evt::main-chat", (data: unknown) => {
        const validatedData = ChatMessageSchema.parse(data);

        setMessages([...messages, validatedData]);
      });

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    return () => {
      channel.unbind();
    };
  }, [messages]);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      // requestAnimationFrame(() => {
      //   if (containerRef.current) {
      //     containerRef.current.style.visibility = "visible";
      //   }
      // });
    }
  }, []);

  return (
    <ul
      className="flex max-h-96 min-h-96 flex-col gap-y-4 overflow-auto"
      ref={containerRef}
      // style={{ visibility: "hidden" }}
    >
      {messages.map((message) => (
        <li
          key={message.id}
          className="flex gap-x-4 px-6 py-2 hover:bg-muted/50"
        >
          <ImageWithFallback
            src={message.imgUrl}
            height={30}
            width={30}
            className="h-fit w-fit rounded-full"
            alt={`Profile picture of ${message.userFirstName}`}
          />
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
    </ul>
  );
}
