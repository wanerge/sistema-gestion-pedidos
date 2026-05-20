export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const accessToken = request.cookies.get("accessToken")?.value;

    // Si existe refresh token, lo invalidamos en DB
    if (refreshToken) {
      await prisma.user.updateMany({
        where: {
          refreshToken,
        },
        data: {
          refreshToken: null,
        },
      });
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
