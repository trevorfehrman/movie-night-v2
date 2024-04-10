import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhooks(.*)",
    "/search-movies",
    "/movie-details(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
