"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";

// ─── Columnas sin búsqueda ────────────────────────────────────────────────────

const EXCLUDED_FROM_SEARCH = new Set(["actions", "image", "avatar"]);

// ─── Extrae un string de cualquier valor de celda ─────────────────────────────
// - strings     → tal cual
// - números     → valor absoluto (para buscar "2" en "+2" o "-2")
// - objetos     → une los valores hijos (ej: { name: "Laptop" } → "Laptop")
// - booleanos   → "true" / "false"

function extractString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  //if (typeof value === "number") return String(Math.abs(value));
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map(extractString)
      .join(" ");
  }
  return String(value);
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /**
   * Rol del usuario. Si se pasa y NO es "ADMIN", la columna "actions"
   * muestra "—" en lugar de los botones.
   */
  roleUser?: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DataTable<TData, TValue>({
  columns,
  data,
  roleUser,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchValue, setSearchValue] = React.useState("");
  const [activeColumn, setActiveColumn] = React.useState<string>("");

  // ── Filtrado manual ─────────────────────────────────────────────────────────
  // Lo hacemos fuera de TanStack para poder extraer strings de objetos anidados,
  // ignorar mayúsculas y comparar números sin signo.
  const filteredData = React.useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query || !activeColumn) return data;

    return data.filter((row) => {
      const raw = (row as Record<string, unknown>)[activeColumn];
      return extractString(raw).toLowerCase().includes(query);
    });
  }, [data, searchValue, activeColumn]);

  const table = useReactTable({
    data: filteredData, // ← datos ya filtrados
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: { sorting, columnVisibility, pagination },
  });

  // ── Columnas disponibles para búsqueda ──────────────────────────────────────
  const searchableColumns = React.useMemo(() => {
    return columns
      .map((col) =>
        "accessorKey" in col ? String(col.accessorKey) : (col.id ?? ""),
      )
      .filter((id) => id && !EXCLUDED_FROM_SEARCH.has(id));
  }, [columns]);

  // Inicializar con la primera columna
  React.useEffect(() => {
    if (searchableColumns.length > 0 && activeColumn === "") {
      setActiveColumn(searchableColumns[0]);
    }
  }, [searchableColumns, activeColumn]);

  // Etiqueta legible desde el header de la columna
  function getColumnLabel(columnId: string): string {
    const col = columns.find(
      (c) => ("accessorKey" in c ? String(c.accessorKey) : c.id) === columnId,
    );
    if (!col) return columnId;
    const header = col.header;
    if (typeof header === "string" && header.trim()) return header;
    return columnId.charAt(0).toUpperCase() + columnId.slice(1);
  }

  function handleColumnChange(newId: string | null) {
    if (!newId) return;
    setSearchValue("");
    setActiveColumn(newId);
    // Resetear a la primera página al cambiar columna
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  function handleSearchChange(value: string) {
    setSearchValue(value);
    // Resetear a la primera página al buscar
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const restrictActions = roleUser !== undefined && roleUser !== "ADMIN";

  return (
    <div className="space-y-4">
      {/* Barra superior */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select value={activeColumn} onValueChange={handleColumnChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Columna" />
            </SelectTrigger>
            <SelectContent>
              {searchableColumns.map((id) => (
                <SelectItem key={id} value={id}>
                  {getColumnLabel(id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder={`Buscar por ${getColumnLabel(activeColumn).toLowerCase()}...`}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-56"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Filas por página</span>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) =>
              value &&
              setPagination((prev) => ({
                ...prev,
                pageSize: Number(value),
                pageIndex: 0,
              }))
            }
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <span className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() === "asc" && " ↑"}
                        {header.column.getIsSorted() === "desc" && " ↓"}
                      </span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === "actions" && restrictActions) {
                      return (
                        <TableCell key={cell.id}>
                          <span className="text-muted-foreground">—</span>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {Math.max(table.getPageCount(), 1)}
          {" · "}
          {filteredData.length} resultado
          {filteredData.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <RiArrowLeftLine className="size-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
            <RiArrowRightLine className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
