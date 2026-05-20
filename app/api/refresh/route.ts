export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // VERIFICAR JWT
    const decoded = verifyRefreshToken(refreshToken) as {
      id: string;
    };

    // BUSCAR USUARIO
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // VALIDAR TOKEN EN DB
    if (user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 },
      );
    }

    // NUEVO ACCESS TOKEN
    const newAccessToken = generateAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    // GUARDAR NUEVA COOKIE
    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 },
    );
  }
}
