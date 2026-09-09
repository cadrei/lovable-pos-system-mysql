import { createServerFn } from "@tanstack/react-start";
import { getMovimientosCaja } from "../integrations/mysql/caja";

export const getMovimientosCajaFn = createServerFn({ method: "POST" })
  .validator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data?.sessionId) {
        return { success: false, error: "Falta el identificador de la sesión de caja" };
      }

      const movimientos = await getMovimientosCaja(data.sessionId);
      return { success: true, data: movimientos };
    } catch (error) {
      console.error("❌ [ServerFn] Error obteniendo movimientos de caja:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
