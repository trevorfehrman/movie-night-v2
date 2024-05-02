"use client";

import * as React from "react";
import { useAction } from "next-safe-action/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { safeAddChatMessage } from "@/lib/actions/add-chat-message";
import { Loader, Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function ChatInput() {
  const { execute, status } = useAction(safeAddChatMessage);
  const [message, setMessage] = React.useState("");
  const { user } = useUser();

  const imgUrl = user?.imageUrl;
  const userFirstName = user?.firstName;
  return (
    <>
      <Input
        type="text"
        placeholder="Enter your message"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            execute({ message: message, imgUrl, userFirstName });
            setMessage("");
          }
        }}
        value={message}
      />
      <Button
        type="submit"
        name="submit message"
        size="icon"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          execute({ message: message, imgUrl, userFirstName });
          setMessage("");
        }}
        disabled={status === "executing"}
        className="min-w-10"
      >
        {status === "idle" && <Send />}
        {status === "hasSucceeded" && <Send />}
        {status === "hasErrored" && <Send />}
        {status === "executing" && <Loader />}
      </Button>
    </>
  );
}
