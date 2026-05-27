import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const movements = await prisma.inventoryMovement.findMany({
      select: {
        id: true,
        type: true,
        quantity: true,
        createdAt: true,
        createdBy: {
          select: {
            name: true,
          },
        },
        product: { select: { name: true } },
      },
    });
    if (!movements) {
      return NextResponse.json(
        { error: "No inventory movements found" },
        { status: 404 },
      );
    }
    return NextResponse.json(movements, { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory movements:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory movements" },
      { status: 500 },
    );
  }
}
