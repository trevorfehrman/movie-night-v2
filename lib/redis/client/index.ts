import { Redis } from "@upstash/redis";

// Connect to an Upstash Redis instance
export const redis = Redis.fromEnv();
