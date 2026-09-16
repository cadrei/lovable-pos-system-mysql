import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { RolInsert, RolSelect } from "@/types/mysqltypes";

export async function getRoles(): Promise<RolSelect[]> {
  console.log("🔵 [roles.getRoles] Obteniendo roles...");
  try {
    const [rows] = await pool.query<RolSelect[]>(
      "SELECT ROL_ID, NOMBRE, DESCRIPCION FROM ROLES ORDER BY NOMBRE",
    );
    console.log(`✅ [roles.getRoles] Roles obtenidos: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [roles.getRoles] Error obteniendo roles: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertRol(data: RolInsert): Promise<number> {
  console.log(`🔵 [roles.insertRol] Insertando rol con: ${data.NOMBRE}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO ROLES (NOMBRE, DESCRIPCION) VALUES (?, ?)",
      [data.NOMBRE, data.DESCRIPCION ?? null],
    );
    console.log(
      `✅ [roles.insertRol] Exito insertando rol afectados= ${result.affectedRows}, resultado=${result.insertId}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [roles.insertRol] error insertando rol: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateRol(id: number, data: Partial<RolInsert>): Promise<number> {
  console.log(`🔵 [roles.updateRol] Actualizando rol con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE ROLES SET NOMBRE = COALESCE(?, NOMBRE), DESCRIPCION = ? WHERE ROL_ID = ?",
      [data.NOMBRE ?? null, data.DESCRIPCION ?? null, id],
    );
    console.log(`✅ [roles.updateRol] Exito actualizando rol afectados= ${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [roles.updateRol] Error actualizando rol: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteRol(id: number): Promise<number> {
  console.log(`🔵 [roles.deleteRol] Eliminando rol con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM ROLES WHERE ROL_ID = ?", [id]);
    console.log(`✅ [roles.deleteRol] Exito eliminando rol afectados= ${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [roles.deleteRol] Error eliminando rol: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
