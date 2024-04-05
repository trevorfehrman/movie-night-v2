import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";

import { z } from "zod";

const verificationSchema = z.object({
  status: z.string(),
  strategy: z.string(),
});

const emailAddressSchema = z.object({
  email_address: z.string(),
  id: z.string(),
  linked_to: z.array(z.object({ id: z.string(), type: z.string() })),
  object: z.string(),
  verification: verificationSchema,
});

const externalAccountSchema = z.object({
  approved_scopes: z.string(),
  created_at: z.number(),
  email_address: z.string(),
  family_name: z.string(),
  given_name: z.string(),
  google_id: z.string(),
  id: z.string(),
  label: z.null(),
  object: z.string(),
  picture: z.string(),
  public_metadata: z.object({}),
  updated_at: z.number(),
  username: z.null(),
  verification: z.object({
    attempts: z.null(),
    error: z
      .object({
        code: z.string().nullish(),
        long_message: z.string().nullish(),
        message: z.string().nullish(),
      })
      .nullish(),
    expire_at: z.number(),
    status: z.string(),
    strategy: z.string(),
  }),
});

const dataSchema = z.object({
  birthday: z.string().nullish(),
  created_at: z.number(),
  email_addresses: z.array(emailAddressSchema),
  external_accounts: z.array(externalAccountSchema),
  external_id: z.string().nullish(),
  first_name: z.string(),
  gender: z.string().nullish(),
  id: z.string(),
  image_url: z.string(),
  last_name: z.string(),
  last_sign_in_at: z.number().nullish(),
  object: z.string(),
  password_enabled: z.boolean(),
  phone_numbers: z.array(z.unknown()),
  primary_email_address_id: z.string(),
  primary_phone_number_id: z.string().nullable(),
  primary_web3_wallet_id: z.string().nullable(),
  private_metadata: z.record(z.unknown()),
  profile_image_url: z.string(),
  public_metadata: z.record(z.unknown()),
  two_factor_enabled: z.boolean(),
  unsafe_metadata: z.record(z.unknown()),
  updated_at: z.number(),
  username: z.string().nullable(),
  web3_wallets: z.array(z.unknown()),
});

const objectSchema = z.object({
  data: dataSchema,
  object: z.string(),
  type: z.string(),
});

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  const validatedBody = objectSchema.parse(payload);
  const {
    id: clerkId,
    email_addresses,
    first_name,
    last_name,
    profile_image_url,
  } = validatedBody.data;

  try {
    await db.insert(users).values({
      id: clerkId,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
      imgUrl: profile_image_url,
    });
  } catch (err) {
    console.error("Error inserting user:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}
