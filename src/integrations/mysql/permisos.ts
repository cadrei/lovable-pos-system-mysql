import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { PermisoInsert, PermisoSelect } from "@/types/mysqltypes";

export async function getPermisos(): Promise<PermisoSelect[]> {
  console.log("🔵 [DB] Obteniendo permisos");
  const [rows] = await pool.query<PermisoSelect[]>(
    "SELECT PERMISO_ID, MODULO, DESCRIPCION FROM PERMISOS ORDER BY MODULO, PERMISO_ID",
  );
  console.log(`✅ [DB] Permisos retornados: ${rows.length}`);
  return rows;
}

export async function insertPermiso(data: PermisoInsert): Promise<number> {
  console.log("🔵 [DB] Insertando permiso");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO PERMISOS (PERMISO_ID, MODULO, DESCRIPCION) VALUES (?, ?, ?)",
    [data.PERMISO_ID, data.MODULO, data.DESCRIPCION],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updatePermiso(id: string, data: Partial<PermisoInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando permiso ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE PERMISOS SET MODULO = COALESCE(?, MODULO), DESCRIPCION = COALESCE(?, DESCRIPCION) WHERE PERMISO_ID = ?",
    [data.MODULO ?? null, data.DESCRIPCION ?? null, id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deletePermiso(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando permiso ${id}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM PERMISOS WHERE PERMISO_ID = ?", [
    id,
  ]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
