import { createServerFn } from "@tanstack/react-start";
import { register } from "../integrations/mysql/auth";

export const registerFn = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const { nombre, nombreUsuario, email, password, telefono, idSucursal } = (data ?? {}) as {
    nombre?: string;
    nombreUsuario?: string;
    email?: string;
    password?: string;
    telefono?: string;
    idSucursal?: number;
  };
  try {
    if (!nombre || !nombreUsuario || !email || !password || !telefono) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }
    await register(nombre, nombreUsuario, email, password, telefono, idSucursal?.toString());
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Error desconocido" };
  }
});
