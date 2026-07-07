import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase();

        // Best-effort brute-force throttle, keyed by email. See lib/rateLimit.js
        // for why this isn't sufficient on its own in a multi-instance deployment.
        const limited = await rateLimit(`login:${email}`, 10, 15 * 60 * 1000);
        if (!limited.success) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValidPassword) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }
      // Triggered by calling `update()` from useSession() on the client,
      // e.g. right after a successful profile edit — lets the header reflect
      // a new name/email immediately, without requiring a fresh login.
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;

        // Look up emailVerified fresh on every session check (rather than
        // baking it into the JWT at sign-in time) so that verifying your
        // email is reflected immediately, without needing to log in again.
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { emailVerified: true },
        });
        session.user.emailVerified = dbUser?.emailVerified ?? null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
