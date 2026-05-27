"use client";

import * as React from "react";
import { columns, InventoryMovement } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InventoryMovementsPage() {
  const [data, setData] = React.useState<InventoryMovement[]>([]);

  async function getData() {
    try {
      const response = await fetch("/api/movements/products", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch inventory movements.");
        }
        return res;
      });
      const movements = await response.json();
      setData(movements);
    } catch (error) {
      console.error("Error fetching inventory movements:", error);
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
          <h2 className="text-2xl font-bold tracking-tight">
            Movimientos de inventario
          </h2>
          <p className="text-sm text-muted-foreground">
            Gestiona los movimientos de inventario aquí.
          </p>
        </div>
        <Link href="/movements/products/create">
          <Button size="lg">Agregar Movimiento</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
