import { createServerFn } from "@tanstack/react-start";
import { deleteRol, getRoles, insertRol, updateRol } from "../integrations/mysql/roles";
import { RolInsert, RolSelect } from "../types/mysqltypes";

export const fnRolesGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: RolSelect[] = await getRoles();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnRolesGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnRolInsert = createServerFn({ method: "POST" })
  .validator((data: RolInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertRol(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnRolInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnRolUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: number; rol: Partial<RolInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateRol(data.id, data.rol);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnRolUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnRolDelete = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteRol(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnRolDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
