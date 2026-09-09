import { createServerFn } from "@tanstack/react-start";
import {
  deletePromocionDetalle,
  getPromocionesDetalle,
  insertPromocionDetalle,
  updatePromocionDetalle,
} from "../integrations/mysql/promocionesDetalle";
import { PromocionesDetalleInsert, PromocionesDetalleSelect } from "../types/mysqltypes";

export const fnPromocionesDetalleGet = createServerFn({ method: "POST" })
  .validator((data: { idPromoCombo?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: PromocionesDetalleSelect[] = await getPromocionesDetalle(data.idPromoCombo);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPromocionesDetalleGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPromocionDetalleInsert = createServerFn({ method: "POST" })
  .validator((data: PromocionesDetalleInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertPromocionDetalle(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPromocionDetalleInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPromocionDetalleUpdate = createServerFn({ method: "POST" })
  .validator((data: { idDetalle: number; detalle: Partial<PromocionesDetalleInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updatePromocionDetalle(data.idDetalle, data.detalle);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPromocionDetalleUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPromocionDetalleDelete = createServerFn({ method: "POST" })
  .validator((data: { idDetalle: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deletePromocionDetalle(data.idDetalle);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPromocionDetalleDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
