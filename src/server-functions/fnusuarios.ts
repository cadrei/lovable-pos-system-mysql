import { createServerFn } from "@tanstack/react-start";
import {
  deleteUsuario,
  getUsuarios,
  insertUsuario,
  updateUsuario,
  updateUsuarioEstado,
} from "../integrations/mysql/usuarios";
import { UsuarioInsert, UsuarioSelect } from "../types/mysqltypes";

export const fnUsuariosGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: UsuarioSelect[] = await getUsuarios();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnUsuariosGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnUsuarioInsert = createServerFn({ method: "POST" })
  .validator((data: UsuarioInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertUsuario(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnUsuarioInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnUsuarioUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: number; usuario: Partial<UsuarioInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateUsuario(data.id, data.usuario);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnUsuarioUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnUsuarioDelete = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteUsuario(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnUsuarioDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnUsuarioEstadoUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: number; estado: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateUsuarioEstado(data.id, data.estado);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnUsuarioEstadoUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
