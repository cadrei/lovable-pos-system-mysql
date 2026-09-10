import { createServerFn } from "@tanstack/react-start";
import {
  deletePermiso,
  getPermisos,
  insertPermiso,
  updatePermiso,
} from "../integrations/mysql/permisos";
import { PermisoInsert, PermisoSelect } from "../types/mysqltypes";

export const fnPermisosGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: PermisoSelect[] = await getPermisos();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnPermisosGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnPermisoInsert = createServerFn({ method: "POST" })
  .validator((data: PermisoInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertPermiso(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPermisoInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPermisoUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; permiso: Partial<PermisoInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updatePermiso(data.id, data.permiso);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPermisoUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPermisoDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deletePermiso(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPermisoDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
