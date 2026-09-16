import { createServerFn } from "@tanstack/react-start";
import {
  deleteImpuesto,
  getImpuestos,
  insertImpuesto,
  updateImpuesto,
} from "../integrations/mysql/impuestos";
import { ImpuestoInsert, ImpuestoSelect } from "../types/mysqltypes";

export const fnImpuestosGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: ImpuestoSelect[] = await getImpuestos();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnImpuestosGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnImpuestoInsert = createServerFn({ method: "POST" })
  .validator((data: ImpuestoInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertImpuesto(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnImpuestoInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnImpuestoUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; impuesto: Partial<ImpuestoInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateImpuesto(data.id, data.impuesto);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnImpuestoUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnImpuestoDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteImpuesto(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnImpuestoDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
