import "next-auth";

declare module "next-auth" {
  // config this for model in auth route
  interface Session {
    user: {
      id: string;
      userType: "GOOGLE_USER" | "GUEST";
      name?: string | null;
      email?: string | null;
      image?: string | null;
      timeZone?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    userType: "GOOGLE_USER" | "GUEST";
  }
}