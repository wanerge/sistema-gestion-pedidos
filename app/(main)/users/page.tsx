"use client";

import * as React from "react";
import { columns, User } from "./columns";
import { DataTable } from "@/components/data-table-general";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserPage() {
  const [data, setData] = React.useState<User[]>([]);

  async function getData() {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch users.");
        }
        return res;
      });
      const users = await response.json();
      setData(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setData([]);
    }
  }

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container mx-auto p-10">
      <div className="mb-6 flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona tus usuarios aquí.
          </p>
        </div>
        <Link href="/users/create">
          <Button size="lg">Agregar Usuario</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
