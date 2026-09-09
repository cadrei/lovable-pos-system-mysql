import { createServerFn } from "@tanstack/react-start";
import { getProductos } from "../integrations/mysql/productos";

export const getProductosFn = createServerFn({ method: "POST" }) // ✅ cambiamos a POST para enviar sucursalId
  .validator((data: { sucursalId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const productosRaw = await getProductos(data.sucursalId);
      // devolvemos solo los campos que necesita el POS
      const productos = productosRaw.map((p) => ({
        id: p.idProducto,
        code: p.idProducto,
        barcode: p.etiquetas ?? "",
        name: p.nombreProducto,
        sale_price: p.pvp,
        cost_price: 0,
        stock: p.cantidad ?? 0,
        min_stock: p.stockMin ?? 0,
        max_stock: p.stockMaximo ?? 0,
        category: p.categoria ?? "",
        subcategory: p.subcategoria ?? "",
      }));
      return { success: true, data: productos };
    } catch (error) {
      console.error("❌ [fnproductos] Error en productos:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
