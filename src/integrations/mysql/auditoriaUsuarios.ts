import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { AuditoriaUsuarioRow } from "@/types/mysqltypes";

export async function getAuditoriaUsuarios(): Promise<AuditoriaUsuarioRow[]> {
  console.log("🔵 [DB] Obteniendo auditoría de usuarios");
  const [rows] = await pool.query<AuditoriaUsuarioRow[]>(
    `SELECT ID_LOG, USER_ID, USER_EMAIL, ACTION, MODULE, ENTITY, ENTITY_ID,
            OLD_VALUE, NEW_VALUE, IP, FECHA_CREACION
     FROM AUDITORIA_USUARIOS
     ORDER BY FECHA_CREACION DESC
     LIMIT 200`,
  );
  console.log(`✅ [DB] Registros de auditoría retornados: ${rows.length}`);
  return rows;
}

export async function insertAuditoriaUsuario(data: {
  USER_ID: number;
  USER_EMAIL: string;
  ACTION: string;
  MODULE: string;
  ENTITY?: string | null;
  ENTITY_ID?: string | null;
  OLD_VALUE?: unknown;
  NEW_VALUE?: unknown;
  IP?: string | null;
}): Promise<number> {
  console.log("🔵 [DB] Insertando registro de auditoría");
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO AUDITORIA_USUARIOS
      (USER_ID, USER_EMAIL, ACTION, MODULE, ENTITY, ENTITY_ID, OLD_VALUE, NEW_VALUE, IP)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.USER_ID,
      data.USER_EMAIL,
      data.ACTION,
      data.MODULE,
      data.ENTITY ?? null,
      data.ENTITY_ID ?? null,
      data.OLD_VALUE ? JSON.stringify(data.OLD_VALUE) : null,
      data.NEW_VALUE ? JSON.stringify(data.NEW_VALUE) : null,
      data.IP ?? null,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function deleteAuditoriaUsuario(id: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando registro de auditoría ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM AUDITORIA_USUARIOS WHERE ID_LOG = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
