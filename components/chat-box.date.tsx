"use client";
import { getReadableDateTime } from "@/lib/utils";
import * as React from "react";

export function ChatBoxDate({ date }: { date: string }) {
  const [formattedDate, setFormattedDate] = React.useState("");

  React.useEffect(() => {
    const readableDate = getReadableDateTime(date);
    if (readableDate) {
      setFormattedDate(readableDate);
    }
  }, [date]);

  return <div>{formattedDate}</div>;
}
