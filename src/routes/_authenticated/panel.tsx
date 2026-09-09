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
import { fechaHora, money } from "@/lib/format";
import { useSession } from "@/hooks/use-session";
import { panelFn } from "@/server-functions/fnpanel";
import { sucursalesFn } from "@/server-functions/fnsucursales";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VentaRow } from "@/types/mysqltypes";

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
        console.error("❌ [/scr/routes/authenticated/Panel.tsx] Error: Mensaje= ", result.error);
        throw new Error(result.error);
      }
      // console.log("✅ [Panel] Datos crudos de Panel:", result.data);
      return result.data;
    },
    enabled: !loading && !!session && !!sucursalId,
  });

  const {
    data: sucursales,
    isLoading: isSucursalesLoading,
    isError,
  } = useQuery({
    queryKey: ["sucursales"],
    queryFn: async () => {
      const result = await sucursalesFn();
      if (!result.success) {
        console.error(
          "❌ [/src/routes/authenticated/Panel.tsx] Error cargando sucursales:",
          result.error,
        );
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !loading && !!session,
  });

  const [page, setPage] = useState(0);

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

  // Paginación
  const pageSize = 8;
  const totalPages = Math.ceil(bajoStock.length / pageSize);
  const productosPagina = bajoStock.slice(page * pageSize, (page + 1) * pageSize);

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

              {/* Controles de paginación */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 text-sm">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    ← Anterior
                  </button>
                  <span>
                    Página {page + 1} de {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    Siguiente →
                  </button>
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
