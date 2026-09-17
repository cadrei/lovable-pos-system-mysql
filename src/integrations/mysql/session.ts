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
 * Si se proporciona userId, también limpia el SESSION_ID en la base de datos.
 */
export async function clearSession(userId?: number, userEmail?: string): Promise<void> {
  try {
    // 🔹 Limpiar SESSION_ID en la base de datos si hay userId
    if (userId) {
      try {
        const { fnSessionClearBackend } = await import("@/server-functions/fnSessionClear");
        await fnSessionClearBackend({ data: { userId } });
        console.log("✅ [session.clearSession] SESSION_ID limpiado en BD");
      } catch (err) {
        console.error("⚠️ [session.clearSession] Error limpiando SESSION_ID en BD:", err);
        // Continuar con el logout local aunque falle la limpieza en BD
      }
    }

    // 🔹 Limpiar localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    console.log("✅ [session.clearSession] Sesión eliminada de localStorage");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [session.clearSession] Error al eliminar sesión", { message });
    throw new Error(`[session.clearSession] ${message}`);
  }
}
