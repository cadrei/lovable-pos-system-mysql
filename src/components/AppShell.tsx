import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  Receipt,
  ScanLine,
  Settings,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

const nav: { to: string; label: string; icon: LucideIcon; perm: string }[] = [
  { to: "/panel", label: "Panel", icon: LayoutDashboard, perm: "ventas.ver" },
  { to: "/ventas", label: "Ventas (POS)", icon: ScanLine, perm: "ventas.crear" },
  { to: "/facturacion", label: "Facturaci贸n", icon: Receipt, perm: "facturacion.ver" },
  { to: "/inventario", label: "Inventario", icon: Boxes, perm: "inventario.ver" },
  {
    to: "/productosBeneficios",
    label: "Productos por Beneficio",
    icon: Search,
    perm: "inventario.ver",
  },
  { to: "/caja", label: "Caja", icon: Wallet, perm: "caja.ver" },
  { to: "/clientes", label: "Clientes", icon: Users, perm: "clientes.ver" },
  { to: "/proveedores", label: "Proveedores", icon: Truck, perm: "proveedores.ver" },
  { to: "/reportes", label: "Reportes", icon: BarChart3, perm: "reportes.ver" },
  { to: "/seguridad", label: "Seguridad", icon: ShieldCheck, perm: "usuarios.ver" },
  { to: "/configuracion", label: "Configuraci贸n", icon: Settings, perm: "configuracion.ver" },
];

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { nombre, email, roles, permisos, can } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();

  console.log("🔎 [AppShell] Permisos en sesión:", permisos);
  console.log("🔎 [AppShell] Navegación completa:", nav);
  const visibles = nav.filter((n) => {
    const allowed = can(n.perm);
    console.log(`🔎 [AppShell] Evaluando ${n.label} (${n.perm}): ${allowed}`);
    return allowed;
  });

  async function salir() {
    // Cancelar queries en cache
    console.log("🔎 [AppShell] Cancelando queries en cache");
    await qc.cancelQueries();
    qc.clear();
    // Eliminar token y datos de usuario del localStorage
    console.log("🔎 [AppShell] Eliminando token y datos de usuario del localStorage");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    console.log("🔎 [AppShell] Redirigiendo a Pagina de Login");
    // Redirigir al login
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid size-9 place-items-center rounded-lg bg-sidebar-primary font-mono text-sm font-bold text-sidebar-primary-foreground">
            PV
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">PuntoVenta</p>
            <p className="text-xs text-sidebar-foreground/60">Suite comercial</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {visibles.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                ].join(" ")}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 rounded-xl border border-sidebar-border p-3 text-xs text-sidebar-foreground/70">
          <p className="truncate font-medium text-sidebar-foreground">{nombre || email}</p>
          <div className="flex flex-wrap gap-1">
            {roles.map((r) => (
              <Badge key={r} variant="secondary" className="capitalize">
                {r}
              </Badge>
            ))}
          </div>
          <button
            onClick={salir}
            className="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left hover:text-sidebar-foreground"
          >
            <LogOut className="size-3.5" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/85 px-6 py-4 backdrop-blur">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={salir}
              className="md:hidden"
              aria-label="Salir"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
          {visibles.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs text-muted-foreground"
              activeProps={{ className: "bg-secondary text-secondary-foreground font-medium" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
