import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      accessToken: string
    } & DefaultSession["user"]
    error?: string
  }

  interface User {
    role: string
    accessToken: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    accessToken: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
  }
}
