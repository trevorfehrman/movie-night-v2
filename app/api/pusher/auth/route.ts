import { getPusherInstance } from "@/lib/pusher/server";
import { auth } from "@clerk/nextjs/server";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  const { userId: clerkUserId, orgId, has } = await auth();
  if (!clerkUserId || !orgId || !has({ permission: "org:movie:create" })) {
    return new Response("Unauthorized", { status: 401 });
  }
  const data = await req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  const authResponse = pusherServer.authorizeChannel(socketId, channelName);

  return new Response(JSON.stringify(authResponse));
}
