import pool from "../../../database/mysqlpool";
import { CategoriaRow } from "@/types/mysqltypes";
import { RowDataPacket } from "mysql2";

export async function getCategorias() {
  console.log("🔵 [DB] Obteniendo categorias");
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT 
      ID_CATEGORIA,
      NOMBRE_CATEGORIA,
      DESCRIPCION,
      ESTADO,
      FECHA_CREACION,
      FECHA_ACTUALIZACION
    FROM CATEGORIAS
    WHERE ESTADO='A'
    ORDER BY NOMBRE_CATEGORIA
  `);
  const categorias: CategoriaRow[] = Array.isArray(rows) ? (rows as CategoriaRow[]) : [];
  console.log(`✅ [DB] Categorias obtenidas: ${categorias.length}`);
  return categorias;
}

import type { ResultSetHeader } from "mysql2/promise";
import { CategoriaInsert, CategoriaSelect } from "@/types/mysqltypes";

export async function getCategoriasDetalle(): Promise<CategoriaSelect[]> {
  console.log("🔵 [DB] Obteniendo categorias completas");
  const [rows] = await pool.query<CategoriaSelect[]>(
    "SELECT ID_CATEGORIA, NOMBRE_CATEGORIA, DESCRIPCION, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM CATEGORIAS ORDER BY NOMBRE_CATEGORIA",
  );
  console.log(`✅ [DB] Categorias retornadas: ${rows.length}`);
  return rows;
}

export async function insertCategoria(data: CategoriaInsert): Promise<number> {
  console.log("🔵 [DB] Insertando categoria");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO CATEGORIAS (ID_CATEGORIA, NOMBRE_CATEGORIA, DESCRIPCION, ESTADO) VALUES (?, ?, ?, ?)",
    [data.ID_CATEGORIA, data.NOMBRE_CATEGORIA, data.DESCRIPCION ?? null, data.ESTADO ?? "A"],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateCategoria(id: string, data: Partial<CategoriaInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando categoria ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE CATEGORIAS SET NOMBRE_CATEGORIA = COALESCE(?, NOMBRE_CATEGORIA), DESCRIPCION = ?, ESTADO = COALESCE(?, ESTADO) WHERE ID_CATEGORIA = ?",
    [data.NOMBRE_CATEGORIA ?? null, data.DESCRIPCION ?? null, data.ESTADO ?? null, id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteCategoria(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando categoria ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM CATEGORIAS WHERE ID_CATEGORIA = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
