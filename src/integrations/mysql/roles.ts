import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { RolInsert, RolSelect } from "@/types/mysqltypes";

export async function getRoles(): Promise<RolSelect[]> {
  console.log("🔵 [DB] Obteniendo roles");
  const [rows] = await pool.query<RolSelect[]>(
    "SELECT ROL_ID, NOMBRE, DESCRIPCION FROM ROLES ORDER BY NOMBRE",
  );
  console.log(`✅ [DB] Roles retornados: ${rows.length}`);
  return rows;
}

export async function insertRol(data: RolInsert): Promise<number> {
  console.log("🔵 [DB] Insertando rol");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO ROLES (NOMBRE, DESCRIPCION) VALUES (?, ?)",
    [data.NOMBRE, data.DESCRIPCION ?? null],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function updateRol(id: number, data: Partial<RolInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando rol ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE ROLES SET NOMBRE = COALESCE(?, NOMBRE), DESCRIPCION = ? WHERE ROL_ID = ?",
    [data.NOMBRE ?? null, data.DESCRIPCION ?? null, id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteRol(id: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando rol ${id}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM ROLES WHERE ROL_ID = ?", [id]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
