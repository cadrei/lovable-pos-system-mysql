import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { UsuarioRolInsert, UsuarioRolSelect } from "@/types/mysqltypes";

export async function getUsuariosRoles(userId?: number): Promise<UsuarioRolSelect[]> {
  console.log("🔵 [DB] Obteniendo relaciones usuario-rol");
  const [rows] = await pool.query<UsuarioRolSelect[]>(
    userId === undefined
      ? "SELECT ID_UR, USER_ID, ROL_ID, FECHA_CREACION FROM USUARIO_ROL"
      : "SELECT ID_UR, USER_ID, ROL_ID, FECHA_CREACION FROM USUARIO_ROL WHERE USER_ID = ?",
    userId === undefined ? [] : [userId],
  );
  console.log(`✅ [DB] Relaciones usuario-rol retornadas: ${rows.length}`);
  return rows;
}

export async function insertUsuarioRol(data: UsuarioRolInsert): Promise<number> {
  console.log("🔵 [DB] Insertando relación usuario-rol");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO USUARIO_ROL (USER_ID, ROL_ID, FECHA_CREACION) VALUES (?, ?, COALESCE(?, CURRENT_TIMESTAMP))",
    [data.USER_ID, data.ROL_ID, data.FECHA_CREACION ?? null],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function deleteUsuarioRol(userId: number, rolId: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando relación usuario-rol ${userId}/${rolId}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM USUARIO_ROL WHERE USER_ID = ? AND ROL_ID = ?",
    [userId, rolId],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
