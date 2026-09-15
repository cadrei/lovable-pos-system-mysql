import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { UsuarioRolInsert, UsuarioRolSelect } from "@/types/mysqltypes";

export async function getUsuariosRoles(userId?: number): Promise<UsuarioRolSelect[]> {
  console.log(
    `🔵 [usuarioRol.getUsuariosRoles] Obteniendo usuario_rol para: userId=${userId ?? "todos"}`,
  );
  try {
    const [rows] = await pool.query<UsuarioRolSelect[]>(
      userId === undefined
        ? "SELECT ID_UR, USER_ID, ROL_ID, FECHA_CREACION FROM USUARIO_ROL"
        : "SELECT ID_UR, USER_ID, ROL_ID, FECHA_CREACION FROM USUARIO_ROL WHERE USER_ID = ?",
      userId === undefined ? [] : [userId],
    );
    console.log(`✅ [usuarioRol.getUsuariosRoles] usuario_rol obtenidos: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [usuarioRol.getUsuariosRoles] Error obteniendo usuario_rol: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertUsuarioRol(data: UsuarioRolInsert): Promise<number> {
  console.log(
    `🔵 [usuarioRol.insertUsuarioRol] Insertando usuario_rol: userId=${data.USER_ID}, rolId=${data.ROL_ID}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO USUARIO_ROL (USER_ID, ROL_ID, FECHA_CREACION) VALUES (?, ?, COALESCE(?, CURRENT_TIMESTAMP))",
      [data.USER_ID, data.ROL_ID, data.FECHA_CREACION ?? null],
    );
    console.log(
      `✅ [usuarioRol.insertUsuarioRol] Exito insertando usuario_rol afectados= ${result.affectedRows}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [usuarioRol.insertUsuarioRol] Error insertando usuario_rol: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteUsuarioRol(userId: number, rolId: number): Promise<number> {
  console.log(
    `🔵 [usuarioRol.deleteUsuarioRol] Eliminando usuario_rol : userId=${userId}, rolId=${rolId}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM USUARIO_ROL WHERE USER_ID = ? AND ROL_ID = ?",
      [userId, rolId],
    );
    console.log(
      `✅ [usuarioRol.deleteUsuarioRol] Exito eliminando usuario_rol afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [usuarioRol.deleteUsuarioRol] Error eliminando usuario_rol: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
