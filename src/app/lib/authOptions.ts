import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as Record<
          "email" | "password",
          string
        >;

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        try {
          const user = await db.user.findUnique({
            where: { email: email },
          });

          if (!user) {
            throw new Error("No user found with that email address.");
          }

          const matchPassword = await bcrypt.compare(password, user.password);

          if (!matchPassword) {
            throw new Error("Incorrect password.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role: user.role,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Authorization failed.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && typeof token === "object") {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      } else {
        console.error("Error: token no tiene las propiedades esperadas.");
        throw new Error("Error de sesión: token inválido");
      }

      return session;
    },
  },
};
