import { createServerFn } from "@tanstack/react-start";
import { getSesionesCajaReporte } from "../integrations/mysql/caja";
import { CashSessionReporte } from "../types/mysqltypes";

export const fnGetSesionesCajaReporte = createServerFn({ method: "POST" })
  .validator((data: { desde: string; hasta: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: CashSessionReporte[] = await getSesionesCajaReporte(data.desde, data.hasta);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnGetSesionesCajaReporte] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
