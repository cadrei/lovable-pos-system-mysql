import { createServerFn } from "@tanstack/react-start";
import {
  deleteRolPermiso,
  getRolesPermisos,
  insertRolPermiso,
} from "../integrations/mysql/rolPermiso";
import { RolPermisoInsert, RolPermisoSelect } from "../types/mysqltypes";

export const fnRolesPermisosGet = createServerFn({ method: "POST" })
  .validator((data: { rolId?: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result: RolPermisoSelect[] = await getRolesPermisos(data.rolId);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnRolesPermisosGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnRolPermisoInsert = createServerFn({ method: "POST" })
  .validator((data: RolPermisoInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertRolPermiso(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnRolPermisoInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnRolPermisoDelete = createServerFn({ method: "POST" })
  .validator((data: { rolId: number; permisoId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteRolPermiso(data.rolId, data.permisoId);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnRolPermisoDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
