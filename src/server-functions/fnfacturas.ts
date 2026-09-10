import { createServerFn } from "@tanstack/react-start";
import {
  deleteFactura,
  getFacturas,
  insertFactura,
  updateFactura,
} from "../integrations/mysql/facturas";
import { FacturaInsert, FacturaSelect } from "../types/mysqltypes";

export const fnFacturasGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: FacturaSelect[] = await getFacturas();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnFacturasGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnFacturaInsert = createServerFn({ method: "POST" })
  .validator((data: FacturaInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertFactura(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnFacturaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnFacturaUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: number; factura: Partial<FacturaInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateFactura(data.id, data.factura);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnFacturaUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnFacturaDelete = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteFactura(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnFacturaDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
