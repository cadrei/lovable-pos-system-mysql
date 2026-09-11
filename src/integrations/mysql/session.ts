import { AuditoriaUsuarioInsert } from "@/types/mysqltypes";
import { insertAuditoriaUsuario } from "./auditoriaUsuarios";

export type SessionData = {
  token: string;
  user: {
    USER_ID: number;
    NOMBRE: string;
    NOMBRE_USUARIO: string;
    EMAIL: string;
    TELEFONO?: string;
    ID_SUCURSAL?: string;
    ESTADO: string;
  };
};
// Logout exitoso
export const auditoriaLogoutExitoso: AuditoriaUsuarioInsert = {
  USER_ID: 0,
  USER_EMAIL: "",
  ACTION: "LOGOUT_SUCCESS",
  MODULE: "AUTH",
  ENTITY: "USUARIOS",
  ENTITY_ID: null,
  OLD_VALUE: null,
  NEW_VALUE: "Sesión cerrada correctamente",
  IP: null,
};
// Logout con error
export const auditoriaLogoutError: AuditoriaUsuarioInsert = {
  USER_ID: 0,
  USER_EMAIL: "",
  ACTION: "LOGOUT_ERROR",
  MODULE: "AUTH",
  ENTITY: "USUARIOS",
  ENTITY_ID: null,
  OLD_VALUE: null,
  NEW_VALUE: "Error al cerrar sesión",
  IP: null,
};

/**
 * Obtiene la sesión actual desde localStorage.
 * Devuelve null si no existe token o usuario.
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const token = localStorage.getItem("auth_token");
    const userRaw = localStorage.getItem("auth_user");

    if (!token || !userRaw) {
      console.log("🔵 [session.getSession] No hay sesión en localStorage", {
        hasToken: Boolean(token),
        hasUser: Boolean(userRaw),
      });
      return null;
    }

    const user = JSON.parse(userRaw) as SessionData["user"];
    console.log("✅ [session.getSession] Sesión encontrada: ", { email: user.EMAIL });

    return { token, user };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [session.getSession] Error al leer sesión: ", { message });
    throw new Error(`[session.getSession] ${message}`);
  }
}

/**
 * Elimina la sesión actual (logout).
 */
export async function clearSession(userId?: number, userEmail?: string): Promise<void> {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    console.log("✅ [session.clearSession] Sesión eliminada");
    // Auditoría de logout exitoso
    await insertAuditoriaUsuario({
      ...auditoriaLogoutExitoso,
      USER_ID: userId ?? 0,
      USER_EMAIL: userEmail ?? "",
      ENTITY_ID: userId ? String(userId) : null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [session.clearSession] Error al eliminar sesión", { message });
    // Auditoría de logout con error
    await insertAuditoriaUsuario({
      ...auditoriaLogoutError,
      USER_ID: userId ?? 0,
      USER_EMAIL: userEmail ?? "",
      ENTITY_ID: userId ? String(userId) : null,
      NEW_VALUE: message,
    });
    throw new Error(`[session.clearSession] ${message}`);
  }
}
