import { NextRequest, NextResponse } from "next/server";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "@/lib/jwt";

type RouteRule = { path: string; roles: string[] };

const publicRoutes = new Set(["/login", "/", "/403", "/reviews"]);

const routeRules: RouteRule[] = [
  { path: "/welcome", roles: ["ADMIN", "USER"] },
  { path: "/products/create", roles: ["ADMIN"] },
  { path: "/products/edit", roles: ["ADMIN"] },
  { path: "/products", roles: ["ADMIN", "USER"] },
  { path: "/movements", roles: ["ADMIN", "USER"] },
  { path: "/transactions", roles: ["ADMIN", "USER"] },
  { path: "/users", roles: ["ADMIN"] },
  { path: "/dashboard", roles: ["OPCION"] },
];

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = publicRoutes.has(pathname);

  const sortedRules = routeRules.toSorted(
    (a, b) => b.path.length - a.path.length,
  );
  const rule = sortedRules.find(
    (r) => pathname === r.path || pathname.startsWith(r.path + "/"),
  );

  // CASO 1: Ya autenticado intentando ir a ruta pública
  if (isAuthRoute && (accessToken || refreshToken)) {
    try {
      const payload = accessToken
        ? verifyAccessToken(accessToken)
        : verifyRefreshToken(refreshToken!);

      if (payload)
        return NextResponse.redirect(new URL("/welcome", request.url));
    } catch {
      // Tokens inválidos → dejar pasar al login normalmente
    }
  }

  if (!rule) return NextResponse.next();

  // CASO 2: Ruta protegida
  if (!accessToken) {
    if (!refreshToken) return redirectToLogin(request);
    return handleTokenRefresh(refreshToken, rule, request);
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
    if (!refreshToken) return redirectToLogin(request);
    return handleTokenRefresh(refreshToken, rule, request);
  }
}

function handleTokenRefresh(
  refreshToken: string,
  rule: RouteRule,
  request: NextRequest,
) {
  try {
    const decoded = verifyRefreshToken(refreshToken) as {
      id: string;
      role: string;
      email: string;
    };
    if (!rule.roles.includes(decoded.role)) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
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
    return redirectToLogin(request);
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/welcome/:path*",
    "/users/:path*",
    "/products/:path*",
    "/movements/:path*",
    "/transactions/:path*",
    "/dashboard/:path*",
  ],
};
