import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";

export async function ajustarInventarioSuc({
  productId,
  nuevoStock,
  sucursalId,
}: {
  productId: string;
  nuevoStock: number;
  sucursalId: string;
}) {
  console.log(`🔵 [DB] Actualizando la cantidad de producto para la sucursal: ${sucursalId}`);
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE PRODUCTOS_SUCURSAL 
     SET CANTIDAD = ? 
     WHERE ID_PRODUCTO = ? AND ID_SUCURSAL = ?`,
    [nuevoStock, productId, sucursalId],
  );
  console.log(`✅ [DB] Cantidad de stock actualizada: ${result.insertId}`);
  return result.insertId;
}
