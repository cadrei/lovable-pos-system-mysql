import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession, type Rol } from "@/hooks/use-session";
import { fechaHora } from "@/lib/format";
import { fnUsuariosGet, fnUsuarioEstadoUpdate } from "@/server-functions/fnusuarios";
import { fnRolesSeguridadGet } from "@/server-functions/fnseguridad";
import { sucursalesFn } from "@/server-functions/fnsucursales";
import { fnPermisosGet } from "@/server-functions/fnpermisos";
import { fnRolesGet } from "@/server-functions/fnroles";
import {
  fnRolesPermisosGet,
  fnRolPermisoInsert,
  fnRolPermisoDelete,
} from "@/server-functions/fnrolPermiso";
import {
  fnUsuariosRolesGet,
  fnUsuarioRolInsert,
  fnUsuarioRolDelete,
} from "@/server-functions/fnusuarioRol";
import { fnAuditoriaUsuariosGet } from "@/server-functions/fnauditoriaUsuarios";

export const Route = createFileRoute("/_authenticated/seguridad")({
  head: () => ({
    meta: [
      { title: "Seguridad — PuntoVenta" },
      {
        name: "description",
        content: "Administración de usuarios, roles, permisos y bitácora de auditoría.",
      },
      { property: "og:title", content: "Seguridad — PuntoVenta" },
      { property: "og:description", content: "Control de accesos y auditoría del sistema." },
    ],
  }),
  component: Seguridad,
});

const ROLES = ["admin_matriz", "admin_sucursal", "empleado", "visualizador"] as const;

function Seguridad() {
  const qc = useQueryClient();
  const { can } = useSession();
  const puedeEditar = can("users.update");
  const [q, setQ] = useState("");
  const [moduloAuditoria, setModuloAuditoria] = useState("todos");

  const perfilesQ = useQuery({
    queryKey: ["seg-perfiles"],
    queryFn: async () => {
      const result = await fnUsuariosGet();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const rolesSeguridadQ = useQuery({
    queryKey: ["seg-roles"],
    queryFn: async () => {
      const result = await fnRolesSeguridadGet();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const rolesCatalogoQ = useQuery({
    queryKey: ["seg-roles-catalogo"],
    queryFn: async () => {
      const result = await fnRolesGet();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const sucursalesQ = useQuery({
    queryKey: ["seg-sucursales"],
    queryFn: async () => {
      const result = await sucursalesFn();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const permisosQ = useQuery({
    queryKey: ["seg-permisos"],
    queryFn: async () => {
      const result = await fnPermisosGet();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const rolPermQ = useQuery({
    queryKey: ["seg-rol-permisos"],
    queryFn: async () => {
      const result = await fnRolesPermisosGet({ data: {} });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const auditoriaQ = useQuery({
    queryKey: ["seg-auditoria"],
    queryFn: async () => {
      const result = await fnAuditoriaUsuariosGet();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });

  const perfiles = useMemo(
    () =>
      (perfilesQ.data ?? []).map((u) => ({
        id: String(u.USER_ID),
        full_name: u.NOMBRE,
        email: u.EMAIL,
        phone: u.TELEFONO,
        branch_id: u.ID_SUCURSAL ?? null,
        active: u.ESTADO === "A",
        last_login_at: u.ULTIMO_LOGIN ? new Date(u.ULTIMO_LOGIN).toISOString() : null,
      })),
    [perfilesQ.data],
  );

  const roles = useMemo(
    () =>
      (rolesSeguridadQ.data ?? []).map((ur) => ({
        id: String(ur.id),
        user_id: String(ur.user_id),
        role: ur.role,
      })),
    [rolesSeguridadQ.data],
  );

  const sucursales = useMemo(
    () =>
      (sucursalesQ.data ?? []).map((s) => ({
        id: s.ID_SUCURSAL,
        name: s.NOMBRE_SUCURSAL,
      })),
    [sucursalesQ.data],
  );

  const rolesCatalogo = useMemo(() => rolesCatalogoQ.data ?? [], [rolesCatalogoQ.data]);

  const permisos = useMemo(
    () =>
      (permisosQ.data ?? []).map((p) => ({
        code: p.PERMISO_ID,
        module: p.MODULO,
        description: p.DESCRIPCION,
      })),
    [permisosQ.data],
  );

  const rolPerm = useMemo(() => {
    const idPorNombre = new Map<number, string>();
    rolesCatalogo.forEach((r) => idPorNombre.set(r.ROL_ID, r.NOMBRE));
    return (rolPermQ.data ?? []).map((rp) => ({
      id: String(rp.RP_ID),
      role: idPorNombre.get(rp.ROL_ID) ?? "",
      permission_code: rp.PERMISO_ID,
    }));
  }, [rolPermQ.data, rolesCatalogo]);

  const auditoria = useMemo(
    () =>
      (auditoriaQ.data ?? []).map((a) => ({
        id: String(a.ID_LOG),
        user_email: a.USER_EMAIL,
        action: a.ACTION,
        module: a.MODULE,
        entity: a.ENTITY,
        entity_id: a.ENTITY_ID,
        created_at: a.FECHA_CREACION ? new Date(a.FECHA_CREACION).toISOString() : null,
      })),
    [auditoriaQ.data],
  );

  const rolIdPorNombre = useMemo(() => {
    const mapa = new Map<string, number>();
    rolesCatalogo.forEach((r) => mapa.set(r.NOMBRE, r.ROL_ID));
    return mapa;
  }, [rolesCatalogo]);

  const filtrados = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return perfiles;
    return perfiles.filter((p) => `${p.full_name} ${p.email ?? ""}`.toLowerCase().includes(s));
  }, [perfiles, q]);

  const modulos = useMemo(() => [...new Set(auditoria.map((a) => a.module))].sort(), [auditoria]);
  const auditoriaFiltrada = auditoria.filter(
    (a) => moduloAuditoria === "todos" || a.module === moduloAuditoria,
  );

  const porModulo = useMemo(() => {
    const mapa = new Map<string, typeof permisos>();
    permisos.forEach((p) => mapa.set(p.module, [...(mapa.get(p.module) ?? []), p]));
    return [...mapa.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [permisos]);

  const actualizarPerfil = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: { active?: boolean; branch_id?: string | null };
    }) => {
      if (patch.active === undefined) {
        throw new Error("La asignación de sucursal se gestiona desde el empleado.");
      }
      const result = await fnUsuarioEstadoUpdate({
        data: { id: Number(id), estado: patch.active ? "A" : "I" },
      });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Usuario actualizado");
      qc.invalidateQueries({ queryKey: ["seg-perfiles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const alternarRol = useMutation({
    mutationFn: async ({ userId, rol, activo }: { userId: string; rol: Rol; activo: boolean }) => {
      const rolId = rolIdPorNombre.get(rol);
      if (rolId === undefined) throw new Error(`Rol no encontrado: ${rol}`);
      const result = activo
        ? await fnUsuarioRolInsert({ data: { USER_ID: Number(userId), ROL_ID: rolId } })
        : await fnUsuarioRolDelete({ data: { userId: Number(userId), rolId } });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Roles actualizados");
      qc.invalidateQueries({ queryKey: ["seg-roles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const alternarPermiso = useMutation({
    mutationFn: async ({ rol, code, activo }: { rol: Rol; code: string; activo: boolean }) => {
      const rolId = rolIdPorNombre.get(rol);
      if (rolId === undefined) throw new Error(`Rol no encontrado: ${rol}`);
      const result = activo
        ? await fnRolPermisoInsert({ data: { ROL_ID: rolId, PERMISO_ID: code } })
        : await fnRolPermisoDelete({ data: { rolId, permisoId: code } });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      toast.success("Permisos actualizados");
      qc.invalidateQueries({ queryKey: ["seg-rol-permisos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell title="Seguridad" subtitle="Usuarios, roles, permisos y auditoría">
      <Tabs defaultValue="usuarios">
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permisos">Permisos</TabsTrigger>
          <TabsTrigger value="auditoria">Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4 pt-4">
          <Input
            className="max-w-md"
            placeholder="Buscar usuario por nombre o correo"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Usuario</th>
                  <th>Correo</th>
                  <th>Sucursal</th>
                  <th>Último acceso</th>
                  <th>Estado</th>
                  <th className="pr-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3 font-medium">{p.full_name}</td>
                    <td className="text-muted-foreground">{p.email ?? "—"}</td>
                    <td>
                      <span className="text-muted-foreground">
                        {sucursales.find((s) => s.id === p.branch_id)?.name ?? "—"}
                      </span>
                    </td>
                    <td className="text-muted-foreground">
                      {p.last_login_at ? fechaHora(p.last_login_at) : "—"}
                    </td>
                    <td>
                      <Badge variant={p.active ? "secondary" : "outline"}>
                        {p.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {puedeEditar && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            actualizarPerfil.mutate({ id: p.id, patch: { active: !p.active } })
                          }
                        >
                          {p.active ? "Desactivar" : "Activar"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4 pt-4">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Usuario</th>
                  {ROLES.map((r) => (
                    <th key={r} className="capitalize">
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {perfiles.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3">
                      <p className="font-medium">{p.full_name}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </td>
                    {ROLES.map((r) => {
                      const tiene = roles.some(
                        (ur) => ur.user_id === p.id && (ur.role as string) === (r as string),
                      );
                      return (
                        <td key={r}>
                          <Checkbox
                            checked={tiene}
                            disabled={!puedeEditar || alternarRol.isPending}
                            onCheckedChange={(v) =>
                              alternarRol.mutate({ userId: p.id, rol: r, activo: v === true })
                            }
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="permisos" className="space-y-6 pt-4">
          {porModulo.map(([modulo, lista]) => (
            <div key={modulo} className="overflow-x-auto rounded-xl border border-border bg-card">
              <p className="border-b border-border bg-muted/40 p-3 text-xs font-semibold uppercase tracking-wide">
                {modulo}
              </p>
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-3">Permiso</th>
                    {ROLES.map((r) => (
                      <th key={r} className="capitalize">
                        {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lista.map((perm) => (
                    <tr key={perm.code} className="border-t border-border">
                      <td className="p-3">
                        <p className="font-mono text-xs">{perm.code}</p>
                        <p className="text-xs text-muted-foreground">{perm.description}</p>
                      </td>
                      {ROLES.map((r) => {
                        const tiene = rolPerm.some(
                          (rp) =>
                            (rp.role as string) === (r as string) &&
                            rp.permission_code === perm.code,
                        );
                        return (
                          <td key={r}>
                            <Checkbox
                              checked={tiene}
                              disabled={!puedeEditar || alternarPermiso.isPending}
                              onCheckedChange={(v) =>
                                alternarPermiso.mutate({
                                  rol: r,
                                  code: perm.code,
                                  activo: v === true,
                                })
                              }
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="auditoria" className="space-y-4 pt-4">
          <Select value={moduloAuditoria} onValueChange={setModuloAuditoria}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los módulos</SelectItem>
              {modulos.map((m) => (
                <SelectItem key={m} value={m} className="capitalize">
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th>Usuario</th>
                  <th>Módulo</th>
                  <th>Acción</th>
                  <th className="pr-3">Entidad</th>
                </tr>
              </thead>
              <tbody>
                {auditoriaFiltrada.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="p-3 text-muted-foreground">{fechaHora(a.created_at)}</td>
                    <td>{a.user_email ?? "—"}</td>
                    <td className="capitalize">{a.module}</td>
                    <td>
                      <Badge variant="outline">{a.action}</Badge>
                    </td>
                    <td className="pr-3 font-mono text-xs text-muted-foreground">
                      {a.entity ?? "—"} {a.entity_id ? `#${a.entity_id.slice(0, 8)}` : ""}
                    </td>
                  </tr>
                ))}
                {auditoriaFiltrada.length === 0 && (
                  <tr>
                    <td className="p-3 text-muted-foreground" colSpan={5}>
                      Sin registros de auditoría.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
