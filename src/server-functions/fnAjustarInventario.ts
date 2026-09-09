import { createServerFn } from "@tanstack/react-start";
import { ajustarInventarioSuc } from "../integrations/mysql/inventario";

export const ajustarInventarioFn = createServerFn({ method: "POST" })
  .validator((data: { productId: string; nuevoStock: number; sucursalId: string }) => data)
  .handler(async ({ data }) => {
    try {
      await ajustarInventarioSuc(data);
      return { success: true };
    } catch (error) {
      console.error("❌ [fnAjustarInventario] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
