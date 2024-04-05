import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import type { Config } from "drizzle-kit";
import { env } from "./env";
export default {
  schema: "./db/schema.ts",
  out: "./migrations",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
