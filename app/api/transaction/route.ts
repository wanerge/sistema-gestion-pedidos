import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { transaction } = await request.json();
  try {
    const createdTransaction = await prisma.payment.create({
      data: {
        amount: transaction.amount,
        method: transaction.method,
        status: transaction.status,
        orderId: transaction.orderId,
      },
    });
    return NextResponse.json(
      { transaction: createdTransaction },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const params = request.nextUrl.searchParams;
    const id = params.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 },
      );
    }
    const transaction = await prisma.payment.findUnique({
      where: {
        id: id,
      },
    });
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ transaction }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { transaction } = await request.json();

  try {
    const updatedTransaction = await prisma.payment.update({
      where: {
        id: transaction.id,
      },
      data: {
        amount: transaction.amount,
        method: transaction.method,
        status: transaction.status,
        orderId: transaction.orderId,
      },
    });
    return NextResponse.json(
      { transaction: updatedTransaction },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const params = request.nextUrl.searchParams;
  const id = params.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 },
    );
  }
  try {
    await prisma.payment.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 },
    );
  }
}
