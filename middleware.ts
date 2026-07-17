import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk middleware runs on every matched request so server code (route handlers
// and pages) can read auth state via `auth()`. It deliberately does NOT force
// sign-in here: the two expensive API routes do their own `userId` check and
// return a clean JSON 401, which is friendlier to fetch() callers than a
// redirect to a hosted sign-in page. Everything else stays public.
export default clerkMiddleware();

export const config = {
  // NOTE: these MUST be plain string literals. Next.js statically extracts
  // config.matcher at build time and rejects anything else (a String.raw tagged
  // template fails with "Unsupported node type TaggedTemplateExpression"), so
  // ignore linters (e.g. Sonar S7780) that suggest String.raw here.
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
