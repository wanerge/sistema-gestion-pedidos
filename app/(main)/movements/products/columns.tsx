"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { AlertDialog } from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiMore2Line, RiPencilLine, RiDeleteBin6Line } from "@remixicon/react";
import Delete from "@/components/delete-dialog/Index";

export type InventoryMovement = {
  id: string;
  type: "INPUT" | "OUTPUT";
  quantity: number;
  createdAt: string;
  createdBy: { name: string };
  product: { name: string };
};

function MovementActionsCell({
  movementId,
  movementName,
}: Readonly<{ movementId: string; movementName: string }>) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const handleDeleteSuccess = () => {
    setDeleteOpen(false);
    router.push("/movements/products");
    globalThis.location.reload();
  };

  return (
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <RiMore2Line className="ml-auto size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/movements/products/edit/${movementId}`}>
              <DropdownMenuItem>
                <RiPencilLine />
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <RiDeleteBin6Line />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Delete
        id={movementId}
        name={movementName}
        onClose={handleDeleteSuccess}
        type="movement"
      />
    </AlertDialog>
  );
}

export const columns: ColumnDef<InventoryMovement>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const product = row.getValue("product") as { name: string };
      return <span>{product.name}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <span>{new Date(createdAt).toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      const type = row.original.type;
      const isInput = type === "INPUT";
      return (
        <span
          className={
            isInput
              ? "font-medium text-emerald-600"
              : "font-medium text-red-600"
          }
        >
          {isInput ? "+" : "-"}
          {quantity}
        </span>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      const createdBy = row.getValue("createdBy") as { name: string };
      return <span>{createdBy.name}</span>;
    },
  },
  // {
  //   accessorKey: "actions",
  //   header: "",
  //   cell: ({ row }) => {
  //     const movementId = row.original.id;
  //     const movementName = row.original.id;
  //     return (
  //       <MovementActionsCell
  //         movementId={movementId}
  //         movementName={movementName}
  //       />
  //     );
  //   },
  // },
];
