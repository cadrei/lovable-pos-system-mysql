import { createServerFn } from "@tanstack/react-start";
import { login } from "../integrations/mysql/auth";

export const loginFn = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { email, password } = (data ?? {}) as {
    email?: string;
    password?: string;
  };
  try {
    if (!email || !password) {
      return { success: false, error: "El correo y la contraseña son obligatorios" };
    }
    const result = await login(email, password);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error desconocido" };
  }
});
