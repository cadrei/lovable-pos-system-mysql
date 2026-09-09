import { createServerFn } from "@tanstack/react-start";
import { getSucursales } from "../integrations/mysql/sucursales";

export const sucursalesFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sucursales = await getSucursales();
    return { success: true, data: sucursales };
  } catch (error) {
    console.error("❌ [ServerFn] Error obteniendo sucursales:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
});
