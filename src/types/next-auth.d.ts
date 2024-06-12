// next-auth.d.ts
import NextAuth from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    surname: string | null;
    email: string;
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      name: string | null;
      surname: string | null;
      email: string;
      role: Role;
    };
  }
}
