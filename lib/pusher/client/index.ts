// libs/pusher/client/index.ts
import { env } from "@/env";
import PusherClient from "pusher-js";

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: "/api/pusher/auth",
});
