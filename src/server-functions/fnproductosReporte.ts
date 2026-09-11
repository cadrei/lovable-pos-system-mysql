import { createServerFn } from "@tanstack/react-start";
import { getProductosReporte } from "../integrations/mysql/productos";
import { VistaProductos } from "../types/mysqltypes";

export const fnGetProductosReporte = createServerFn({ method: "POST" })
  .validator((data: { sucursalId?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: VistaProductos[] = await getProductosReporte(data.sucursalId ?? "");
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnGetProductosReporte] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
