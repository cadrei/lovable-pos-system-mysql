import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { ProductoSucursalInsert, ProductoSucursalSelect } from "@/types/mysqltypes";

export async function getProductosSucursal(sucursalId?: string): Promise<ProductoSucursalSelect[]> {
  console.log("🔵 [DB] Obteniendo productos por sucursal");
  const [rows] = await pool.query<(ProductoSucursalSelect & RowDataPacket)[]>(
    sucursalId
      ? "SELECT ID_PRODUCTO, ID_SUCURSAL, CANTIDAD, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM PRODUCTOS_SUCURSAL WHERE ID_SUCURSAL = ?"
      : "SELECT ID_PRODUCTO, ID_SUCURSAL, CANTIDAD, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM PRODUCTOS_SUCURSAL",
    sucursalId ? [sucursalId] : [],
  );
  console.log(`✅ [DB] Productos por sucursal retornados: ${rows.length}`);
  return rows;
}

export async function getProductoSucursal(
  productoId: string,
  sucursalId: string,
): Promise<ProductoSucursalSelect | null> {
  console.log(`🔵 [DB] Obteniendo producto ${productoId} en sucursal ${sucursalId}`);
  const [rows] = await pool.query<(ProductoSucursalSelect & RowDataPacket)[]>(
    "SELECT ID_PRODUCTO, ID_SUCURSAL, CANTIDAD, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM PRODUCTOS_SUCURSAL WHERE ID_PRODUCTO = ? AND ID_SUCURSAL = ?",
    [productoId, sucursalId],
  );
  console.log(`✅ [DB] Productos por sucursal retornados: ${rows.length}`);
  return rows[0] ?? null;
}

export async function insertProductoSucursal(data: ProductoSucursalInsert): Promise<number> {
  console.log("🔵 [DB] Insertando producto en sucursal");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO PRODUCTOS_SUCURSAL (ID_PRODUCTO, ID_SUCURSAL, CANTIDAD, ESTADO) VALUES (?, ?, ?, ?)",
    [data.ID_PRODUCTO, data.ID_SUCURSAL, data.CANTIDAD ?? 0, data.ESTADO ?? "A"],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateProductoSucursal(
  productoId: string,
  sucursalId: string,
  data: Partial<ProductoSucursalInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando producto ${productoId} en sucursal ${sucursalId}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE PRODUCTOS_SUCURSAL SET CANTIDAD = COALESCE(?, CANTIDAD), ESTADO = COALESCE(?, ESTADO) WHERE ID_PRODUCTO = ? AND ID_SUCURSAL = ?",
    [data.CANTIDAD ?? null, data.ESTADO ?? null, productoId, sucursalId],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteProductoSucursal(
  productoId: string,
  sucursalId: string,
): Promise<number> {
  console.log(`🔵 [DB] Eliminando producto ${productoId} de sucursal ${sucursalId}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM PRODUCTOS_SUCURSAL WHERE ID_PRODUCTO = ? AND ID_SUCURSAL = ?",
    [productoId, sucursalId],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
