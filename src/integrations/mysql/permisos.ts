import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { PermisoInsert, PermisoSelect } from "@/types/mysqltypes";

export async function getPermisos(): Promise<PermisoSelect[]> {
  console.log("🔵 [permisos.getPermisos] Obteniendo permisos...");
  try {
    const [rows] = await pool.query<PermisoSelect[]>(
      "SELECT PERMISO_ID, MODULO, DESCRIPCION FROM PERMISOS ORDER BY MODULO, PERMISO_ID",
    );
    console.log(`✅ [permisos.getPermisos] Éxito obteniendo permisos: ${rows.length} registros`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [permisos.getPermisos] Error obteniendo permisos: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertPermiso(data: PermisoInsert): Promise<number> {
  console.log(
    `🔵 [permisos.insertPermiso] Insertando permiso con: id=${data.PERMISO_ID}, modulo=${data.MODULO}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO PERMISOS (PERMISO_ID, MODULO, DESCRIPCION) VALUES (?, ?, ?)",
      [data.PERMISO_ID, data.MODULO, data.DESCRIPCION],
    );
    console.log(
      `✅ [permisos.insertPermiso] Éxito insertando permiso: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [permisos.insertPermiso] Error insertando permiso: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updatePermiso(id: string, data: Partial<PermisoInsert>): Promise<number> {
  console.log(`🔵 [permisos.updatePermiso] Actualizando permiso con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE PERMISOS SET MODULO = COALESCE(?, MODULO), DESCRIPCION = COALESCE(?, DESCRIPCION) WHERE PERMISO_ID = ?",
      [data.MODULO ?? null, data.DESCRIPCION ?? null, id],
    );
    console.log(
      `✅ [permisos.updatePermiso] Éxito actualizando permiso: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [permisos.updatePermiso] Error actualizando permiso: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deletePermiso(id: string): Promise<number> {
  console.log(`🔵 [permisos.deletePermiso] Eliminando permiso con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM PERMISOS WHERE PERMISO_ID = ?",
      [id],
    );
    console.log(
      `✅ [permisos.deletePermiso] Éxito eliminando permiso: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [permisos.deletePermiso] Error eliminando permiso: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
