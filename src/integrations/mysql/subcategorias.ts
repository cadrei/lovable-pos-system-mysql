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
