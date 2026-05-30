import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { movement } = await request.json();
  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: {
          id: movement.productId,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      if (movement.type === "OUTPUT" && product.stock < movement.quantity) {
        throw new Error("Insufficient stock");
      }

      const createdMovement = await tx.inventoryMovement.create({
        data: {
          type: movement.type,
          quantity: movement.quantity,
          productId: movement.productId,
          createdById: movement.createdById,
          updatedById: movement.updatedById,
        },
      });

      await tx.product.update({
        where: {
          id: movement.productId,
        },
        data: {
          stock:
            movement.type === "INPUT"
              ? { increment: movement.quantity }
              : { decrement: movement.quantity },
          updatedById: movement.updatedById,
        },
      });
      return createdMovement;
    });
    return NextResponse.json({ movement: result }, { status: 201 });
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
