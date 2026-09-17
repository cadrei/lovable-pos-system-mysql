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
import type { SessionUser, SessionCtx, JwtPayload } from "../types/genericTypes";
import { toast } from "sonner";
import { fnSessionValidate } from "@/server-functions/fnSessionValidate";
import { fnSessionClearBackend } from "@/server-functions/fnSessionClear";

const Ctx = createContext<SessionCtx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ token: string; user: SessionUser } | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Función para cerrar sesión
  const logout = useCallback((reason?: string) => {
    console.log("🔴 [SessionProvider] Cerrando sesión:", reason);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setSession(null);
    if (reason) {
      toast.warning(reason);
    }
  }, []);

  // 🔹 1. Carga inicial de sesión con validación de SESSION_ID
  useEffect(() => {
    const validateAndLoadSession = async () => {
      console.log("🔵 [SessionProvider] Cargando sesión desde localStorage...");
      const token = localStorage.getItem("auth_token");
      const userRaw = localStorage.getItem("auth_user");

      if (token && userRaw) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          console.log("🔎 [SessionProvider] Token decodificado:", decoded);

          if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            console.warn("⚠️ [SessionProvider] Token expirado, cerrando sesión...");
            logout("Sesión expirada");
            return;
          }

          // 🔹 Validar SESSION_ID si existe en el token
          if (decoded.SESSION_ID && decoded.USER_ID) {
            console.log("🔎 [SessionProvider] Validando SESSION_ID...");
            try {
              const result = await fnSessionValidate({
                data: { userId: decoded.USER_ID, sessionToken: decoded.SESSION_ID },
              });

              if (!result.success || !result.data?.isValid) {
                console.warn("⚠️ [SessionProvider] Sesión invalidada desde otro dispositivo");
                logout("Tu sesión fue cerrada porque iniciaste sesión en otro dispositivo");
                return;
              }
              console.log("✅ [SessionProvider] SESSION_ID válido");
            } catch (err) {
              console.error("❌ [SessionProvider] Error validando SESSION_ID:", err);
              // Si falla la validación, permitir sesión pero sin validar
            }
          }
          setSession({ token, user: JSON.parse(userRaw) });
          console.log("✅ [SessionProvider] Sesión encontrada:", JSON.parse(userRaw).EMAIL);
        } catch (err) {
          console.error("❌ [SessionProvider] Error decodificando token:", err);
          logout();
        }
      } else {
        setSession(null);
        console.log("⚠️ [SessionProvider] No hay sesión activa");
      }
      setLoading(false);
    };
    validateAndLoadSession();
  }, [logout]);

  // 🔹 2. Función refresh independiente con validación de sesión
  const refresh = useCallback(async () => {
    console.log("🔵 [SessionProvider] Refrescando sesión...");
    const token = localStorage.getItem("auth_token");
    const userRaw = localStorage.getItem("auth_user");
    if (token && userRaw) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          console.warn("⚠️ [SessionProvider] Token expirado al refrescar, cerrando sesión...");
          logout("Sesión expirada");
          return;
        }
        // 🔹 Validar SESSION_ID al refrescar
        if (decoded.SESSION_ID && decoded.USER_ID) {
          try {
            const result = await fnSessionValidate({
              data: { userId: decoded.USER_ID, sessionToken: decoded.SESSION_ID },
            });

            if (!result.success || !result.data?.isValid) {
              console.warn("⚠️ [SessionProvider] Sesión invalidada durante refresh");
              logout("Tu sesión fue cerrada porque iniciaste sesión en otro dispositivo");
              return;
            }
          } catch (err) {
            console.error("❌ [SessionProvider] Error validando SESSION_ID en refresh:", err);
          }
        }
        setSession({ token, user: JSON.parse(userRaw) });
      } catch (err) {
        console.error("❌ [SessionProvider] Error en refresh:", err);
        logout();
      }
    } else {
      logout();
    }
  }, [logout]);

  // 🔹 3. Refresh silencioso automático
  /* useEffect(() => {
    if (!session?.token) return undefined;
    try {
      const decoded = jwtDecode<JwtPayload>(session.token);
      if (decoded.exp) {
        const msUntilExpiry = decoded.exp * 1000 - Date.now(); // Original
        //const msUntilExpiry = 2 * 60 * 1000; // Test: 2 minutos fijo
        if (msUntilExpiry > 5 * 60 * 1000) {
          const timeout = setTimeout(
            () => {
              refresh();
            },
            //msUntilExpiry - 5 * 60 * 1000, // Original
            msUntilExpiry - 30 * 1000, // Test: refresca 30 segundos antes
          );
          return () => clearTimeout(timeout);
        }
      }
    } catch (err) {
      console.error("❌ Error decodificando token para refresh automático:", err);
    }
    return undefined;
  }, [session?.token, refresh]); */

  // 🔹 4. Permisos y helpers
  const permisos = useMemo<string[]>(() => {
    if (!session?.token) return [];
    try {
      const decoded = jwtDecode<JwtPayload>(session.token);
      const rawPerms: string[] = Array.isArray(decoded.PERMISOS)
        ? decoded.PERMISOS.filter((perm): perm is string => typeof perm === "string")
        : [];
      return [...new Set(rawPerms)];
    } catch (err) {
      console.error("❌ [SessionProvider] Error decodificando token:", err);
      return [];
    }
  }, [session?.token]);

  const can = useCallback((perm: string) => permisos.includes(perm), [permisos]);

  // 🔹 5. Context value
  const value = useMemo<SessionCtx>(
    () => ({
      session,
      loading,
      userId: session?.user?.USER_ID ?? null,
      nombre: session?.user?.NOMBRE ?? "",
      email: session?.user?.EMAIL ?? "",
      roles: [], // poblar desde tu tabla de roles si aplica
      permisos,
      sucursalId: session?.user?.ID_SUCURSAL ?? null,
      sucursalNombre: session?.user?.NOMBRE_SUCURSAL ?? "",
      empleadoId: session?.user?.ID_EMPLEADO ?? null,
      can,
      refresh, // expone la función manual también
    }),
    [session, loading, permisos, can, refresh],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSession debe usarse dentro de SessionProvider");
  return ctx;
}
