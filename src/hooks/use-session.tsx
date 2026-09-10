import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

export type Rol = "admin_matriz" | "admin_sucursal" | "empleado" | "visualizador";

type SessionUser = {
  USER_ID?: number;
  NOMBRE?: string;
  EMAIL?: string;
  ID_EMPLEADO?: number;
  ID_SUCURSAL?: string;
  NOMBRE_SUCURSAL?: string;
  [key: string]: unknown;
};

type JwtPayload = {
  USER_ID?: number;
  EMAIL?: string;
  NOMBRE?: string;
  ID_EMPLEADO?: number;
  ID_SUCURSAL?: string;
  NOMBRE_SUCURSAL?: string;
  PERMISOS?: string[];
  [key: string]: unknown;
};

type SessionCtx = {
  session: { token: string; user: SessionUser } | null;
  loading: boolean;
  userId: number | null;
  nombre: string;
  email: string;
  roles: Rol[];
  permisos: string[];
  sucursalId: string | null;
  sucursalNombre: string;
  empleadoId: number | null;
  can: (perm: string) => boolean;
  refresh: () => void;
};

const Ctx = createContext<SessionCtx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ token: string; user: SessionUser } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔵 [SessionProvider] Cargando sesión desde localStorage...");
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("auth_user");

    if (token && user) {
      setSession({ token, user: JSON.parse(user) });
      console.log("✅ [SessionProvider] Sesión encontrada:", JSON.parse(user).EMAIL);
    } else {
      setSession(null);
      console.log("⚠️ [SessionProvider] No hay sesión activa");
    }

    setLoading(false);
  }, []);

  // 👇 Extraer permisos directamente del token
  const permisos = useMemo<string[]>(() => {
    if (!session?.token) return [];

    try {
      const decoded = jwtDecode<JwtPayload>(session.token);
      console.log("🔎 [SessionProvider] Token decodificado:", decoded);
      const rawPerms: string[] = Array.isArray(decoded.PERMISOS)
        ? decoded.PERMISOS.filter((perm): perm is string => typeof perm === "string")
        : [];
      console.log("🔎 [SessionProvider] Permisos crudos:", rawPerms);

      return [...new Set(rawPerms)];
    } catch (err) {
      console.error("❌ [SessionProvider] Error decodificando token:", err);
      return [];
    }
  }, [session?.token]);

  const can = useCallback((perm: string) => permisos.includes(perm), [permisos]);

  const value = useMemo<SessionCtx>(
    () => ({
      session,
      loading,
      userId: session?.user?.USER_ID ?? null,
      nombre: session?.user?.NOMBRE ?? "",
      email: session?.user?.EMAIL ?? "",
      roles: [], // luego puedes poblar desde tu tabla de roles
      permisos,
      sucursalId: session?.user?.ID_SUCURSAL ?? null,
      sucursalNombre: session?.user?.NOMBRE_SUCURSAL ?? "",
      empleadoId: session?.user?.ID_EMPLEADO ?? null,
      can,
      refresh: () => {
        console.log("🔵 [SessionProvider] Refrescando sesión...");
        const token = localStorage.getItem("auth_token");
        const user = localStorage.getItem("auth_user");
        if (token && user) {
          setSession({ token, user: JSON.parse(user) });
        } else {
          setSession(null);
        }
      },
    }),
    [session, loading, permisos, can],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSession debe usarse dentro de SessionProvider");
  return ctx;
}
