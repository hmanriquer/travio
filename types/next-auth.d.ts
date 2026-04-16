import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "master" | "admin"
    } & DefaultSession["user"]
  }

  interface User {
    role?: "master" | "admin"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: "master" | "admin"
  }
}
