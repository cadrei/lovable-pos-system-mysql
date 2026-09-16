import { createServerFn } from "@tanstack/react-start";
import {
  deletePago,
  getPagos,
  getPagosMetodo,
  insertPago,
  updatePago,
} from "../integrations/mysql/pagos";
import { PagoInsert, PagoSelect, PagosMetodo } from "../types/mysqltypes";

export const fnPagosMetodoGet = createServerFn({ method: "POST" })
  .validator((data: { desde: string; hasta: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: PagosMetodo[] = await getPagosMetodo(data.desde, data.hasta);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPagosMetodoGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPagosGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: PagoSelect[] = await getPagos();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnPagosGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnPagoInsert = createServerFn({ method: "POST" })
  .validator((data: PagoInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertPago(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPagoInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPagoUpdate = createServerFn({ method: "POST" })
  .validator((data: { idPago: number; pago: Partial<PagoInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updatePago(data.idPago, data.pago);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPagoUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPagoDelete = createServerFn({ method: "POST" })
  .validator((data: { idPago: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deletePago(data.idPago);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPagoDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
