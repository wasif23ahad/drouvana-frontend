import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Access token lifetime in ms — keep slightly under the backend JWT_EXPIRES_IN (1h)
const ACCESS_TOKEN_TTL_MS = 55 * 60 * 1000; // 55 minutes

async function refreshBackendToken(refreshToken: string) {
  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) throw new Error("Refresh failed");
  return response.json() as Promise<{ token: string; refreshToken: string }>;
}

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
          const response = await api.post(`${API_URL}/api/auth/login`, {
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
              refreshToken: user.refreshToken,
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
      // Initial sign-in: populate token fields
      if (account?.provider === "google" && profile) {
        try {
          const response = await api.post(`${API_URL}/api/auth/google`, {
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
            token.refreshToken = backendUser.refreshToken;
            token.accessTokenExpires = Date.now() + ACCESS_TOKEN_TTL_MS;
          }
        } catch (error) {
          console.error("Backend Google Auth Error:", error);
        }
      } else if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_TTL_MS;
      }

      // Sessions created before the refresh mechanism was added have no expiry or refreshToken.
      // Allow them to pass through — the 7d JWT_EXPIRES_IN means they'll still be valid.
      if (!token.accessTokenExpires) {
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_TTL_MS;
        return token;
      }

      // Token still valid — return as-is
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Token expired — try to refresh silently
      if (token.refreshToken) {
        try {
          const refreshed = await refreshBackendToken(token.refreshToken as string);
          token.accessToken = refreshed.token;
          token.refreshToken = refreshed.refreshToken;
          token.accessTokenExpires = Date.now() + ACCESS_TOKEN_TTL_MS;
          token.error = undefined;
        } catch {
          token.error = "RefreshTokenExpired";
        }
      } else {
        // Expired token and no refresh token — force re-login
        token.error = "RefreshTokenExpired";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
      }
      if (token.error) {
        (session as any).error = token.error;
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
    // NextAuth session lasts 7 days — matches refresh token TTL
    maxAge: 7 * 24 * 60 * 60,
  },
});
