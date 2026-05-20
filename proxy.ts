import { NextRequest, NextResponse } from "next/server";

import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "@/lib/jwt";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  const pathname = request.nextUrl.pathname;

  const routeRules = [
    {
      path: "/dashboard",
      roles: ["ADMIN", "USER"],
    },
    {
      path: "/users",
      roles: ["ADMIN"],
    },
  ];

  const rule = routeRules.find((r) => pathname.startsWith(r.path));

  if (!rule) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = verifyAccessToken(accessToken) as {
      id: string;
      role: string;
      email: string;
    };

    if (!rule.roles.includes(payload.role)) {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    return NextResponse.next();
  } catch {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const decoded = verifyRefreshToken(refreshToken) as {
        id: string;
        role: string;
        email: string;
      };

      const newAccessToken = generateAccessToken({
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
      });

      const response = NextResponse.next();

      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 15,
      });

      return response;
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*"],
};
