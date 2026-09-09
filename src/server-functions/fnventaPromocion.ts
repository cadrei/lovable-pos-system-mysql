import { createServerFn } from "@tanstack/react-start";
import {
  deleteVentaPromocion,
  getVentasPromociones,
  insertVentaPromocion,
  updateVentaPromocion,
} from "../integrations/mysql/ventaPromocion";
import { VentaPromocionInsert, VentaPromocionSelect } from "../types/mysqltypes";

export const fnVentasPromocionesGet = createServerFn({ method: "POST" })
  .validator((data: { idVenta?: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result: VentaPromocionSelect[] = await getVentasPromociones(data.idVenta);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnVentasPromocionesGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnVentaPromocionInsert = createServerFn({ method: "POST" })
  .validator((data: VentaPromocionInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertVentaPromocion(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnVentaPromocionInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnVentaPromocionUpdate = createServerFn({ method: "POST" })
  .validator((data: { idVenta: number; idPromoCombo: string; descuento: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateVentaPromocion(data.idVenta, data.idPromoCombo, data.descuento);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnVentaPromocionUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnVentaPromocionDelete = createServerFn({ method: "POST" })
  .validator((data: { idVenta: number; idPromoCombo: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteVentaPromocion(data.idVenta, data.idPromoCombo);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnVentaPromocionDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
