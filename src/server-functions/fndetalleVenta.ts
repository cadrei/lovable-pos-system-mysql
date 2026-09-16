import { createServerFn } from "@tanstack/react-start";
import {
  deleteDetalleVenta,
  getDetallesVenta,
  insertDetalleVenta,
  updateDetalleVenta,
} from "../integrations/mysql/detalleVenta";
import { DetalleVentaInsert, DetalleVentaSelect } from "../types/mysqltypes";

export const fnDetallesVentaGet = createServerFn({ method: "POST" })
  .validator((data: { idVenta?: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result: DetalleVentaSelect[] = await getDetallesVenta(data.idVenta);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnDetallesVentaGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnDetalleVentaInsert = createServerFn({ method: "POST" })
  .validator((data: DetalleVentaInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertDetalleVenta(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnDetalleVentaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnDetalleVentaUpdate = createServerFn({ method: "POST" })
  .validator((data: { idDetalle: number; detalle: Partial<DetalleVentaInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateDetalleVenta(data.idDetalle, data.detalle);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnDetalleVentaUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnDetalleVentaDelete = createServerFn({ method: "POST" })
  .validator((data: { idDetalle: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteDetalleVenta(data.idDetalle);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnDetalleVentaDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
