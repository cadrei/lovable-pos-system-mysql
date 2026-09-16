import { createServerFn } from "@tanstack/react-start";
import {
  getMovimientosCaja,
  getMovimientosCajaDetalle,
  insertMovimientoCaja,
} from "../integrations/mysql/caja";
import { CashMovementInsert, CashMovementSelect } from "../types/mysqltypes";

export const getMovimientosCajaFn = createServerFn({ method: "POST" })
  .validator((data: { sessionId: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data?.sessionId) {
        return { success: false, error: "Falta el identificador de la sesión de caja" };
      }

      const movimientos = await getMovimientosCaja(data.sessionId);
      return { success: true, data: movimientos };
    } catch (error) {
      console.error("❌ [ServerFn] Error obteniendo movimientos de caja:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnMovimientosCajaDetalleGet = createServerFn({ method: "POST" })
  .validator((data: { sessionId?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const movimientos: CashMovementSelect[] = await getMovimientosCajaDetalle(data.sessionId);
      return { success: true, data: movimientos };
    } catch (error) {
      console.error("❌ [fnMovimientosCajaDetalleGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnInsertMovimientoCaja = createServerFn({ method: "POST" })
  .validator((data: CashMovementInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertMovimientoCaja(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnInsertMovimientoCaja] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
