import type { RowDataPacket } from "mysql2";
import type { ResultSetHeader } from "mysql2/promise";
import { CategoriaInsert, CategoriaRow, CategoriaSelect } from "@/types/mysqltypes";
import pool from "../../../database/mysqlpool";

export async function getCategorias(): Promise<CategoriaRow[]> {
  console.log("🔵 [categorias.getCategorias] Obteniendo categorias...");
  try {
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
    console.log(
      `✅ [categorias.getCategorias] Categorias obtenidas: ${categorias.length} registros`,
    );
    return categorias;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [categorias.getCategorias] Error al obtener categorias: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function getCategoriasDetalle(): Promise<CategoriaSelect[]> {
  console.log("🔵 [categorias.getCategoriasDetalle] Obteniendo detalle de categorias...");
  try {
    const [rows] = await pool.query<CategoriaSelect[]>(
      "SELECT ID_CATEGORIA, NOMBRE_CATEGORIA, DESCRIPCION, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM CATEGORIAS ORDER BY NOMBRE_CATEGORIA",
    );
    console.log(
      `✅ [categorias.getCategoriasDetalle] Detalle de categorias obtenidos: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [categorias.getCategoriasDetalle] Error al obtener detalle de categorias: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertCategoria(data: CategoriaInsert): Promise<number> {
  console.log(
    `🔵 [categorias.insertCategoria] Insertando categoria con id=${data.ID_CATEGORIA}, nombre=${data.NOMBRE_CATEGORIA}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO CATEGORIAS (ID_CATEGORIA, NOMBRE_CATEGORIA, DESCRIPCION, ESTADO) VALUES (?, ?, ?, ?)",
      [data.ID_CATEGORIA, data.NOMBRE_CATEGORIA, data.DESCRIPCION ?? null, data.ESTADO ?? "A"],
    );
    console.log(
      `✅ [categorias.insertCategoria] categoria insertada: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [categorias.insertCategoria] Error al insertar categoria: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateCategoria(id: string, data: Partial<CategoriaInsert>): Promise<number> {
  console.log(`🔵 [categorias.updateCategoria] actualizando categoria con id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE CATEGORIAS SET NOMBRE_CATEGORIA = COALESCE(?, NOMBRE_CATEGORIA), DESCRIPCION = ?, ESTADO = COALESCE(?, ESTADO) WHERE ID_CATEGORIA = ?",
      [data.NOMBRE_CATEGORIA ?? null, data.DESCRIPCION ?? null, data.ESTADO ?? null, id],
    );
    console.log(
      `✅ [categorias.updateCategoria] exito al actualizar categoria: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [categorias.updateCategoria] Error al actualizar categoria: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteCategoria(id: string): Promise<number> {
  console.log(`🔵 [categorias.deleteCategoria] Eliminando categoria con id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM CATEGORIAS WHERE ID_CATEGORIA = ?",
      [id],
    );
    console.log(
      `✅ [categorias.deleteCategoria] Categoria eliminada: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [categorias.deleteCategoria] Error eliminando categoria: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
