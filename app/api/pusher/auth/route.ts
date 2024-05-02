import { getPusherInstance } from "@/lib/pusher/server";
import { auth } from "@clerk/nextjs/server";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  console.log("authenticating pusher perms...");
  const { userId: clerkUserId, orgId, has } = auth();
  if (!clerkUserId || !orgId || !has({ permission: "org:movie:create" })) {
    console.log("no clerkUserId, orgId, or userFirstName");
    return;
  }
  const data = await req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  // logic to check user permissions

  const authResponse = pusherServer.authorizeChannel(socketId, channelName);

  return new Response(JSON.stringify(authResponse));
}
