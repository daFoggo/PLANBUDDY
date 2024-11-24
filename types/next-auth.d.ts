import NextAuth, { DefaultSession } from "next-auth";
import { UserType } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      userType: UserType;
    } & DefaultSession["user"];
  }

  interface JWT {
    userType: UserType;
  }
}