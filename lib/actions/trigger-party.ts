"use server";

import { z } from "zod";
import { action } from "./safe-action";
import { getPusherInstance } from "../pusher/server";

const TriggerPartySchema = z.object({
  rouzer: z.string(),
});

export const safeTriggerParty = action(TriggerPartySchema, triggerParty);

const pusherServer = getPusherInstance();

async function triggerParty({ rouzer }: { rouzer: string }) {
  console.log("triggering party", rouzer);

  await pusherServer.trigger(
    "movie_night_members",
    "evt::trigger-party",
    rouzer,
  );
}
