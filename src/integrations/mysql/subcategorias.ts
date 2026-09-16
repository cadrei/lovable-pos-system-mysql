import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import type { SubcategoriaInsert, SubcategoriaRow, SubcategoriaSelect } from "@/types/mysqltypes";

export async function getSubcategorias(): Promise<SubcategoriaRow[]> {
  console.log("🔵 [subcategorias.getSubcategorias] Obteniendo subcategorias...");
  try {
    const [rows] = await pool.query(`
    SELECT 
      SC.ID_SUBCATEGORIA,
      SC.NOMBRE AS nombreSubcategoria,
      SC.DESCRIPCION,
      SC.ID_CATEGORIA,
      CC.NOMBRE_CATEGORIA
    FROM SUBCATEGORIAS SC
    JOIN CATEGORIAS CC ON SC.ID_CATEGORIA = CC.ID_CATEGORIA
    WHERE SC.ESTADO = 'A' AND CC.ESTADO = 'A'
    ORDER BY CC.NOMBRE_CATEGORIA, SC.NOMBRE
  `);
    console.log(
      `✅ [subcategorias.getSubcategorias] subcategorias obtenidas: ${Array.isArray(rows) ? rows.length : 0}`,
    );
    return rows as SubcategoriaRow[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [subcategorias.getSubcategorias] Error obteniendo subcategorias: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function getSubcategoriasDetalle(): Promise<SubcategoriaSelect[]> {
  console.log("🔵 [subcategorias.getSubcategoriasDetalle] Obteniendo detalle subcategorias...");
  try {
    const [rows] = await pool.query<SubcategoriaSelect[]>(
      "SELECT ID_SUBCATEGORIA, ID_CATEGORIA, NOMBRE, DESCRIPCION, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM SUBCATEGORIAS ORDER BY NOMBRE",
    );
    console.log(
      `✅ [subcategorias.getSubcategoriasDetalle] Detalle subcategorias obtenido: ${rows.length}`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [subcategorias.getSubcategoriasDetalle] Error al obtener detalle subcategorias: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertSubcategoria(data: SubcategoriaInsert): Promise<number> {
  console.log(
    `🔵 [subcategorias.insertSubcategoria] Insertando subcategoria con: id=${data.ID_SUBCATEGORIA}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO SUBCATEGORIAS (ID_SUBCATEGORIA, ID_CATEGORIA, NOMBRE, DESCRIPCION, ESTADO) VALUES (?, ?, ?, ?, ?)",
      [
        data.ID_SUBCATEGORIA,
        data.ID_CATEGORIA,
        data.NOMBRE,
        data.DESCRIPCION ?? null,
        data.ESTADO ?? "A",
      ],
    );
    console.log(
      `✅ [subcategorias.insertSubcategoria] Exito insertando subcategoria afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [subcategorias.insertSubcategoria] Error insertando subcategoria: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateSubcategoria(
  id: string,
  data: Partial<SubcategoriaInsert>,
): Promise<number> {
  console.log(`🔵 [subcategorias.updateSubcategoria] Actualizando subcategoria con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE SUBCATEGORIAS SET ID_CATEGORIA = COALESCE(?, ID_CATEGORIA), NOMBRE = COALESCE(?, NOMBRE), DESCRIPCION = ?, ESTADO = COALESCE(?, ESTADO) WHERE ID_SUBCATEGORIA = ?",
      [
        data.ID_CATEGORIA ?? null,
        data.NOMBRE ?? null,
        data.DESCRIPCION ?? null,
        data.ESTADO ?? null,
        id,
      ],
    );
    console.log(
      `✅ [subcategorias.updateSubcategoria] Exito actualizando subcategoria afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [subcategorias.updateSubcategoria] Error actualizando subcategoria: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteSubcategoria(id: string): Promise<number> {
  console.log(`🔵 [subcategorias.deleteSubcategoria] Eliminando subcategoria con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM SUBCATEGORIAS WHERE ID_SUBCATEGORIA = ?",
      [id],
    );
    console.log(
      `✅ [subcategorias.deleteSubcategoria] Exito eliminando subcategoria afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [subcategorias.deleteSubcategoria] Error eliminando subcategoria: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
