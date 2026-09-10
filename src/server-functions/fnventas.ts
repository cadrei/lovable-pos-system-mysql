import { createServerFn } from "@tanstack/react-start";
import { deleteVenta, getVentas, insertVenta, updateVenta } from "../integrations/mysql/ventas";
import { VentaInsert, VentaSelect } from "../types/mysqltypes";

export const fnVentasGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: VentaSelect[] = await getVentas();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnVentasGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnVentaInsert = createServerFn({ method: "POST" })
  .validator((data: VentaInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertVenta(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnVentaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnVentaUpdate = createServerFn({ method: "POST" })
  .validator((data: { idVenta: number; venta: Partial<VentaInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateVenta(data.idVenta, data.venta);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnVentaUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnVentaDelete = createServerFn({ method: "POST" })
  .validator((data: { idVenta: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteVenta(data.idVenta);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnVentaDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
