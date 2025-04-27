import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"], // Track requests by IP
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
      ],
    }),
  ],
});

// Testing

// Define the routes that should be protected
const isProtectedRoute = createRouteMatcher([
  "/movie-details/(.*)",
  "/talent-details/(.*)",
]);

// Pass clerk middleware with protection for specific routes
export default createMiddleware(
  aj,
  clerkMiddleware(async (auth, req) => {
    // If the route matches our protected patterns, require authentication
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  }),
);
