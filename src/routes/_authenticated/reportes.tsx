import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/hooks/use-session";
import { fecha, fechaHora, money, num } from "@/lib/format";
import { fnGetSesionesCajaReporte } from "@/server-functions/fncajaReporte";
import { fnGetVistaDetalleVentasReporte } from "@/server-functions/fndetalleVistaVentas";
import { fnPagosMetodoGet } from "@/server-functions/fnpagos";
import { fnGetProductosReporte } from "@/server-functions/fnproductosReporte";
import { fnGetVistaVentasReporte } from "@/server-functions/fnvistaVentas";

export const Route = createFileRoute("/_authenticated/reportes")({
  head: () => ({
    meta: [
      { title: "Reportes — PuntoVenta" },
      {
        name: "description",
        content: "Reportes de ventas, productos, inventario y caja con exportación a CSV.",
      },
      { property: "og:title", content: "Reportes — PuntoVenta" },
      { property: "og:description", content: "Analítica comercial del punto de venta." },
    ],
  }),
  component: Reportes,
});

const rangos = [
  { id: "hoy", label: "Hoy", dias: 0 },
  { id: "7", label: "7 días", dias: 6 },
  { id: "30", label: "30 días", dias: 29 },
  { id: "mes", label: "Mes actual", dias: -1 },
] as const;

function isoDia(d: Date) {
  return d.toISOString().slice(0, 10);
}

function descargarCsv(nombre: string, filas: (string | number)[][]) {
  const csv = filas
    .map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nombre}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Reportes() {
  const { can, sucursalId } = useSession();
  const [rango, setRango] = useState<string>("30");
  const [desdeManual, setDesdeManual] = useState("");
  const [hastaManual, setHastaManual] = useState("");

  const { desde, hasta } = useMemo(() => {
    if (rango === "custom" && desdeManual && hastaManual) {
      return { desde: `${desdeManual}T00:00:00.000Z`, hasta: `${hastaManual}T23:59:59.999Z` };
    }
    const hoy = new Date();
    const fin = new Date(hoy);
    fin.setHours(23, 59, 59, 999);
    const cfg = rangos.find((r) => r.id === rango);
    const ini = new Date(hoy);
    if (cfg?.dias === -1) ini.setDate(1);
    else ini.setDate(hoy.getDate() - (cfg?.dias ?? 29));
    ini.setHours(0, 0, 0, 0);
    return { desde: ini.toISOString(), hasta: fin.toISOString() };
  }, [rango, desdeManual, hastaManual]);

  const ventasQ = useQuery({
    queryKey: ["rep-ventas", desde, hasta],
    queryFn: async () => {
      const result = await fnGetVistaVentasReporte({ data: { desde, hasta } });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const pagosQ = useQuery({
    queryKey: ["rep-pagos", desde, hasta],
    queryFn: async () => {
      const result = await fnPagosMetodoGet({ data: { desde, hasta } });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const itemsQ = useQuery({
    queryKey: ["rep-items", desde, hasta],
    queryFn: async () => {
      const result = await fnGetVistaDetalleVentasReporte({ data: { desde, hasta } });
      if (!result.success) throw new Error(result.error);
      return result.data.map((item) => ({
        ...item,
        sales: { created_at: item.created_at, status: item.status },
      }));
    },
  });

  const productosQ = useQuery({
    queryKey: ["rep-productos"],
    queryFn: async () => {
      const result = await fnGetProductosReporte({ data: { sucursalId: sucursalId || "" } });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const cajasQ = useQuery({
    queryKey: ["rep-caja", desde, hasta],
    queryFn: async () => {
      const result = await fnGetSesionesCajaReporte({ data: { desde, hasta } });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const ventas = (ventasQ.data ?? []).filter((v) => v.status !== "anulada");
  const totalVentas = ventas.reduce((a, v) => a + Number(v.total), 0);
  const costo = ventas.reduce((a, v) => a + Number(v.cost_total ?? 0), 0);
  const ticket = ventas.length ? totalVentas / ventas.length : 0;

  const serie = useMemo(() => {
    const mapa = new Map<string, number>();
    ventas.forEach((v) => {
      const d = isoDia(new Date(v.created_at));
      mapa.set(d, (mapa.get(d) ?? 0) + Number(v.total));
    });
    return [...mapa.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dia, total]) => ({ dia: dia.slice(5), total: Number(total.toFixed(2)) }));
  }, [ventas]);

  const porMetodo = useMemo(() => {
    const mapa = new Map<string, number>();
    (pagosQ.data ?? []).forEach((p) =>
      mapa.set(p.method, (mapa.get(p.method) ?? 0) + Number(p.amount)),
    );
    return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
  }, [pagosQ.data]);

  const topProductos = useMemo(() => {
    const mapa = new Map<string, { cantidad: number; importe: number; utilidad: number }>();
    (itemsQ.data ?? [])
      .filter((i) => i.sales?.status !== "anulada")
      .forEach((i) => {
        const prev = mapa.get(i.description) ?? { cantidad: 0, importe: 0, utilidad: 0 };
        prev.cantidad += Number(i.quantity);
        prev.importe += Number(i.total);
        prev.utilidad += Number(i.total) - Number(i.unit_cost) * Number(i.quantity);
        mapa.set(i.description, prev);
      });
    return [...mapa.entries()]
      .map(([nombre, v]) => ({ nombre, ...v }))
      .sort((a, b) => b.importe - a.importe)
      .slice(0, 20);
  }, [itemsQ.data]);

  const productos = productosQ.data ?? [];
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(productos.length / pageSize);
  const productosPagina = productos.slice((page - 1) * pageSize, page * pageSize); //paginacion productos reporte
  // Función para calcular rango de páginas visibles
  const getVisiblePages = () => {
    const maxVisible = 5; // máximo de páginas visibles
    let start = Math.max(1, page);
    const end = Math.min(totalPages, start + maxVisible - 1);
    // Ajustar si estamos cerca del final
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const valorCosto = productos.reduce((a, p) => a + Number(p.stock) * Number(p.cost_price), 0);
  const valorVenta = productos.reduce((a, p) => a + Number(p.stock) * Number(p.sale_price), 0);
  const bajoMinimo = productos.filter((p) => Number(p.stock) <= Number(p.min_stock));

  const sesiones = cajasQ.data ?? [];
  const puedeExportar = can("reportes.exportar");

  return (
    <AppShell
      title="Reportes"
      subtitle="Analítica de ventas, productos, inventario y caja"
      actions={
        <div className="flex flex-wrap items-center gap-1">
          {rangos.map((r) => (
            <Button
              key={r.id}
              size="sm"
              variant={rango === r.id ? "default" : "outline"}
              onClick={() => setRango(r.id)}
            >
              {r.label}
            </Button>
          ))}
          <Button
            size="sm"
            variant={rango === "custom" ? "default" : "outline"}
            onClick={() => setRango("custom")}
          >
            Personalizado
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {rango === "custom" && (
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
            <div className="space-y-1.5">
              <Label>Desde</Label>
              <Input
                type="date"
                value={desdeManual}
                onChange={(e) => setDesdeManual(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hasta</Label>
              <Input
                type="date"
                value={hastaManual}
                onChange={(e) => setHastaManual(e.target.value)}
              />
            </div>
          </div>
        )}

        <Tabs defaultValue="ventas">
          <TabsList>
            <TabsTrigger value="ventas">Ventas</TabsTrigger>
            <TabsTrigger value="productos">Categorias</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="caja">Caja</TabsTrigger>
          </TabsList>

          <TabsContent value="ventas" className="space-y-4 pt-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi
                label="Total facturado"
                value={money(totalVentas)}
                hint={`${ventas.length} ventas`}
              />
              <Kpi label="Ticket promedio" value={money(ticket)} />
              <Kpi
                label="Utilidad bruta"
                value={money(totalVentas - costo)}
                hint={`Costo ${money(costo)}`}
              />
              <Kpi
                label="Margen"
                value={`${totalVentas ? num(((totalVentas - costo) / totalVentas) * 100, 1) : "0"}%`}
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 text-sm font-medium">Evolución diaria</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={serie}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="dia" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(v: number) => money(v)} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {porMetodo.map(([metodo, monto]) => (
                <Kpi key={metodo} label={metodo} value={money(monto)} />
              ))}
            </div>

            {puedeExportar && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  descargarCsv("ventas", [
                    ["Número", "Fecha", "Usuario", "Subtotal", "IVA", "Descuento", "Total"],
                    ...ventas.map((v) => [
                      v.number,
                      fechaHora(v.created_at),
                      v.user_name ?? "",
                      v.subtotal,
                      v.tax,
                      v.discount,
                      v.total,
                    ]),
                  ])
                }
              >
                Exportar CSV
              </Button>
            )}

            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Número</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th className="text-right">Subtotal</th>
                    <th className="text-right">IVA</th>
                    <th className="pr-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.slice(0, 100).map((v) => (
                    <tr key={v.id} className="border-t border-border">
                      <td className="p-3 font-mono text-xs">{v.number}</td>
                      <td className="text-muted-foreground">{fechaHora(v.created_at)}</td>
                      <td className="text-muted-foreground">{v.user_name ?? "—"}</td>
                      <td className="text-right">{money(v.subtotal)}</td>
                      <td className="text-right">{money(v.tax)}</td>
                      <td className="pr-3 text-right font-medium">{money(v.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="productos" className="space-y-4 pt-4">
            {puedeExportar && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  descargarCsv("categoria-vendidos", [
                    ["Producto", "Cantidad", "Importe", "Utilidad"],
                    ...topProductos.map((p) => [
                      p.nombre,
                      p.cantidad,
                      p.importe.toFixed(2),
                      p.utilidad.toFixed(2),
                    ]),
                  ])
                }
              >
                Exportar CSV
              </Button>
            )}
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Categoria</th>
                    <th className="text-right">Cantidad</th>
                    <th className="text-right">Importe</th>
                    <th className="pr-3 text-right">Utilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {topProductos.map((p) => (
                    <tr key={p.nombre} className="border-t border-border">
                      <td className="p-3 font-medium">{p.nombre}</td>
                      <td className="text-right">{num(p.cantidad, 0)}</td>
                      <td className="text-right">{money(p.importe)}</td>
                      <td className="pr-3 text-right text-muted-foreground">{money(p.utilidad)}</td>
                    </tr>
                  ))}
                  {topProductos.length === 0 && (
                    <tr>
                      <td className="p-3 text-muted-foreground" colSpan={4}>
                        Sin ventas en el rango seleccionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="inventario" className="space-y-4 pt-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Kpi label="Valorización a costo" value={money(valorCosto)} />
              <Kpi label="Valorización a venta" value={money(valorVenta)} />
              <Kpi
                label="Bajo mínimo"
                value={String(bajoMinimo.length)}
                hint={`${productos.length} productos activos`}
              />
            </div>
            {puedeExportar && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  descargarCsv("inventario", [
                    ["Código", "Producto", "Stock", "Mínimo", "Costo", "Venta", "Valor costo"],
                    ...productos.map((p) => [
                      p.code,
                      p.name,
                      p.stock,
                      p.min_stock,
                      p.cost_price,
                      p.sale_price,
                      (Number(p.stock) * Number(p.cost_price)).toFixed(2),
                    ]),
                  ])
                }
              >
                Exportar CSV
              </Button>
            )}
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Código</th>
                    <th>Producto</th>
                    <th className="text-right">Stock</th>
                    <th className="text-right">Mínimo</th>
                    <th className="pr-3 text-right">Valor a costo</th>
                  </tr>
                </thead>
                <tbody>
                  {productosPagina.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="p-3 font-mono text-xs">{p.code}</td>
                      <td className="font-medium">{p.name}</td>
                      <td
                        className={`text-right ${
                          Number(p.stock) <= Number(p.min_stock)
                            ? "font-semibold text-destructive"
                            : ""
                        }`}
                      >
                        {num(p.stock, 0)}
                      </td>
                      <td className="text-right text-muted-foreground">{num(p.min_stock, 0)}</td>
                      <td className="pr-3 text-right">
                        {money(Number(p.stock) * Number(p.cost_price))}
                      </td>
                    </tr>
                  ))}
                  {productosPagina.length === 0 && (
                    <tr>
                      <td className="p-3 text-muted-foreground" colSpan={5}>
                        Sin productos en esta página.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Controles de paginación */}
            <div className="flex justify-center items-center mt-4 space-x-2 text-sm">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                ←
              </button>

              {/* Mostrar primera página y puntos suspensivos si corresponde */}
              {page > 2 && (
                <>
                  <button
                    onClick={() => setPage(1)}
                    className={`px-3 py-1 border rounded ${page === 1 ? "bg-primary text-white" : "bg-card"}`}
                  >
                    1
                  </button>
                  {page > 3 && <span className="px-2">...</span>}
                </>
              )}

              {/* Páginas visibles */}
              {getVisiblePages().map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-1 border rounded ${
                    page === num ? "bg-primary text-white" : "bg-card"
                  }`}
                >
                  {num}
                </button>
              ))}

              {/* Mostrar última página y puntos suspensivos si corresponde */}
              {page < totalPages - 1 && (
                <>
                  {page < totalPages - 2 && <span className="px-2">...</span>}
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`px-3 py-1 border rounded ${
                      page === totalPages ? "bg-primary text-white" : "bg-card"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                →
              </button>
            </div>
          </TabsContent>

          <TabsContent value="caja" className="space-y-4 pt-4">
            {puedeExportar && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  descargarCsv("caja", [
                    [
                      "Usuario",
                      "Apertura",
                      "Cierre",
                      "Inicial",
                      "Esperado",
                      "Declarado",
                      "Diferencia",
                      "Estado",
                    ],
                    ...sesiones.map((s) => [
                      s.user_name ?? "",
                      fechaHora(s.opened_at),
                      s.closed_at ? fechaHora(s.closed_at) : "",
                      s.opening_amount,
                      s.expected_amount ?? "",
                      s.declared_amount ?? "",
                      s.difference ?? "",
                      s.status,
                    ]),
                  ])
                }
              >
                Exportar CSV
              </Button>
            )}
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Usuario</th>
                    <th>Apertura</th>
                    <th>Cierre</th>
                    <th className="text-right">Esperado</th>
                    <th className="text-right">Declarado</th>
                    <th className="pr-3 text-right">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {sesiones.map((s) => (
                    <tr key={s.id} className="border-t border-border">
                      <td className="p-3 font-medium">{s.user_name ?? "—"}</td>
                      <td className="text-muted-foreground">{fecha(s.opened_at)}</td>
                      <td className="text-muted-foreground">
                        {s.closed_at ? fechaHora(s.closed_at) : "Abierta"}
                      </td>
                      <td className="text-right">
                        {s.expected_amount != null ? money(s.expected_amount) : "—"}
                      </td>
                      <td className="text-right">
                        {s.declared_amount != null ? money(s.declared_amount) : "—"}
                      </td>
                      <td
                        className={`pr-3 text-right ${Number(s.difference ?? 0) < 0 ? "text-destructive" : ""}`}
                      >
                        {s.difference != null ? money(s.difference) : "—"}
                      </td>
                    </tr>
                  ))}
                  {sesiones.length === 0 && (
                    <tr>
                      <td className="p-3 text-muted-foreground" colSpan={6}>
                        Sin sesiones de caja en el rango.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
