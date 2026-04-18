import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible NextAuth configuration.
 *
 * This file must NOT import anything that relies on Node.js-only APIs
 * (mongoose, bcryptjs, crypto, fs, etc.) because Next.js middleware
 * runs on the Edge runtime, not on Node.js.
 *
 * The full auth configuration (CredentialsProvider + DB lookups) lives
 * in auth.ts, which spreads this config and adds providers/callbacks.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },

  session: { strategy: "jwt" },

  callbacks: {
    /**
     * `authorized` is called by the middleware on every matched request.
     * Return true  → allow the request through.
     * Return false → redirect to signIn page (defined in pages.signIn above).
     * Return Response → custom redirect.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
      const isLoginPage = nextUrl.pathname === "/login";

      // Protect all /dashboard/* routes
      if (isDashboardRoute) {
        if (isLoggedIn) return true;
        return false; // → redirects to /login
      }

      // Bounce logged-in users away from the login page
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // All other routes (public pages) are always accessible
      return true;
    },
  },

  // Providers are intentionally empty here; filled in auth.ts.
  providers: [],
} satisfies NextAuthConfig;
