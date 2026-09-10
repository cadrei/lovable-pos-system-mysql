import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { MarcaInsert, MarcaSelect } from "@/types/mysqltypes";

export async function getMarcas(): Promise<MarcaSelect[]> {
  console.log("🔵 [DB] Obteniendo marcas");
  const [rows] = await pool.query<MarcaSelect[]>(
    "SELECT ID_MARCA, NOMBRE, DESCRIPCION, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM MARCAS ORDER BY NOMBRE",
  );
  console.log(`✅ [DB] Marcas retornadas: ${rows.length}`);
  return rows;
}

export async function insertMarca(data: MarcaInsert): Promise<number> {
  console.log("🔵 [DB] Insertando marca");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO MARCAS (NOMBRE, DESCRIPCION, ESTADO) VALUES (?, ?, ?)",
    [data.NOMBRE, data.DESCRIPCION ?? null, data.ESTADO ?? "A"],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function updateMarca(id: number, data: Partial<MarcaInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando marca ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE MARCAS SET NOMBRE = COALESCE(?, NOMBRE), DESCRIPCION = ?, ESTADO = COALESCE(?, ESTADO) WHERE ID_MARCA = ?",
    [data.NOMBRE ?? null, data.DESCRIPCION ?? null, data.ESTADO ?? null, id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteMarca(id: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando marca ${id}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM MARCAS WHERE ID_MARCA = ?", [id]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
