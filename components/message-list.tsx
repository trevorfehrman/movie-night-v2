"use client";

import { pusherClient } from "@/lib/pusher/client";
import { useEffect, useState } from "react";

interface MessageListProps {
  prop: string;
}

export function MessageList({ prop }: MessageListProps) {
  const [messages, setMessages] = useState<unknown[]>([]);
  console.log(prop);

  useEffect(() => {
    const channel = pusherClient
      .subscribe("private-chat")
      .bind("evt::test", (data: unknown) => {
        console.log("test", data);
        setMessages([...(messages as unknown[]), data]);
      });

    return () => {
      channel.unbind();
    };
  }, [messages]);

  const handleTestClick = async () => {
    const data = await fetch("/api/pusher/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "test" }),
    });
    const json = await data.json();
    console.log(json);
  };

  return (
    <div className="flex flex-col">
      <button
        className="m-2 w-[240px] rounded bg-slate-600 p-2 hover:bg-slate-500"
        onClick={() => handleTestClick()}
      >
        Test
      </button>

      <div>sup</div>
      <div>
        {messages.map((message, i) => (
          <pre key={i}>{JSON.stringify(message, null, 2)}</pre>
        ))}
      </div>
    </div>
  );
}

// {messages.map((message: unknown) => (
//   <div
//     className="m-2 rounded border border-slate-600 p-2"
//     key={message.date}
//   >
//     {message.message}
//     <br />
//     {message.date}
//   </div>
// ))}
