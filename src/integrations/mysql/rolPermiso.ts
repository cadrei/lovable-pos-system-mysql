import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { RolPermisoInsert, RolPermisoSelect } from "@/types/mysqltypes";

export async function getRolesPermisos(rolId?: number): Promise<RolPermisoSelect[]> {
  console.log(
    `🔵 [rolPermiso.getRolesPermisos] Obteniendo rol_permiso con: rolId=${rolId ?? "todos"}`,
  );
  try {
    const [rows] = await pool.query<RolPermisoSelect[]>(
      rolId === undefined
        ? "SELECT RP_ID, ROL_ID, PERMISO_ID FROM ROL_PERMISO"
        : "SELECT RP_ID, ROL_ID, PERMISO_ID FROM ROL_PERMISO WHERE ROL_ID = ?",
      rolId === undefined ? [] : [rolId],
    );
    console.log(`✅ [rolPermiso.getRolesPermisos] rol_permiso obtenidos: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [rolPermiso.getRolesPermisos] Error obteniendo rol_permiso ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertRolPermiso(data: RolPermisoInsert): Promise<number> {
  console.log(
    `🔵 [rolPermiso.insertRolPermiso] Insertando rol_permiso: rolId=${data.ROL_ID}, permisoId=${data.PERMISO_ID}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO ROL_PERMISO (ROL_ID, PERMISO_ID) VALUES (?, ?)",
      [data.ROL_ID, data.PERMISO_ID],
    );
    console.log(
      `✅ [rolPermiso.insertRolPermiso] Exito insertando rol_permiso: ${result.affectedRows}, resultado=${result.insertId}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [rolPermiso.insertRolPermiso] Error insertando rol_permiso: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteRolPermiso(rolId: number, permisoId: string): Promise<number> {
  console.log(
    `🔵 [rolPermiso.deleteRolPermiso] Eliminando rol_permiso con: rolId=${rolId}, permisoId=${permisoId}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM ROL_PERMISO WHERE ROL_ID = ? AND PERMISO_ID = ?",
      [rolId, permisoId],
    );
    console.log(
      `✅ [rolPermiso.deleteRolPermiso] Exito eliminando rol_permiso afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [rolPermiso.deleteRolPermiso] Error eliminando rol_permiso: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
