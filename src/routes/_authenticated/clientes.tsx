import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClientesFn, fnClienteInsert } from "@/server-functions/fnGetClientes";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/_authenticated/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — PuntoVenta" },
      {
        name: "description",
        content: "Directorio de clientes con identificación, contacto y estado.",
      },
      { property: "og:title", content: "Clientes — PuntoVenta" },
      { property: "og:description", content: "Gestión del directorio de clientes." },
    ],
  }),
  component: Clientes,
});

const tipos = ["cedula", "ruc", "pasaporte", "consumidor_final"] as const;

function Clientes() {
  const qc = useQueryClient();
  const { can } = useSession();
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [form, setForm] = useState({
    id_type: "cedula" as (typeof tipos)[number],
    id_number: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
  });

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const result = await getClientesFn();
      if (!result.success) throw new Error(result.error);
      // Transformar los datos al formato esperado por la pantalla
      return result.data.map((c) => ({
        id: c.id,
        id_number: c.code,
        first_name: c.name,
        last_name: "",
        phone: c.phone || null,
        email: c.email || null,
        address: c.address || null,
        active: true,
      }));
    },
  });

  const filtrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clientes;
    return clientes.filter(
      (c) =>
        `${c.first_name} ${c.last_name ?? ""}`.toLowerCase().includes(s) ||
        c.id_number.includes(s) ||
        (c.email ?? "").toLowerCase().includes(s),
    );
  }, [clientes, q]);

  const totalPages = Math.ceil(filtrados.length / pageSize);

  const clientesPagina = useMemo(() => {
    return filtrados.slice(page * pageSize, (page + 1) * pageSize);
  }, [filtrados, page]);

  const crear = useMutation({
    mutationFn: async () => {
      // Mapeo de tipos de identificación a ID_TIPO_DOC
      const tipoDocMap: Record<string, string> = {
        cedula: "TIP_DOC01",
        ruc: "TIP_DOC02",
        pasaporte: "TIP_DOC03",
        consumidor_final: "TIP_DOC05",
      };

      const idTipoDoc = tipoDocMap[form.id_type];
      if (!idTipoDoc) {
        throw new Error(`Tipo de identificación no válido: ${form.id_type}`);
      }

      const result = await fnClienteInsert({
        data: {
          ID_DOCUMENTO: form.id_number,
          ID_TIPO_DOC: idTipoDoc,
          NOMBRES: `${form.first_name} ${form.last_name || ""}`.trim(),
          EMAIL: form.email || null,
          TELEFONO: form.phone || null,
          DIRECCION: form.address || null,
          ESTADO: "A",
        },
      });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Cliente registrado");
      setAbierto(false);
      setForm({
        id_type: "cedula",
        id_number: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address: "",
      });
      qc.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell
      title="Clientes"
      subtitle={`${clientes.length} registrados`}
      actions={
        can("clientes.crear") && (
          <Dialog open={abierto} onOpenChange={setAbierto}>
            <DialogTrigger asChild>
              <Button>Nuevo cliente</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo cliente</DialogTitle>
                <DialogDescription>Datos de identificación y contacto.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Tipo de identificación</Label>
                  <Select
                    value={form.id_type}
                    onValueChange={(v) => setForm({ ...form, id_type: v as typeof form.id_type })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tipos.map((t) => (
                        <SelectItem key={t} value={t} className="capitalize">
                          {t.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Identificación</Label>
                  <Input
                    value={form.id_number}
                    onChange={(e) => setForm({ ...form, id_number: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Nombres</Label>
                  <Input
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Apellidos</Label>
                  <Input
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Teléfono</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Correo</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Dirección</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => crear.mutate()}
                  disabled={!form.id_number || !form.first_name || crear.isPending}
                >
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }
    >
      <div className="space-y-4">
        <Input
          className="max-w-md"
          placeholder="Buscar por nombre, identificación o correo"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3">Identificación</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={5}>
                    Cargando…
                  </td>
                </tr>
              )}
              {!isLoading && filtrados.length === 0 && (
                <tr>
                  <td className="p-3 text-muted-foreground text-center" colSpan={5}>
                    No se encontraron clientes
                  </td>
                </tr>
              )}
              {clientesPagina.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{c.id_number}</td>
                  <td className="font-medium">
                    {c.first_name} {c.last_name ?? ""}
                  </td>
                  <td className="text-muted-foreground">{c.phone ?? "—"}</td>
                  <td className="text-muted-foreground">{c.email ?? "—"}</td>
                  <td>
                    <Badge variant={c.active ? "secondary" : "outline"}>
                      {c.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="w-full overflow-x-auto">
            <Pagination className="justify-center">
              <PaginationContent className="flex-nowrap">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 0) setPage(page - 1);
                    }}
                    className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {(() => {
                  const items = [];
                  const maxVisible = 5;

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
                      page === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </AppShell>
  );
}
