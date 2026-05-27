"use client";

import * as React from "react";
import { columns, Product } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

interface User {
  id: string;
  role: string;
  email: string;
}

async function getUser() {
  const user = await getCurrentUser();
  return user;
}

export default function ProductPage() {
  const [data, setData] = React.useState<Product[]>([]);
  const [user, setUser] = React.useState<User | null>(null);

  async function getData() {
    try {
      const response = await fetch("/api/products", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products.");
        }
        return res;
      });
      const products = await response.json();
      setData(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setData([]);
    }
  }

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    getUser().then((res) => setUser(res));
  }, []);

  if (user) {
    return (
      <div className="container mx-auto p-10">
        <div className="mb-6 flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Productos</h2>
            <p className="text-sm text-muted-foreground">
              Gestiona tus productos aquí.
            </p>
          </div>
          {user.role === "ADMIN" && (
            <Link href="/products/create">
              <Button size="lg">Agregar Producto</Button>
            </Link>
          )}
        </div>
        <DataTable columns={columns} data={data} roleUser={user?.role} />
      </div>
    );
  }
}
