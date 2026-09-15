import { createServerFn } from "@tanstack/react-start";
import { VistaProductoRow } from "../types/mysqltypes";
import { getProductosVista } from "../integrations/mysql/productos";

export const getProductosVistaFn = createServerFn({ method: "POST" })
  .validator((data: { idSucursal: string }) => data)
  .handler(async ({ data }) => {
    console.log(
      `🔵 [fnproductos.getProductosVistaFn] Obteniendo productos de la vista v_productos para sucursal=${data.idSucursal}`,
    );
    try {
      const productos: VistaProductoRow[] = await getProductosVista(data.idSucursal);

      console.log(
        `✅ [fnproductos.getProductosVistaFn] Éxito al obtener productos: ${productos.length} registros`,
      );
      return { success: true, data: productos };
    } catch (error) {
      console.error("❌ [fnproductos.getProductosVistaFn] Error en productos:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
