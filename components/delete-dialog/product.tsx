"use client";

import React from "react";

import { RiDeleteBin6Line } from "@remixicon/react";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function DeleteProductDialog({
  productId,
  productName,
  onClose,
}: Readonly<{
  productId: string;
  productName: string;
  onClose: () => void;
}>) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/product?id=${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      toast.success(`Product ${productName} deleted successfully`);
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(
        `Error deleting product ${productName}: Please try again later.`,
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialogContent size="sm">
      <AlertDialogHeader>
        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
          {isDeleting ? <Spinner /> : <RiDeleteBin6Line />}
        </AlertDialogMedia>
        <AlertDialogTitle>Delete product {productName}</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete. Are you sure you want to continue?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          onClick={async () => {
            await handleDelete();
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
