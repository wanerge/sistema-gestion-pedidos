"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ChartSeries {
  /** Clave del objeto de datos (ej: "INPUT", "OUTPUT", "desktop") */
  key: string;
  /** Etiqueta visible en el tooltip */
  label: string;
  /** Color CSS (ej: "var(--primary)", "#10b981") */
  color: string;
}

export interface ChartAreaProps {
  /** Array de puntos. Cada objeto debe tener la clave xAxisKey + las claves de series */
  data: Record<string, unknown>[];
  /** Clave del eje X en cada objeto de datos (ej: "date") */
  xAxisKey: string;
  /** Configuración de cada línea/área */
  series: ChartSeries[];
  /** Título de la card */
  title: string;
  /** Descripción debajo del título */
  description?: string;
  /**
   * Formateador del eje X. Por defecto asume que xAxisKey es una fecha ISO
   * y la muestra como "Apr 1".
   */
  xAxisFormatter?: (value: string) => string;
  /** Mostrar selector de rango de tiempo. Por defecto: true */
  showTimeRange?: boolean;
  /**
   * Si showTimeRange es true, esta función recibe el rango seleccionado
   * ("90d" | "30d" | "7d") y el array de datos, y devuelve los datos filtrados.
   * Por defecto filtra asumiendo que xAxisKey es una fecha ISO.
   */
  filterByRange?: (
    data: Record<string, unknown>[],
    range: string,
  ) => Record<string, unknown>[];
}

// ─── Filtro por defecto (asume fechas ISO en xAxisKey) ───────────────────────

function defaultFilterByRange(
  data: Record<string, unknown>[],
  range: string,
  xAxisKey: string,
): Record<string, unknown>[] {
  const referenceDate = new Date(
    Math.max(...data.map((d) => new Date(d[xAxisKey] as string).getTime())),
  );
  const daysMap: Record<string, number> = { "90d": 90, "30d": 30, "7d": 7 };
  const days = daysMap[range] ?? 90;
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - days);
  return data.filter((item) => new Date(item[xAxisKey] as string) >= startDate);
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ChartArea({
  data,
  xAxisKey,
  series,
  title,
  description,
  xAxisFormatter,
  showTimeRange = true,
  filterByRange,
}: ChartAreaProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  // Construir chartConfig dinámicamente desde series
  const chartConfig = React.useMemo<ChartConfig>(() => {
    return series.reduce<ChartConfig>((acc, s) => {
      acc[s.key] = { label: s.label, color: s.color };
      return acc;
    }, {});
  }, [series]);

  // Filtrar datos
  const filteredData = React.useMemo(() => {
    if (!showTimeRange) return data;
    if (filterByRange) return filterByRange(data, timeRange);
    return defaultFilterByRange(data, timeRange, xAxisKey);
  }, [data, timeRange, showTimeRange, filterByRange, xAxisKey]);

  // Formateador del eje X
  const formatXAxis = React.useCallback(
    (value: string) => {
      if (xAxisFormatter) return xAxisFormatter(value);
      const date = new Date(value + "T12:00:00");
      return isNaN(date.getTime())
        ? value
        : date.toLocaleDateString("es-CO", { month: "short", day: "numeric" });
    },
    [xAxisFormatter],
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription>
            <span className="hidden @[540px]/card:block">{description}</span>
          </CardDescription>
        )}
        {showTimeRange && (
          <CardAction>
            <ToggleGroup
              multiple={false}
              value={timeRange ? [timeRange] : []}
              onValueChange={(value) => setTimeRange(value[0] ?? "90d")}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
              <ToggleGroupItem value="30d">Últimos 30 días</ToggleGroupItem>
              <ToggleGroupItem value="7d">Últimos 7 días</ToggleGroupItem>
            </ToggleGroup>
            <Select
              value={timeRange}
              onValueChange={(value) => {
                if (value) setTimeRange(value);
              }}
            >
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Seleccionar rango"
              >
                <SelectValue placeholder="Últimos 3 meses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Últimos 3 meses
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Últimos 30 días
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Últimos 7 días
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {series.map((s) => (
                <linearGradient
                  key={s.key}
                  id={`fill-${s.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${s.key})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${s.key})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatXAxis}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatXAxis(value)}
                  indicator="dot"
                />
              }
            />
            {series.map((s) => (
              <Area
                key={s.key}
                dataKey={s.key}
                type="natural"
                fill={`url(#fill-${s.key})`}
                stroke={`var(--color-${s.key})`}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
