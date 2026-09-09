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
      console.warn("⚠️ [Session] No hay sesión en localStorage");
      return null;
    }

    const user = JSON.parse(userRaw);
    console.log("✅ [Session] Sesión encontrada:", user.EMAIL);

    return { token, user };
  } catch (err) {
    console.error("❌ [Session] Error al leer sesión:", err);
    return null;
  }
}

/**
 * Elimina la sesión actual (logout).
 */
export function clearSession() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  console.log("🔵 [Session] Sesión eliminada");
}
