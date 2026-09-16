import { createServerFn } from "@tanstack/react-start";
import {
  deleteTipoDocumento,
  getTiposDocumento,
  insertTipoDocumento,
  updateTipoDocumento,
} from "../integrations/mysql/tipoDocumento";
import { TipoDocumentoInsert, TipoDocumentoSelect } from "../types/mysqltypes";

export const fnTiposDocumentoGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: TipoDocumentoSelect[] = await getTiposDocumento();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnTiposDocumentoGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnTipoDocumentoInsert = createServerFn({ method: "POST" })
  .validator((data: TipoDocumentoInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertTipoDocumento(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnTipoDocumentoInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnTipoDocumentoUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; tipo: Partial<TipoDocumentoInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateTipoDocumento(data.id, data.tipo);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnTipoDocumentoUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnTipoDocumentoDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteTipoDocumento(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnTipoDocumentoDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
