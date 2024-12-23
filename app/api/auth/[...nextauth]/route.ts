import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const guestSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  userType: z.literal("GUEST"),
});

const customAdapter = {
  ...PrismaAdapter(prisma),
  createUser: async (user) => {
    const data = {
      ...user,
      email: user.email || `${uuidv4()}@guest.local`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      userType: "GOOGLE_USER",
    };

    const newUser = await prisma.user.create({ data });
    return newUser;
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: customAdapter,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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

        if (!parsedCredentials.success) {
          return null;
        }

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

        // add more return data here
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          userType: user.userType,
          timeZone: user.timeZone,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.userType =
          account.provider === "google" ? "GOOGLE_USER" : "GUEST";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email! },
          // select more data if you need
          select: { id: true, timeZone: true },
        });

        if (user) {
          session.user.id = user.id;
          // after select, add here
          session.user.timeZone = user.timeZone;
        }
        session.user.userType = token.userType as "GOOGLE_USER" | "GUEST";
      }
      return session;
    },
  },
});
