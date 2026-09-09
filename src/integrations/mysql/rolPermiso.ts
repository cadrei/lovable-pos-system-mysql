import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { RolPermisoInsert, RolPermisoSelect } from "@/types/mysqltypes";

export async function getRolesPermisos(rolId?: number): Promise<RolPermisoSelect[]> {
  console.log("🔵 [DB] Obteniendo relaciones rol-permiso");
  const [rows] = await pool.query<RolPermisoSelect[]>(
    rolId === undefined
      ? "SELECT RP_ID, ROL_ID, PERMISO_ID FROM ROL_PERMISO"
      : "SELECT RP_ID, ROL_ID, PERMISO_ID FROM ROL_PERMISO WHERE ROL_ID = ?",
    rolId === undefined ? [] : [rolId],
  );
  console.log(`✅ [DB] Relaciones rol-permiso retornadas: ${rows.length}`);
  return rows;
}

export async function insertRolPermiso(data: RolPermisoInsert): Promise<number> {
  console.log("🔵 [DB] Insertando relación rol-permiso");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO ROL_PERMISO (ROL_ID, PERMISO_ID) VALUES (?, ?)",
    [data.ROL_ID, data.PERMISO_ID],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function deleteRolPermiso(rolId: number, permisoId: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando relación rol-permiso ${rolId}/${permisoId}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM ROL_PERMISO WHERE ROL_ID = ? AND PERMISO_ID = ?",
    [rolId, permisoId],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
