import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const transactions = await prisma.payment.findMany({
      select: {
        id: true,
        paymentDate: true,
        amount: true,
        method: true,
        status: true,
        orderId: true,
      },
    });
    if (!transactions) {
      return NextResponse.json(
        { error: "No transactions found" },
        { status: 404 },
      );
    }
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
