import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/integrations/mysql/session"; // tu helper que lee localStorage/JWT
import { jwtDecode } from "jwt-decode";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    console.log("🔵 [AuthRoute] Verificando sesión...");

    const session = await getSession(); // lee token + user desde localStorage
    if (!session || !session.user) {
      console.warn("⚠️ [AuthRoute] No hay sesión, redirigiendo a /auth");
      throw redirect({ to: "/auth" });
    }

    type JwtPayload = {
      USER_ID?: number;
      EMAIL?: string;
      NOMBRE?: string;
      PERMISOS?: string[];
      exp?: number; // campo estándar de expiración en segundos
      [key: string]: unknown;
    };

    console.log("✅ [AuthRoute] Sesión válida:", session.user.EMAIL);
    console.log("🔎 [AuthRoute] Usuario completo:", session.user);

    try {
      const decoded = jwtDecode<JwtPayload>(session.token);
      console.log("🔎 [AuthRoute] Token decodificado:", decoded);

      // 🔒 Validar expiración del token
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        console.warn("⚠️ [AuthRoute] Token expirado, redirigiendo a /auth");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        throw redirect({ to: "/auth" });
      }

      const rawPerms: string[] = Array.isArray(decoded.PERMISOS)
        ? decoded.PERMISOS.filter((perm): perm is string => typeof perm === "string")
        : [];

      console.log("🔎 [AuthRoute] Permisos crudos:", rawPerms);
    } catch (err) {
      console.error("❌ [AuthRoute] Error decodificando token:", err);
      throw redirect({ to: "/auth" });
    }

    return { user: session.user };
  },
  component: () => <Outlet />,
});
