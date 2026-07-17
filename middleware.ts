import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk middleware runs on every matched request so server code (route handlers
// and pages) can read auth state via `auth()`. It deliberately does NOT force
// sign-in here: the two expensive API routes do their own `userId` check and
// return a clean JSON 401, which is friendlier to fetch() callers than a
// redirect to a hosted sign-in page. Everything else stays public.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
