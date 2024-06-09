import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = createRouteMatcher([
  "/"
])

const publicRoutes = createRouteMatcher([
  '/api/webhook'
])

export default clerkMiddleware((auth, req) => {
  if (protectedRoutes(req)) auth().protect()
  if (publicRoutes(req)) auth()
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};