import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { AuthService } from "@/lib/services/auth.service"

const authService = new AuthService()

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        return authService.validateCredentials(
          credentials.email as string,
          credentials.password as string
        )
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: "master" | "admin" }).role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as "master" | "admin"
      }
      return session
    },
  },
})
