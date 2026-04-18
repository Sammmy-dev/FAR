import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Middleware runs on the Edge runtime — it MUST NOT import anything
 * that uses Node.js-only APIs (Mongoose, bcryptjs, etc.).
 *
 * NextAuth(authConfig).auth uses only the edge-safe config, which
 * handles route protection via the `authorized` callback defined in
 * auth.config.ts.
 */
export default NextAuth(authConfig).auth;

export const config = {
  /*
   * Run middleware on every route EXCEPT:
   *  - /api/auth/*         NextAuth's own endpoints
   *  - /_next/static       Static assets
   *  - /_next/image        Image optimisation
   *  - /favicon.ico        Browser favicon
   *  - /images/*           Public image assets
   */
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|images/).*)",
  ],
};
