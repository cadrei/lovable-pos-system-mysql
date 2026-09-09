import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { ProductoBeneficioInsert, ProductoBeneficioSelect } from "@/types/mysqltypes";

export async function getProductosBeneficios(
  productoId?: string,
): Promise<ProductoBeneficioSelect[]> {
  console.log("🔵 [DB] Obteniendo relaciones producto-beneficio");
  const [rows] = await pool.query<(ProductoBeneficioSelect & RowDataPacket)[]>(
    productoId
      ? "SELECT ID_PRODUCTO, ID_SINT_BENEF, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM PRODUCTOS_BENEFICIOS WHERE ID_PRODUCTO = ?"
      : "SELECT ID_PRODUCTO, ID_SINT_BENEF, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM PRODUCTOS_BENEFICIOS",
    productoId ? [productoId] : [],
  );
  console.log(`✅ [DB] Relaciones producto-beneficio retornadas: ${rows.length}`);
  return rows;
}

export async function insertProductoBeneficio(data: ProductoBeneficioInsert): Promise<number> {
  console.log("🔵 [DB] Insertando relación producto-beneficio");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO PRODUCTOS_BENEFICIOS (ID_PRODUCTO, ID_SINT_BENEF, ESTADO) VALUES (?, ?, ?)",
    [data.ID_PRODUCTO, data.ID_SINT_BENEF, data.ESTADO ?? "A"],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateProductoBeneficio(
  productoId: string,
  beneficioId: string,
  estado: string,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando relación producto-beneficio ${productoId}/${beneficioId}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE PRODUCTOS_BENEFICIOS SET ESTADO = ? WHERE ID_PRODUCTO = ? AND ID_SINT_BENEF = ?",
    [estado, productoId, beneficioId],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteProductoBeneficio(
  productoId: string,
  beneficioId: string,
): Promise<number> {
  console.log(`🔵 [DB] Eliminando relación producto-beneficio ${productoId}/${beneficioId}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM PRODUCTOS_BENEFICIOS WHERE ID_PRODUCTO = ? AND ID_SINT_BENEF = ?",
    [productoId, beneficioId],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
