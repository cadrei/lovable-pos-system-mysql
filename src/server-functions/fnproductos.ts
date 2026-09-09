import { createServerFn } from "@tanstack/react-start";
import { getProductos } from "../integrations/mysql/productos";
import {
  deleteProducto,
  getProductosDetalle,
  insertProducto,
  updateProducto,
} from "../integrations/mysql/productos";
import { ProductoInsertRow, ProductoSelect } from "../types/mysqltypes";

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

export const fnProductosDetalleGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: ProductoSelect[] = await getProductosDetalle();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnProductosDetalleGet] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
});

export const fnProductoInsert = createServerFn({ method: "POST" })
  .validator((data: ProductoInsertRow) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertProducto(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductoInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnProductoUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; producto: Partial<ProductoInsertRow> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateProducto(data.id, data.producto);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductoUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnProductoDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteProducto(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductoDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
