import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      hashId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    hashId?: string; // Add hashId to the user object returned by providers/adapters
  }
}
