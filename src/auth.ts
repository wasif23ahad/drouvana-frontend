import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import api from "@/lib/api";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const response = await api.post(`${apiUrl}/api/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = response.data;

          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.avatar,
              accessToken: user.token,
            };
          }
          return null;
        } catch (error: any) {
          console.error("Auth error:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const response = await api.post(`${apiUrl}/api/auth/google`, {
            email: profile.email,
            name: profile.name,
            googleId: profile.sub || profile.id || account.providerAccountId,
            avatar: profile.picture || profile.image || user?.image,
          });
          
          const backendUser = response.data;
          if (backendUser) {
            token.id = backendUser.id;
            token.role = backendUser.role;
            token.accessToken = backendUser.token;
          }
        } catch (error) {
          console.error("Backend Google Auth Error:", error);
        }
      } else if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
