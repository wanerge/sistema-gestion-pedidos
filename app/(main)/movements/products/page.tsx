"use client";

import * as React from "react";
import { columns, InventoryMovement } from "./columns";
import { DataTable } from "@/components/data-table-general";
import { ChartArea } from "@/components/chart-area-interactive-general";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ─── Tipo del gráfico — extiende Record<string, unknown> para ser compatible ──

interface ChartPoint extends Record<string, unknown> {
  date: string;
  INPUT: number;
  OUTPUT: number;
}

// ─── Agrega movimientos por fecha ─────────────────────────────────────────────

function aggregateMovementsForChart(
  movements: InventoryMovement[],
): ChartPoint[] {
  const map = new Map<string, ChartPoint>();

  for (const movement of movements) {
    // Después — usa fecha local, igual que la tabla
    const d = new Date(movement.createdAt);
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!map.has(date)) {
      map.set(date, { date, INPUT: 0, OUTPUT: 0 });
    }
    const point = map.get(date)!;
    if (movement.type === "INPUT") {
      point.INPUT += movement.quantity;
    } else {
      point.OUTPUT += movement.quantity;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

// ─── Series del gráfico ───────────────────────────────────────────────────────

const MOVEMENT_SERIES = [
  { key: "INPUT", label: "Entradas", color: "#10b981" },
  { key: "OUTPUT", label: "Salidas", color: "#ef4444" },
];

// ─── Página ───────────────────────────────────────────────────────────────────

export default function InventoryMovementsPage() {
  const [data, setData] = React.useState<InventoryMovement[]>([]);
  const [chartData, setChartData] = React.useState<ChartPoint[]>([]);
  const [products, setProducts] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [productId, setProductId] = React.useState<string>("");

  async function getProductsData() {
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
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  }

  React.useEffect(() => {
    async function fetchMovements() {
      try {
        const response = await fetch(
          `/api/movements/products?productId=${productId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        if (!response.ok)
          throw new Error("Failed to fetch inventory movements.");
        const movements: InventoryMovement[] = await response.json();
        setData(movements);
        setChartData(aggregateMovementsForChart(movements));
      } catch (error) {
        console.error("Error fetching inventory movements:", error);
      }
    }

    fetchMovements();
  }, [productId]);

  React.useEffect(() => {
    getProductsData();
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
      <div>
        <Select onValueChange={(v) => setProductId(v ?? "")} value={productId}>
          <SelectTrigger id="product-select">
            <SelectValue>
              {products.find((p) => p.id === productId)?.name ??
                "Select a product"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Productos</SelectLabel>
              <SelectItem key="" value="">
                Todos
              </SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Gráfico — solo se muestra si hay datos */}
            {chartData.length > 0 && (
              <div className="px-4 lg:px-6">
                <ChartArea
                  data={chartData}
                  xAxisKey="date"
                  series={MOVEMENT_SERIES}
                  title="Movimientos de inventario"
                  description="Entradas y salidas de productos en el tiempo"
                />
              </div>
            )}

            {/* Tabla */}
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
