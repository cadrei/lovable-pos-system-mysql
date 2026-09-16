import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, DollarSign, Receipt, ShoppingCart, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fechaHora, money } from "@/lib/format";
import { useSession } from "@/hooks/use-session";
import { panelFn } from "@/server-functions/fnpanel";
import { useMemo, useState } from "react";
import { sucursalesFn } from "@/server-functions/fnsucursales";

export const Route = createFileRoute("/_authenticated/panel")({
  head: () => ({
    meta: [
      { title: "Panel general — PuntoVenta" },
      {
        name: "description",
        content: "Indicadores de ventas, alertas de stock y actividad reciente.",
      },
      { property: "og:title", content: "Panel general — PuntoVenta" },
      { property: "og:description", content: "Indicadores de ventas y stock en tiempo real." },
    ],
  }),
  component: Panel,
});

function Panel() {
  const navigate = useNavigate();
  const { session, loading, nombre, email, sucursalId } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["panel"],
    queryFn: async () => {
      const id = sucursalId;
      if (!id) {
        throw new Error("No hay una sucursal seleccionada");
      }
      const result = await panelFn({ data: { sucursalId: id } });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !loading && !!session && !!sucursalId,
  });

  const { data: sucursales, isError: isSucursalesError } = useQuery({
    queryKey: ["sucursales"],
    queryFn: async () => {
      const result = await sucursalesFn();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !loading && !!session,
  });

  /*useEffect(() => {
    if (isSucursalesError) {
      toast.error("Error al cargar sucursales. Intenta nuevamente.");
    }
  }, [isSucursalesError]); */

  const [page, setPage] = useState(0);
  const pageSize = 8;

  // Memoizar cálculos pesados que NO dependen de la paginación
  const {
    ventas,
    ventasHoy,
    totalHoy,
    totalMes,
    utilidad,
    bajoStock,
    ticketPromedio,
    serie,
    kpis,
    totalPages,
  } = useMemo(() => {
    if (!data) {
      return {
        ventas: [],
        ventasHoy: [],
        totalHoy: 0,
        totalMes: 0,
        utilidad: 0,
        bajoStock: [],
        ticketPromedio: 0,
        serie: [],
        kpis: [],
        totalPages: 0,
      };
    }

    // Ventas completadas
    const ventas = (data?.ventas ?? []).filter((v) => v.estadoPago === "C");

    // Ventas de hoy
    const hoy = new Date().toDateString();
    const ventasHoy = ventas.filter((v) => {
      const fechaVenta = new Date(v.fechaHora).toDateString();
      return fechaVenta === hoy;
    });

    // Totales
    const totalHoy = ventasHoy.reduce((s, v) => s + Number(v.total), 0);
    const totalMes = ventas.reduce((s, v) => s + Number(v.total), 0);

    const utilidad = ventas.reduce(
      (s, v) => s + (Number(v.subtotal) - Number(v.descuento) - Number(v.valorImpuesto)),
      0,
    );

    // Productos bajo stock
    const bajoStock = (data?.productos ?? []).filter(
      (p) => Number(p.cantidad) > 1 && Number(p.cantidad) < Number(p.stockMin),
    );

    // --- Promedio de venta ---
    const ticketPromedio = ventas.length > 0 ? totalMes / ventas.length : 0;

    // --- Serie últimos 14 días ---
    const serie: { dia: string; ventas: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      // Clave en formato local (Ecuador)
      const key = d.toLocaleDateString("es-EC", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      // Ventas de ese día usando comparación local
      const ventasDia = (data?.ventas ?? [])
        .filter((v) => {
          const fechaVentaLocal = new Date(v.fechaHora).toLocaleDateString("es-EC", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          return fechaVentaLocal === key;
        })
        .reduce((s, v) => s + Number(v.total), 0);
      serie.push({
        dia: d.toLocaleDateString("es-EC", { day: "2-digit", month: "short" }),
        ventas: ventasDia,
      });
    }

    const kpis = [
      {
        label: "Ventas de hoy",
        value: money(totalHoy),
        sub: `${ventasHoy.length} transacciones`,
        icon: DollarSign,
      },
      {
        label: "Ventas 30 días",
        value: money(totalMes),
        sub: `${ventas.length} transacciones`,
        icon: ShoppingCart,
      },
      {
        label: "Utilidad bruta 30 días",
        value: money(utilidad),
        sub: "Ingresos menos descuentos e impuestos",
        icon: TrendingUp,
      },
      {
        label: "Venta promedio",
        value: money(ticketPromedio),
        sub: `${ventas.length} ventas`,
        icon: Receipt,
      },
    ];

    return {
      ventas,
      ventasHoy,
      totalHoy,
      totalMes,
      utilidad,
      bajoStock,
      ticketPromedio,
      serie,
      kpis,
      totalPages: Math.ceil(bajoStock.length / pageSize),
    };
  }, [data]);

  // Memoizar solo el slice de paginación (cálculo ligero con diff acotado)
  const productosPagina = useMemo(() => {
    return bajoStock.slice(page * pageSize, (page + 1) * pageSize);
  }, [bajoStock, page]);

  if (loading) {
    // 🔒 Protección de ruta
    return <p className="text-center mt-10">Cargando sesión...</p>;
  }
  if (!session) {
    console.warn("⚠️ [Panel] No hay sesión activa, redirigiendo a /auth");
    navigate({ to: "/auth", replace: true });
    return null;
  }
  console.log("🔵 [Panel] Sesión activa:", { nombre, email });

  return (
    <AppShell
      title="Panel general"
      subtitle="Resumen operativo del negocio"
      actions={
        <Button asChild>
          <Link to="/ventas">Nueva venta</Link>
        </Button>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando indicadores…</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map(({ label, value, sub, icon: Icon }) => (
              <div key={label} className="stat-tile">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <Icon className="size-4 text-primary" />
                </div>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="stat-tile lg:col-span-2">
              <h2 className="text-sm font-semibold">Ventas de los últimos 14 días</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={serie}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v: number | string) => money(Number(v))}
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ventas"
                      stroke="var(--color-chart-1)"
                      fill="url(#g1)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="stat-tile">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-warning" />
                <h2 className="text-sm font-semibold">Alertas de stock</h2>
              </div>

              <ul className="mt-4 space-y-3">
                {productosPagina.map((p) => (
                  <li key={p.idProducto} className="flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {p.nombreProducto.length > 50
                          ? p.nombreProducto.slice(0, 50) + "..."
                          : p.nombreProducto}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">{p.idProducto}</p>
                    </div>
                    <Badge variant="destructive">
                      {Number(p.cantidad)} / {Number(p.stockMin)}
                    </Badge>
                  </li>
                ))}

                {!bajoStock.length && (
                  <li className="text-sm text-muted-foreground">
                    Todo el inventario sobre el mínimo.
                  </li>
                )}
              </ul>

              {/* Controles de paginación con shadcn */}
              {totalPages > 1 && (
                <div className="w-full overflow-x-auto mt-4">
                  <Pagination className="justify-center">
                    <PaginationContent className="flex-nowrap">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 0) setPage(page - 1);
                          }}
                          className={
                            page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {(() => {
                        const items = [];
                        const maxVisible = 5; // Máximo de botones de página visibles
                        // Siempre mostrar primera página
                        items.push(
                          <PaginationItem key={0}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(0);
                              }}
                              isActive={page === 0}
                              className="cursor-pointer"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>,
                        );

                        // Calcular rango de páginas visibles alrededor de la actual
                        let start = Math.max(1, page - 1);
                        let end = Math.min(totalPages - 2, page + 1);

                        // Ajustar para mantener maxVisible páginas en el centro
                        const visibleCount = end - start + 1;
                        if (visibleCount < maxVisible && start === 1) {
                          end = Math.min(totalPages - 2, start + maxVisible - 1);
                        } else if (visibleCount < maxVisible && end === totalPages - 2) {
                          start = Math.max(1, end - maxVisible + 1);
                        }

                        // Ellipsis después de la primera página si es necesario
                        if (start > 1) {
                          items.push(
                            <PaginationItem key="ellipsis-start">
                              <PaginationEllipsis />
                            </PaginationItem>,
                          );
                        }

                        // Páginas intermedias
                        for (let i = start; i <= end; i++) {
                          items.push(
                            <PaginationItem key={i}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPage(i);
                                }}
                                isActive={i === page}
                                className="cursor-pointer"
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>,
                          );
                        }

                        // Ellipsis antes de la última página si es necesario
                        if (end < totalPages - 2) {
                          items.push(
                            <PaginationItem key="ellipsis-end">
                              <PaginationEllipsis />
                            </PaginationItem>,
                          );
                        }

                        // Siempre mostrar última página si hay más de 1 página
                        if (totalPages > 1) {
                          items.push(
                            <PaginationItem key={totalPages - 1}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPage(totalPages - 1);
                                }}
                                isActive={page === totalPages - 1}
                                className="cursor-pointer"
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>,
                          );
                        }

                        return items;
                      })()}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages - 1) setPage(page + 1);
                          }}
                          className={
                            page === totalPages - 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>

          <div className="stat-tile">
            <h2 className="text-sm font-semibold">Ventas recientes</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-2">Número</th>
                    <th>Fecha</th>
                    <th>Cajero</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.ventas ?? []).slice(0, 8).map((v) => {
                    const fechaVenta =
                      typeof v.fechaHora === "string"
                        ? v.fechaHora
                        : new Date(v.fechaHora).toISOString();

                    return (
                      <tr key={v.idVenta} className="border-t border-border">
                        <td className="py-2 font-mono text-xs">{v.referenciaPago}</td>
                        <td className="text-muted-foreground">{fechaHora(fechaVenta)}</td>
                        <td>{v.empleado ?? "—"}</td>
                        <td className="text-right font-medium">{money(Number(v.total))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
