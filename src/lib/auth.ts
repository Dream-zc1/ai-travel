import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const db = getDb();
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .then((rows) => rows[0]);

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
          // avatar intentionally excluded — too large for JWT cookie
          bio: user.bio,
          region: user.region,
          location: user.location,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session: updateData }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
        token.bio = user.bio;
        token.region = user.region;
        token.location = user.location;
      }

      // Token updated via session.update(data) — data arrives as `session` param
      if (trigger === "update" && updateData) {
        if (updateData.name !== undefined) token.name = updateData.name;
        if (updateData.avatar !== undefined) token.avatar = updateData.avatar;
        if (updateData.bio !== undefined) token.bio = updateData.bio;
        if (updateData.region !== undefined) token.region = updateData.region;
        if (updateData.location !== undefined) token.location = updateData.location;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string | null;
        session.user.avatar = token.avatar as string | null;
        session.user.bio = token.bio as string | null;
        session.user.region = token.region as string | null;
        session.user.location = token.location as string | null;
      }
      return session;
    },
  },
};
