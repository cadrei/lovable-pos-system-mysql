import { createServerFn } from "@tanstack/react-start";
import { getSesionCaja } from "../integrations/mysql/caja";

export const getSesionCajaFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sesion = await getSesionCaja();
    return { success: true, data: sesion };
  } catch (error) {
    console.error("❌ [ServerFn] Error obteniendo sesión de caja:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});
