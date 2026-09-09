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
