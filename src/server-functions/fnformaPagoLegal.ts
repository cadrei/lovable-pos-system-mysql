import { createServerFn } from "@tanstack/react-start";
import {
  deleteFormaPagoLegal,
  getFormasPagoLegales,
  insertFormaPagoLegal,
  updateFormaPagoLegal,
} from "../integrations/mysql/formaPagoLegal";
import { FormaPagoLegalInsert, FormaPagoLegalSelect } from "../types/mysqltypes";

export const fnFormasPagoLegalesGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: FormaPagoLegalSelect[] = await getFormasPagoLegales();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnFormasPagoLegalesGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnFormaPagoLegalInsert = createServerFn({ method: "POST" })
  .validator((data: FormaPagoLegalInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertFormaPagoLegal(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnFormaPagoLegalInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnFormaPagoLegalUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; formaPago: Partial<FormaPagoLegalInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateFormaPagoLegal(data.id, data.formaPago);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnFormaPagoLegalUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnFormaPagoLegalDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteFormaPagoLegal(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnFormaPagoLegalDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
