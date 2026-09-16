import { createServerFn } from "@tanstack/react-start";
import {
  deleteComboDetalle,
  getCombosDetalle,
  insertComboDetalle,
  updateComboDetalle,
} from "../integrations/mysql/combosDetalle";
import { CombosDetalleInsert, CombosDetalleSelect } from "../types/mysqltypes";

export const fnCombosDetalleGet = createServerFn({ method: "POST" })
  .validator((data: { idPromoCombo?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: CombosDetalleSelect[] = await getCombosDetalle(data.idPromoCombo);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCombosDetalleGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnComboDetalleInsert = createServerFn({ method: "POST" })
  .validator((data: CombosDetalleInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertComboDetalle(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnComboDetalleInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnComboDetalleUpdate = createServerFn({ method: "POST" })
  .validator((data: { idDetalle: number; detalle: Partial<CombosDetalleInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateComboDetalle(data.idDetalle, data.detalle);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnComboDetalleUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnComboDetalleDelete = createServerFn({ method: "POST" })
  .validator((data: { idDetalle: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteComboDetalle(data.idDetalle);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnComboDetalleDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
