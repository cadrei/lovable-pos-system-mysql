import { createServerFn } from "@tanstack/react-start";
import { getVistaDetalleVentas } from "../integrations/mysql/vistaVentas";
import { VistaDetalleVentas } from "../types/mysqltypes";

export const fnGetVistaDetalleVentasReporte = createServerFn({ method: "POST" })
  .validator((data: { desde: string; hasta: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: VistaDetalleVentas[] = await getVistaDetalleVentas(data.desde, data.hasta);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnGetVistaDetalleVentasReporte] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
