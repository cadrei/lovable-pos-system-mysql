import { createServerFn } from "@tanstack/react-start";
import {
  deleteAuditoriaUsuario,
  getAuditoriaUsuarios,
  insertAuditoriaUsuario,
} from "../integrations/mysql/auditoriaUsuarios";
import { AuditoriaUsuarioRow, AuditoriaUsuarioSelect } from "../types/mysqltypes";

function toAuditoriaSelect(row: AuditoriaUsuarioRow): AuditoriaUsuarioSelect {
  return {
    ID_LOG: row.ID_LOG,
    USER_ID: row.USER_ID,
    USER_EMAIL: row.USER_EMAIL,
    ACTION: row.ACTION,
    MODULE: row.MODULE,
    ENTITY: row.ENTITY,
    ENTITY_ID: row.ENTITY_ID,
    OLD_VALUE: row.OLD_VALUE === null ? null : JSON.stringify(row.OLD_VALUE),
    NEW_VALUE: row.NEW_VALUE === null ? null : JSON.stringify(row.NEW_VALUE),
    IP: row.IP,
    FECHA_CREACION: row.FECHA_CREACION,
  };
}

export const fnAuditoriaUsuariosGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const rows: AuditoriaUsuarioRow[] = await getAuditoriaUsuarios();
    const data: AuditoriaUsuarioSelect[] = rows.map(toAuditoriaSelect);
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnAuditoriaUsuariosGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnAuditoriaUsuarioInsert = createServerFn({ method: "POST" })
  .validator(
    (data: {
      USER_ID: number;
      USER_EMAIL: string;
      ACTION: string;
      MODULE: string;
      ENTITY?: string | null;
      ENTITY_ID?: string | null;
      OLD_VALUE?: unknown;
      NEW_VALUE?: unknown;
      IP?: string | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const result = await insertAuditoriaUsuario(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnAuditoriaUsuarioInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnAuditoriaUsuarioDelete = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteAuditoriaUsuario(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnAuditoriaUsuarioDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
