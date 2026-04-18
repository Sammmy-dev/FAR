import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { authConfig } from "@/lib/auth.config";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Spread the edge-safe config (pages, session, authorized callback)
  ...authConfig,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        await connectDB();

        // password is excluded by default (select: false) — re-include it here
        const user = await User.findOne({
          email: email.toLowerCase().trim(),
        }).select("+password");

        if (!user) return null;

        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) return null;

        // Return only the fields that go into the JWT
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Keep the authorized callback from auth.config (middleware route protection)
    ...authConfig.callbacks,

    /**
     * jwt — called whenever a JWT is created or refreshed.
     * Persists id and role into the token so they survive across requests.
     */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as "SUPER_ADMIN" | "STAFF";
      }
      return token;
    },

    /**
     * session — called when a session is accessed.
     * Forwards id and role from the JWT into the session object so server
     * components can read session.user.role without a DB lookup.
     */
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "SUPER_ADMIN" | "STAFF";
      return session;
    },
  },
});
