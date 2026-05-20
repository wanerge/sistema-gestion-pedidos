"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  deleted: boolean;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: "ADMIN" | "USER";
};

function UserActionsCell({
  userId,
  userName,
}: Readonly<{ userId: string; userName: string }>) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const handleDeleteSuccess = () => {
    setDeleteOpen(false);
    router.refresh();
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
            <Link href={`/users/create/${userId}`}>
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
        userId={userId}
        userName={userName}
        onClose={handleDeleteSuccess}
      />
    </AlertDialog>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "image",
    header: "Avatar",
    cell: ({ row }) => {
      const image = row.getValue("image");
      const name = row.getValue("name");
      return (
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src={image as string} alt={name as string} />
            <AvatarFallback>
              {(name as string)?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const userId = row.original.id;
      const userName = row.original.name;
      return <UserActionsCell userId={userId} userName={userName} />;
    },
  },
];
