import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import { fechaHora, money } from "@/lib/format";
import { fnCashRegistersGet } from "@/server-functions/fncashRegisters";
import {
  fnSesionesCajaGet,
  getSesionCajaFn,
  fnSesionCajaInsert,
  fnUpdateSesionCaja,
} from "@/server-functions/fncajaSesion";
import { getMovimientosCajaFn, fnInsertMovimientoCaja } from "@/server-functions/fncajaMovimientos";
import type { CashRegisterSelect, CashMovementRow, CashSessionSelect } from "@/types/mysqltypes";

export const Route = createFileRoute("/_authenticated/caja")({
  head: () => ({
    meta: [
      { title: "Control de caja — PuntoVenta" },
      {
        name: "description",
        content: "Apertura, movimientos, arqueo y cierre de caja con diferencias.",
      },
      { property: "og:title", content: "Control de caja — PuntoVenta" },
      { property: "og:description", content: "Apertura, arqueo y cierre de caja." },
    ],
  }),
  component: Caja,
});

function Caja() {
  const qc = useQueryClient();
  const { nombre } = useSession();
  const [montoApertura, setMontoApertura] = useState(100);
  const [cajaId, setCajaId] = useState("");
  const [declarado, setDeclarado] = useState(0);
  const [mov, setMov] = useState({
    tipo: "ingreso" as "ingreso" | "egreso" | "retiro",
    monto: 0,
    concepto: "",
  });

  const { data: cajas = [] } = useQuery<CashRegisterSelect[]>({
    queryKey: ["cajas"],
    queryFn: async () => {
      const result = await fnCashRegistersGet();
      if (!result.success) throw new Error(result.error);
      return (result.data ?? []).filter((c) => c.active);
    },
  });

  const { data: sesion } = useQuery<CashSessionSelect | null>({
    queryKey: ["caja-abierta"],
    queryFn: async () => {
      const result = await getSesionCajaFn();
      if (!result.success) throw new Error(result.error);
      // Convertir CashSessionRow a CashSessionSelect
      const data = result.data;
      if (!data) return null;
      return {
        ...data,
        user_id: data.user_id ? parseInt(data.user_id) : null,
      } as CashSessionSelect;
    },
  });

  const { data: movimientos = [] } = useQuery<CashMovementRow[]>({
    queryKey: ["caja-movimientos", sesion?.id],
    enabled: !!sesion?.id,
    queryFn: async () => {
      if (!sesion?.id) return [];
      const result = await getMovimientosCajaFn({ data: { sessionId: sesion.id } });
      if (!result.success) throw new Error(result.error);
      return result.data ?? [];
    },
  });

  const { data: historial = [] } = useQuery<CashSessionSelect[]>({
    queryKey: ["caja-historial"],
    queryFn: async () => {
      const result = await fnSesionesCajaGet();
      if (!result.success) throw new Error(result.error);
      return (result.data ?? [])
        .filter((s) => s.status === "cerrada")
        .sort((a, b) => new Date(b.closed_at ?? 0).getTime() - new Date(a.closed_at ?? 0).getTime())
        .slice(0, 15);
    },
  });

  const entradas = movimientos
    .filter((m) => m.type !== "egreso" && m.type !== "retiro")
    .reduce((s, m) => s + Number(m.amount), 0);
  const salidas = movimientos
    .filter((m) => m.type === "egreso" || m.type === "retiro")
    .reduce((s, m) => s + Number(m.amount), 0);
  const esperado = +(entradas - salidas).toFixed(2);

  const abrir = useMutation({
    mutationFn: async () => {
      if (!cajaId) throw new Error("Selecciona una caja");
      const id = crypto.randomUUID();
      const result = await fnSesionCajaInsert({
        data: {
          id,
          cash_register_id: cajaId,
          user_name: nombre || null,
          opening_amount: montoApertura,
          status: "abierta",
          notes: null,
        },
      });
      if (!result.success) throw new Error(result.error);

      const movResult = await fnInsertMovimientoCaja({
        data: {
          id: crypto.randomUUID(),
          cash_session_id: id,
          type: "apertura",
          amount: montoApertura,
          concept: "Apertura de caja",
          reference: null,
          user_id: null,
        },
      });
      if (!movResult.success) throw new Error(movResult.error);
    },
    onSuccess: () => {
      toast.success("Caja abierta");
      qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const registrar = useMutation({
    mutationFn: async () => {
      if (!sesion?.id) throw new Error("No hay caja abierta");
      const result = await fnInsertMovimientoCaja({
        data: {
          id: crypto.randomUUID(),
          cash_session_id: sesion.id,
          type: mov.tipo === "ingreso" ? "ingreso" : mov.tipo === "egreso" ? "egreso" : "retiro",
          amount: mov.monto,
          concept: mov.concepto || mov.tipo,
          reference: null,
          user_id: null,
        },
      });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Movimiento registrado");
      setMov({ tipo: "ingreso", monto: 0, concepto: "" });
      qc.invalidateQueries({ queryKey: ["caja-movimientos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cerrar = useMutation({
    mutationFn: async () => {
      if (!sesion?.id) throw new Error("No hay caja abierta");
      const result = await fnUpdateSesionCaja({
        data: {
          id: sesion.id,
          status: "cerrada",
          closed_at: new Date(),
          expected_amount: esperado,
          declared_amount: declarado,
          difference: +(declarado - esperado).toFixed(2),
        },
      });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Caja cerrada");
      setDeclarado(0);
      qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell title="Control de caja" subtitle={sesion ? "Sesión abierta" : "Sin sesión activa"}>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="stat-tile lg:col-span-2">
          {sesion ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold">
                    {cajas.find((c) => c.id === sesion.cash_register_id)?.name ?? "Caja"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Abierta {fechaHora(sesion.opened_at?.toISOString())} por{" "}
                    {sesion.user_name ?? "—"}
                  </p>
                </div>
                <Badge>Abierta</Badge>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Apertura</p>
                  <p className="text-lg font-semibold">{money(Number(sesion.opening_amount))}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                  <p className="text-lg font-semibold text-success">{money(entradas)}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Egresos</p>
                  <p className="text-lg font-semibold text-destructive">{money(salidas)}</p>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2">Fecha</th>
                      <th>Tipo</th>
                      <th>Concepto</th>
                      <th className="text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((m) => (
                      <tr key={m.id} className="border-t border-border">
                        <td className="py-2 text-muted-foreground">
                          {fechaHora(m.created_at?.toISOString())}
                        </td>
                        <td className="capitalize">{m.type}</td>
                        <td>{m.concept}</td>
                        <td className="text-right font-medium">{money(Number(m.amount))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold">Abrir caja</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Caja</Label>
                  <Select value={cajaId} onValueChange={setCajaId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una caja" />
                    </SelectTrigger>
                    <SelectContent>
                      {cajas.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Monto inicial</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={montoApertura}
                    onChange={(e) => setMontoApertura(Number(e.target.value))}
                  />
                </div>
              </div>
              <Button onClick={() => abrir.mutate()} disabled={abrir.isPending}>
                Abrir caja
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {sesion && (
            <>
              <div className="stat-tile space-y-3">
                <h2 className="text-sm font-semibold">Movimiento de caja</h2>
                <Select
                  value={mov.tipo}
                  onValueChange={(v) => setMov({ ...mov, tipo: v as typeof mov.tipo })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">Ingreso</SelectItem>
                    <SelectItem value="egreso">Egreso</SelectItem>
                    <SelectItem value="retiro">Retiro</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Monto"
                  value={mov.monto}
                  onChange={(e) => setMov({ ...mov, monto: Number(e.target.value) })}
                />
                <Input
                  placeholder="Concepto"
                  value={mov.concepto}
                  onChange={(e) => setMov({ ...mov, concepto: e.target.value })}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => registrar.mutate()}
                  disabled={!mov.monto}
                >
                  Registrar
                </Button>
              </div>

              <div className="stat-tile space-y-3">
                <h2 className="text-sm font-semibold">Arqueo y cierre</h2>
                <p className="text-sm text-muted-foreground">Esperado en caja: {money(esperado)}</p>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Efectivo declarado"
                  value={declarado}
                  onChange={(e) => setDeclarado(Number(e.target.value))}
                />
                <p className="text-sm">
                  Diferencia:{" "}
                  <span className={declarado - esperado < 0 ? "text-destructive" : "text-success"}>
                    {money(declarado - esperado)}
                  </span>
                </p>
                <Button
                  className="w-full"
                  onClick={() => cerrar.mutate()}
                  disabled={cerrar.isPending}
                >
                  Cerrar caja
                </Button>
              </div>
            </>
          )}

          <div className="stat-tile">
            <h2 className="text-sm font-semibold">Cierres recientes</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {historial.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {cajas.find((c) => c.id === h.cash_register_id)?.name ?? "Caja"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fechaHora(h.closed_at?.toISOString())}
                    </p>
                  </div>
                  <span className={Number(h.difference) < 0 ? "text-destructive" : "text-success"}>
                    {money(Number(h.difference))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
