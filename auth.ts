import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const guestSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  userType: z.literal("GUEST"),
});

const config = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials) {
        const parsedCredentials = guestSchema.safeParse(credentials);
        if (!parsedCredentials.success) return null;

        const { name } = parsedCredentials.data;
        const user = await prisma.user.create({
          data: {
            name,
            userType: "GUEST",
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
            email: `${uuidv4()}@guest.local`,
            emailVerified: null,
          },
        });
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: { id?: number; userType?: "GOOGLE_USER" | "GUEST" };
      user: { id: number };
      account: { provider: string };
    }) {
      if (user && account) {
        token.userType =
          account.provider === "google" ? "GOOGLE_USER" : "GUEST";
        token.id = user.id;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: {
        user: {
          id?: string;
          email?: string;
          timeZone?: string;
          userType?: "GOOGLE_USER" | "GUEST";
        };
      };
      token: { id?: number; userType?: "GOOGLE_USER" | "GUEST" };
    }) {
      if (token) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: { id: true, timeZone: true },
        });
        if (user) {
          session.user.id = user.id;
          session.user.timeZone = user.timeZone ?? undefined;
        }
        session.user.userType = token.userType as "GOOGLE_USER" | "GUEST";
      }
      return session;
    },
  },
};

// @ts-ignore
export const { handlers, auth, signIn, signOut } = NextAuth(config);
