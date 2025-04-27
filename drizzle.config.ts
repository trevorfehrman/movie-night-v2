import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { env } from "./env";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    // @ts-expect-error -- idk why this type is wrong but it is.
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
