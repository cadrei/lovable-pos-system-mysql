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
 */
export async function clearSession(userId?: number, userEmail?: string): Promise<void> {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    console.log("✅ [session.clearSession] Sesión eliminada");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [session.clearSession] Error al eliminar sesión", { message });
    throw new Error(`[session.clearSession] ${message}`);
  }
}
