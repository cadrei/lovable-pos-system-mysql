import { createServerFn } from "@tanstack/react-start";
import { insertProducto } from "../integrations/mysql/productos";
import { ProductoInsertRow } from "../types/mysqltypes";

export const insertProductoFn = createServerFn({ method: "POST" })
  .validator((data: ProductoInsertRow) => data)
  .handler(async ({ data }) => {
    try {
      await insertProducto(data);
      return { success: true };
    } catch (error) {
      console.error("❌ [fnInsertProducto] Error insertando producto:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
