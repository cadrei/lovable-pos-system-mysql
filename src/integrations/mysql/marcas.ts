import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { MarcaInsert, MarcaSelect } from "@/types/mysqltypes";

export async function getMarcas(): Promise<MarcaSelect[]> {
  console.log("🔵 [marcas.getMarcas] Obteniendo marcas...");
  try {
    const [rows] = await pool.query<MarcaSelect[]>(
      "SELECT ID_MARCA, NOMBRE, DESCRIPCION, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM MARCAS ORDER BY NOMBRE",
    );
    console.log(`✅ [marcas.getMarcas] Éxito obteniendo marcas: ${rows.length} registros`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [marcas.getMarcas] Error obteniendo marcas: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertMarca(data: MarcaInsert): Promise<number> {
  console.log(`🔵 [marcas.insertMarca] Insertando marca con: nombre=${data.NOMBRE}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO MARCAS (NOMBRE, DESCRIPCION, ESTADO) VALUES (?, ?, ?)",
      [data.NOMBRE, data.DESCRIPCION ?? null, data.ESTADO ?? "A"],
    );
    console.log(
      `✅ [marcas.insertMarca] Éxito insertando marca: insertId=${result.insertId}, afectados=${result.affectedRows}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [marcas.insertMarca] Error insertando marca: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateMarca(id: number, data: Partial<MarcaInsert>): Promise<number> {
  console.log(`🔵 [marcas.updateMarca] Actualizando marca con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE MARCAS SET NOMBRE = COALESCE(?, NOMBRE), DESCRIPCION = ?, ESTADO = COALESCE(?, ESTADO) WHERE ID_MARCA = ?",
      [data.NOMBRE ?? null, data.DESCRIPCION ?? null, data.ESTADO ?? null, id],
    );
    console.log(
      `✅ [marcas.updateMarca] Éxito actualizando marca: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [marcas.updateMarca] Error actualizando marca: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteMarca(id: number): Promise<number> {
  console.log(`🔵 [marcas.deleteMarca] Eliminando marca con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM MARCAS WHERE ID_MARCA = ?", [
      id,
    ]);
    console.log(`✅ [marcas.deleteMarca] Éxito eliminando marca: afectados=${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [marcas.deleteMarca] Error eliminando marca ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
