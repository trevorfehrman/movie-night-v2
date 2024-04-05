/** @type {import('next').NextConfig} */
import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./env.ts");

const nextConfig = {};

export default nextConfig;
