import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { AuditoriaUsuarioRow } from "@/types/mysqltypes";

export async function getAuditoriaUsuarios(): Promise<AuditoriaUsuarioRow[]> {
  console.log("🔵 [auditoriaUsuarios.getAuditoriaUsuarios] Obteniendo auditoria_usuarios...");
  try {
    const [rows] = await pool.query<AuditoriaUsuarioRow[]>(
      `SELECT ID_LOG, USER_ID, USER_EMAIL, ACTION, MODULE, ENTITY, ENTITY_ID,
              OLD_VALUE, NEW_VALUE, IP, FECHA_CREACION
       FROM AUDITORIA_USUARIOS
       ORDER BY FECHA_CREACION DESC
       LIMIT 200`,
    );
    console.log(
      `✅ [auditoriaUsuarios.getAuditoriaUsuarios] auditoria_usuarios obtenidos: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [auditoriaUsuarios.getAuditoriaUsuarios] Error obteniendo auditoria_usuarios: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
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
  console.log(
    `🔵 [auditoriaUsuarios.insertAuditoriaUsuario] Insertando auditoria_usuarios con: USER_ID=${data.USER_ID}, ACTION=${data.ACTION}, MODULE=${data.MODULE}`,
  );
  try {
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
    console.log(
      `✅ [auditoriaUsuarios.insertAuditoriaUsuario] Éxito insertando auditoria_usuarios: insertId=${result.insertId}, afectados=${result.affectedRows}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [auditoriaUsuarios.insertAuditoriaUsuario] Error insertando auditoria_usuarios: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteAuditoriaUsuario(id: number): Promise<number> {
  console.log(
    `🔵 [auditoriaUsuarios.deleteAuditoriaUsuario] Eliminando auditoria_usuarios con: id=${id}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM AUDITORIA_USUARIOS WHERE ID_LOG = ?",
      [id],
    );
    console.log(
      `✅ [auditoriaUsuarios.deleteAuditoriaUsuario] Éxito eliminando auditoria_usuarios: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [auditoriaUsuarios.deleteAuditoriaUsuario] Error eliminando auditoria_usuarios ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
