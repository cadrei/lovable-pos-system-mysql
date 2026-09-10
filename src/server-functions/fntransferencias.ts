import { createServerFn } from "@tanstack/react-start";
import {
  deleteTransferencia,
  getTransferencias,
  insertTransferencia,
  updateTransferencia,
} from "../integrations/mysql/transferencias";
import { TransferenciaInsert, TransferenciaSelect } from "../types/mysqltypes";

export const fnTransferenciasGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: TransferenciaSelect[] = await getTransferencias();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnTransferenciasGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnTransferenciaInsert = createServerFn({ method: "POST" })
  .validator((data: TransferenciaInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertTransferencia(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnTransferenciaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnTransferenciaUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: number; transferencia: Partial<TransferenciaInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateTransferencia(data.id, data.transferencia);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnTransferenciaUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnTransferenciaDelete = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteTransferencia(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnTransferenciaDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
