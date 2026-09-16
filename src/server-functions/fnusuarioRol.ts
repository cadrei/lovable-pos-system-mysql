import { createServerFn } from "@tanstack/react-start";
import {
  deleteUsuarioRol,
  getUsuariosRoles,
  insertUsuarioRol,
} from "../integrations/mysql/usuarioRol";
import { UsuarioRolInsert, UsuarioRolSelect } from "../types/mysqltypes";

export const fnUsuariosRolesGet = createServerFn({ method: "POST" })
  .validator((data: { userId?: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result: UsuarioRolSelect[] = await getUsuariosRoles(data.userId);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnUsuariosRolesGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnUsuarioRolInsert = createServerFn({ method: "POST" })
  .validator((data: UsuarioRolInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertUsuarioRol(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnUsuarioRolInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnUsuarioRolDelete = createServerFn({ method: "POST" })
  .validator((data: { userId: number; rolId: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteUsuarioRol(data.userId, data.rolId);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnUsuarioRolDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
