import { createServerFn } from "@tanstack/react-start";
import { getVistaVentas } from "../integrations/mysql/vistaVentas";
import { VistaVentas } from "../types/mysqltypes";

export const fnGetVistaVentasReporte = createServerFn({ method: "POST" })
  .validator((data: { desde: string; hasta: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: VistaVentas[] = await getVistaVentas(data.desde, data.hasta);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnGetVistaVentasReporte] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
