import { createServerFn } from "@tanstack/react-start";
import { getProductosReporte } from "../integrations/mysql/productos";
import { VistaProductos } from "../types/mysqltypes";

export const fnGetProductosReporte = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const result: VistaProductos[] = await getProductosReporte();
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ [fnGetProductosReporte] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});
