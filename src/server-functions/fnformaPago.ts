import { createServerFn } from "@tanstack/react-start";
import {
  deleteFormaPago,
  getFormasPago,
  insertFormaPago,
  updateFormaPago,
} from "../integrations/mysql/formaPago";
import { FormaPagoInsert, FormaPagoSelect } from "../types/mysqltypes";

export const fnFormasPagoGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: FormaPagoSelect[] = await getFormasPago();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnFormasPagoGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnFormaPagoInsert = createServerFn({ method: "POST" })
  .validator((data: FormaPagoInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertFormaPago(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnFormaPagoInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnFormaPagoUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; formaPago: Partial<FormaPagoInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateFormaPago(data.id, data.formaPago);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnFormaPagoUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnFormaPagoDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteFormaPago(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnFormaPagoDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
