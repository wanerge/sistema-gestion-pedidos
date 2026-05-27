import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { movement } = await request.json();
  try {
    const createdMovement = await prisma.inventoryMovement.create({
      data: {
        type: movement.type,
        quantity: movement.quantity,
        productId: movement.productId,
        createdById: movement.createdById,
        updatedById: movement.updatedById,
      },
    });
    return NextResponse.json({ movement: createdMovement }, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory movement:", error);
    return NextResponse.json(
      { error: "Failed to create inventory movement" },
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
        { error: "Movement ID is required" },
        { status: 400 },
      );
    }
    const movement = await prisma.inventoryMovement.findUnique({
      where: {
        id: id,
      },
    });
    if (!movement) {
      return NextResponse.json(
        { error: "Inventory movement not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ movement }, { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory movement:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory movement" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const { movement } = await request.json();

  try {
    const updatedMovement = await prisma.inventoryMovement.update({
      where: {
        id: movement.id,
      },
      data: {
        type: movement.type,
        quantity: movement.quantity,
        productId: movement.productId,
        updatedById: movement.updatedById,
      },
    });
    return NextResponse.json({ movement: updatedMovement }, { status: 200 });
  } catch (error) {
    console.error("Error updating inventory movement:", error);
    return NextResponse.json(
      { error: "Failed to update inventory movement" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const params = request.nextUrl.searchParams;
  const id = params.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Movement ID is required" },
      { status: 400 },
    );
  }
  try {
    await prisma.inventoryMovement.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      { message: "Inventory movement deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting inventory movement:", error);
    return NextResponse.json(
      { error: "Failed to delete inventory movement" },
      { status: 500 },
    );
  }
}
