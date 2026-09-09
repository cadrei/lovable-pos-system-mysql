import pool from "../../../database/mysqlpool";
import { SubcategoriaRow } from "@/types/mysqltypes";

export async function getSubcategorias() {
  console.log("🔵 [DB] Obteniendo Subcategorias");
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
  console.log(`✅ [DB] Subcategorias encontradas: ${Array.isArray(rows) ? rows.length : 0}`);
  return rows as SubcategoriaRow[];
}

import type { ResultSetHeader } from "mysql2/promise";
import { SubcategoriaInsert, SubcategoriaSelect } from "@/types/mysqltypes";

export async function getSubcategoriasDetalle(): Promise<SubcategoriaSelect[]> {
  console.log("🔵 [DB] Obteniendo subcategorias completas");
  const [rows] = await pool.query<SubcategoriaSelect[]>(
    "SELECT ID_SUBCATEGORIA, ID_CATEGORIA, NOMBRE, DESCRIPCION, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM SUBCATEGORIAS ORDER BY NOMBRE",
  );
  console.log(`✅ [DB] Subcategorias retornadas: ${rows.length}`);
  return rows;
}

export async function insertSubcategoria(data: SubcategoriaInsert): Promise<number> {
  console.log("🔵 [DB] Insertando subcategoria");
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateSubcategoria(
  id: string,
  data: Partial<SubcategoriaInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando subcategoria ${id}`);
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteSubcategoria(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando subcategoria ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM SUBCATEGORIAS WHERE ID_SUBCATEGORIA = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
