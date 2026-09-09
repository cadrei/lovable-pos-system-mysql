import { createServerFn } from "@tanstack/react-start";
import {
  deleteProductoSucursal,
  getProductoSucursal,
  getProductosSucursal,
  insertProductoSucursal,
  updateProductoSucursal,
} from "../integrations/mysql/productosSucursal";
import { ProductoSucursalInsert, ProductoSucursalSelect } from "../types/mysqltypes";

export const fnProductosSucursalGet = createServerFn({ method: "POST" })
  .validator((data: { sucursalId?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: ProductoSucursalSelect[] = await getProductosSucursal(data.sucursalId);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductosSucursalGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnProductoSucursalGet = createServerFn({ method: "POST" })
  .validator((data: { productoId: string; sucursalId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: ProductoSucursalSelect | null = await getProductoSucursal(
        data.productoId,
        data.sucursalId,
      );
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductoSucursalGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnProductoSucursalInsert = createServerFn({ method: "POST" })
  .validator((data: ProductoSucursalInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertProductoSucursal(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductoSucursalInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnProductoSucursalUpdate = createServerFn({ method: "POST" })
  .validator(
    (data: { productoId: string; sucursalId: string; producto: Partial<ProductoSucursalInsert> }) =>
      data,
  )
  .handler(async ({ data }) => {
    try {
      const result = await updateProductoSucursal(data.productoId, data.sucursalId, data.producto);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductoSucursalUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnProductoSucursalDelete = createServerFn({ method: "POST" })
  .validator((data: { productoId: string; sucursalId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteProductoSucursal(data.productoId, data.sucursalId);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductoSucursalDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
