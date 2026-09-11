import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/hooks/use-session";
import { money } from "@/lib/format";
import { getProductosFn } from "@/server-functions/fnproductos";
import { getClientesFn } from "@/server-functions/fnGetClientes";
import { getSesionCajaFn } from "@/server-functions/fncajaSesion";
import { getNextDocumentNumberFn } from "@/server-functions/fncajaNextDoc";
import { cobrarVentaFn } from "@/server-functions/fncobrarventa";

export const Route = createFileRoute("/_authenticated/ventas")({
  head: () => ({
    meta: [
      { title: "Punto de venta — PuntoVenta" },
      {
        name: "description",
        content: "Registra ventas con búsqueda de productos, descuentos y pagos.",
      },
      { property: "og:title", content: "Punto de venta — PuntoVenta" },
      { property: "og:description", content: "Caja rápida con carrito, descuentos y cobro." },
    ],
  }),
  component: POS,
});

type Linea = {
  productId: string;
  code: string;
  nombre: string;
  precio: number;
  costo: number;
  cantidad: number;
  stock: number;
};

function POS() {
  const qc = useQueryClient();
  const { nombre: cajero, sucursalId } = useSession();
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<Linea[]>([]);
  const [clienteId, setClienteId] = useState<string>("");
  const [metodo, setMetodo] = useState<"efectivo" | "tarjeta" | "transferencia">("efectivo");
  const [descuento, setDescuento] = useState(0);
  const [recibido, setRecibido] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busquedaCliente, setBusquedaCliente] = useState("");

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const { data: productos = [] } = useQuery({
    queryKey: ["pos-productos", sucursalId], // ✅ incluimos sucursalId en la key
    queryFn: async () => {
      if (!sucursalId) {
        throw new Error("No hay una sucursal seleccionada");
      }
      const result = await getProductosFn({ data: { sucursalId } }); // ✅ enviamos sucursalId
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!sucursalId, // ✅ solo ejecuta si hay sucursal
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["pos-clientes"],
    queryFn: async () => {
      const result = await getClientesFn();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const { data: sesionCaja } = useQuery({
    queryKey: ["caja-abierta"],
    queryFn: async () => {
      const result = await getSesionCajaFn();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  //Busqueda de clientes
  const [clienteSeleccionado, setClienteSeleccionado] = useState<(typeof clientes)[number] | null>(
    clientes.find((c) => c.id === 1) ?? null,
  );
  useEffect(() => {
    const cf = clientes.find((c) => c.id === 1);
    if (cf) {
      setClienteId(String(cf.id));
      setClienteSeleccionado(cf);
    }
  }, [clientes]);

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.name.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
      c.code.toLowerCase().includes(busquedaCliente.toLowerCase()),
  );
  const seleccionarCliente = (c: (typeof clientes)[number]) => {
    setClienteId(String(c.id)); // actualiza el id en el POS
    setClienteSeleccionado(c); // guarda el cliente escogido
    setBusquedaCliente(""); // limpia la búsqueda → cierra el cuadro
  };

  //Busqueda de productos
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos.slice(0, 12);
    return productos
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          (p.barcode ?? "").toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [busqueda, productos]);

  function agregar(p: (typeof productos)[number]) {
    setCarrito((prev) => {
      const ex = prev.find((l) => l.productId === p.id);
      if (ex)
        return prev.map((l) => (l.productId === p.id ? { ...l, cantidad: l.cantidad + 1 } : l));
      return [
        ...prev,
        {
          productId: p.id,
          code: p.code,
          nombre: p.name,
          precio: Number(p.sale_price),
          costo: Number(p.cost_price),
          cantidad: 1,
          stock: Number(p.stock),
        },
      ];
    });
    setBusqueda("");
  }

  // Quitar IVA del PVP para obtener base imponible
  const subtotalProductos = carrito.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const descuentoValor = Math.min(descuento, subtotalProductos);
  // Base imponible (subtotal sin IVA, después de descuento)
  const subtotal = +((subtotalProductos - descuentoValor) / 1.15).toFixed(3);
  // Impuesto (15% sobre la base imponible)
  const impuesto = +(subtotal * 0.15).toFixed(3);
  // Total (subtotal + impuesto)
  const total = +(subtotal + impuesto).toFixed(3);
  // Cambio (solo aplica si es efectivo)
  const cambio = Math.max(0, +(recibido - total).toFixed(3));
  const cobrar = useMutation({
    mutationFn: async () => {
      if (!carrito.length) throw new Error("El carrito está vacío");
      if (!sucursalId) throw new Error("No hay una sucursal seleccionada");

      const resultDoc = await getNextDocumentNumberFn({
        data: { docType: "venta", series: "V001-001" },
      });
      if (!resultDoc.success) throw new Error(resultDoc.error);
      const numeroDocumento = resultDoc.data;
      console.log("Número de documento:", numeroDocumento);

      const result = await cobrarVentaFn({
        data: {
          idSucursal: sucursalId, // Sucursal de la Sesion
          idCliente: Number(clienteId),
          idEmpleado: 7,
          metodo: metodo, // forma de pago (ej. 'EFECTIVO', 'TARJETA')
          referencia: numeroDocumento, // opcional
          idTipoImpuesto: "IMP01",
          subtotal: +subtotal.toFixed(2),
          valorImpuesto: impuesto,
          descuento: descuentoValor,
          total,
          costTotal: carrito.reduce((s, l) => s + l.costo * l.cantidad, 0),
          carrito: carrito.map((l) => ({
            idProducto: l.productId,
            nombre: l.nombre,
            precio: l.precio,
            cantidad: l.cantidad,
            costo: l.costo,
            stock: l.stock,
          })),
          ...(sesionCaja?.id ? { sesionCajaId: sesionCaja.id } : {}),
          cajero,
        },
      });

      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (venta) => {
      toast.success(`Venta ${venta.idVenta} registrada`);
      setCarrito([]);
      setDescuento(0);
      setRecibido(0);
      qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell title="Punto de venta" subtitle="F2 para buscar productos">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              className="pl-9"
              placeholder="Buscar por nombre, código o código de barras (F2)"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtrados[0]) agregar(filtrados[0]);
              }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtrados.map((p) => (
              <button
                key={p.id}
                onClick={() => agregar(p)}
                className="rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary"
              >
                <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{p.code}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold">{money(Number(p.sale_price))}</span>
                  <Badge variant={Number(p.stock) > 0 ? "secondary" : "destructive"}>
                    {Number(p.stock)} u.
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="space-y-4 rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Carrito ({carrito.length})</h2>

          <div className="space-y-2">
            {carrito.map((l) => (
              <div
                key={l.productId}
                className="flex items-center gap-2 rounded-lg border border-border p-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.nombre}</p>
                  <p className="text-xs text-muted-foreground">{money(l.precio)} c/u</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    onClick={() =>
                      setCarrito((prev) =>
                        prev
                          .map((x) =>
                            x.productId === l.productId ? { ...x, cantidad: x.cantidad - 1 } : x,
                          )
                          .filter((x) => x.cantidad > 0),
                      )
                    }
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-6 text-center text-sm">{l.cantidad}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    onClick={() =>
                      setCarrito((prev) =>
                        prev.map((x) =>
                          x.productId === l.productId ? { ...x, cantidad: x.cantidad + 1 } : x,
                        ),
                      )
                    }
                  >
                    <Plus className="size-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-destructive"
                    onClick={() =>
                      setCarrito((prev) => prev.filter((x) => x.productId !== l.productId))
                    }
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
            {!carrito.length && (
              <p className="text-sm text-muted-foreground">Agrega productos para vender.</p>
            )}
          </div>

          <div className="space-y-3 border-t border-border pt-3">
            {/* <div className="space-y-1.5">
              <Label>Cliente</Label>
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Consumidor final" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name} · {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            <div className="space-y-3 border-t border-border pt-3">
              <div className="space-y-1.5">
                <Label>Cliente</Label>

                {/* Campo de búsqueda */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Buscar cliente por nombre o código"
                    value={busquedaCliente}
                    onChange={(e) => setBusquedaCliente(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && clientesFiltrados[0]) {
                        seleccionarCliente(clientesFiltrados[0]);
                      }
                    }}
                  />
                </div>

                {/* Resultados filtrados */}
                {busquedaCliente && (
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-border bg-background">
                    {clientesFiltrados.map((c) => (
                      <button
                        key={c.id}
                        className="w-full px-3 py-1 text-left hover:bg-muted"
                        onClick={() => seleccionarCliente(c)}
                      >
                        {c.name} · {c.code}
                      </button>
                    ))}
                    {clientesFiltrados.length === 0 && (
                      <div className="px-3 py-1 text-sm text-muted-foreground">
                        No se encontraron clientes
                      </div>
                    )}
                  </div>
                )}

                {/* Cliente seleccionado */}
                {clienteSeleccionado && (
                  <div className="mt-2 rounded-md border border-border bg-muted px-3 py-2 text-sm">
                    <strong>{clienteSeleccionado.name}</strong> · {clienteSeleccionado.code}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Método de pago</Label>
                <Select value={metodo} onValueChange={(v) => setMetodo(v as typeof metodo)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Descuento ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={descuento}
                  onChange={(e) => setDescuento(Number(e.target.value))}
                />
              </div>
            </div>

            {metodo === "efectivo" && (
              <div className="space-y-1.5">
                <Label>Recibido ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={recibido}
                  onChange={(e) => setRecibido(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Cambio: {money(cambio)}</p>
              </div>
            )}

            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Descuento</dt>
                <dd>-{money(descuentoValor)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">IVA 15%</dt>
                <dd>{money(impuesto)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-1 text-base font-semibold">
                <dt>Total</dt>
                <dd>{money(total)}</dd>
              </div>
            </dl>

            <Button
              className="w-full"
              size="lg"
              disabled={!carrito.length || cobrar.isPending}
              onClick={() => cobrar.mutate()}
            >
              Cobrar y facturar
            </Button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
