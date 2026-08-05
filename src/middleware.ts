import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  const isLoginPage = pathname === "/admin-login";
  const isAdminRoute = (pathname.startsWith("/admin") && !isLoginPage) || pathname === "/admin-analytics";

  // Unauthenticated users trying to access admin areas → redirect to login
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }

  // Authenticated users on login page → redirect to admin dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-analytics", "/admin-login"],
};
