import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  if (nextUrl.pathname.startsWith("/api/auth")) return undefined;

  const isPublicRoute =
    ["/", "/login", "/register", "/templates"].includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/templates/") ||
    nextUrl.pathname.startsWith("/blog") ||
    nextUrl.pathname.startsWith("/pricing") ||
    nextUrl.pathname.startsWith("/about");

  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return undefined;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
