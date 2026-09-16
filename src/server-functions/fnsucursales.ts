import { createServerFn } from "@tanstack/react-start";
import { getSucursales } from "../integrations/mysql/sucursales";
import {
  deleteSucursal,
  getSucursalesDetalle,
  insertSucursal,
  updateSucursal,
} from "../integrations/mysql/sucursales";
import { SucursalInsert, SucursalSelect } from "../types/mysqltypes";

export const sucursalesFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sucursales = await getSucursales();
    return { success: true, data: sucursales };
  } catch (error) {
    console.error("❌ [ServerFn] Error obteniendo sucursales:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
});

export const fnSucursalesDetalleGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: SucursalSelect[] = await getSucursalesDetalle();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnSucursalesDetalleGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnSucursalInsert = createServerFn({ method: "POST" })
  .validator((data: SucursalInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertSucursal(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnSucursalInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnSucursalUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; sucursal: Partial<SucursalInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateSucursal(data.id, data.sucursal);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnSucursalUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnSucursalDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteSucursal(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnSucursalDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
