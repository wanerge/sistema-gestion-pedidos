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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdBy: { name: string };
  updatedBy: { name: string };
};

function ProductActionsCell({
  productId,
  productName,
}: Readonly<{ productId: string; productName: string }>) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const handleDeleteSuccess = () => {
    setDeleteOpen(false);
    router.push("/products");
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
            <Link href={`/products/edit/${productId}`}>
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
        id={productId}
        name={productName}
        onClose={handleDeleteSuccess}
        type="product"
      />
    </AlertDialog>
  );
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return <span>{`$${price.toFixed(2)}`}</span>;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      const createdBy = row.getValue("createdBy") as { name: string };
      return <span>{createdBy.name}</span>;
    },
  },
  {
    accessorKey: "updatedBy",
    header: "Updated By",
    cell: ({ row }) => {
      const updatedBy = row.getValue("updatedBy") as { name: string };
      return <span>{updatedBy.name}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const productId = row.original.id;
      const productName = row.original.name;
      return (
        <ProductActionsCell productId={productId} productName={productName} />
      );
    },
  },
];
