import { createServerFn } from "@tanstack/react-start";
import { login, getPermisosUsuario } from "../integrations/mysql/auth";
import { notifyLogin } from "./mailer/notifyLogin.server";

export const loginFn = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { email, password } = (data ?? {}) as {
    email?: string;
    password?: string;
  };
  try {
    if (!email || !password) {
      return {
        success: false,
        error: "El correo y la contraseña son obligatorios",
      };
    }

    const result = await login(email, password);

    // ─── Notificación al admin (no bloquea si falla) ───
    // Se ejecuta después del login exitoso. notifyLogin tiene
    // timeout interno de MAIL_TIMEOUT_MS, así que no puede
    // colgar la respuesta al usuario más allá de ese límite.
    await notifyLogin({
      nombre: result.user.NOMBRE,
      email: result.user.EMAIL,
      sucursalNombre: result.user["NOMBRE_SUCURSAL"],
      nombreEmpleado: result.user["NOMBRE_EMPLEADO"],
    });

    return { success: true, data: result };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error desconocido",
    };
  }
});

export const fnPermisosUsuarioGet = createServerFn({ method: "POST" })
  .validator((data: { userId: number }) => data)
  .handler(async ({ data }) => {
    try {
      const permisos: string[] = await getPermisosUsuario(data.userId);
      return { success: true, data: permisos };
    } catch (error) {
      console.error("❌ [fnPermisosUsuarioGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
