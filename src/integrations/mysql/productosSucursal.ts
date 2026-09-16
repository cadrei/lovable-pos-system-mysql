import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { ProductoSucursalInsert, ProductoSucursalSelect } from "@/types/mysqltypes";

export async function getProductosSucursal(sucursalId?: string): Promise<ProductoSucursalSelect[]> {
  console.log(
    `🔵 [productosSucursal.getProductosSucursal] Obteniendo todos los productos sucursal: sucursalId=${sucursalId ?? "todas"}`,
  );
  try {
    const [rows] = await pool.query<(ProductoSucursalSelect & RowDataPacket)[]>(
      sucursalId
        ? "SELECT ID_PRODUCTO, ID_SUCURSAL, CANTIDAD, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM PRODUCTOS_SUCURSAL WHERE ID_SUCURSAL = ?"
        : "SELECT ID_PRODUCTO, ID_SUCURSAL, CANTIDAD, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM PRODUCTOS_SUCURSAL",
      sucursalId ? [sucursalId] : [],
    );
    console.log(
      `✅ [productosSucursal.getProductosSucursal] Éxito obteniendo todos los productos sucursal: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [productosSucursal.getProductosSucursal] Error obteniendo todos los productos sucursal: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function getProductoSucursal(
  productoId: string,
  sucursalId: string,
): Promise<ProductoSucursalSelect | null> {
  console.log(
    `🔵 [productosSucursal.getProductoSucursal] Obteniendo producto sucursal: productoId=${productoId}, sucursalId=${sucursalId}`,
  );
  try {
    const [rows] = await pool.query<(ProductoSucursalSelect & RowDataPacket)[]>(
      "SELECT ID_PRODUCTO, ID_SUCURSAL, CANTIDAD, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM PRODUCTOS_SUCURSAL WHERE ID_PRODUCTO = ? AND ID_SUCURSAL = ?",
      [productoId, sucursalId],
    );
    console.log(
      `✅ [productosSucursal.getProductoSucursal] Éxito obteniendo producto sucursal: ${rows.length} registros, resultado=${rows[0] ? "encontrado" : "nulo"}`,
    );
    return rows[0] ?? null;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [productosSucursal.getProductoSucursal] Error obteniendo producto sucursal: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertProductoSucursal(data: ProductoSucursalInsert): Promise<number> {
  console.log(
    `🔵 [productosSucursal.insertProductoSucursal] Insertando en producto sucursal con: productoId=${data.ID_PRODUCTO}, sucursalId=${data.ID_SUCURSAL}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO PRODUCTOS_SUCURSAL (ID_PRODUCTO, ID_SUCURSAL, CANTIDAD, ESTADO) VALUES (?, ?, ?, ?)",
      [data.ID_PRODUCTO, data.ID_SUCURSAL, data.CANTIDAD ?? 0, data.ESTADO ?? "A"],
    );
    console.log(
      `✅ [productosSucursal.insertProductoSucursal] Éxito insertando producto sucursal: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [productosSucursal.insertProductoSucursal] Error insertando producto sucursal: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateProductoSucursal(
  productoId: string,
  sucursalId: string,
  data: Partial<ProductoSucursalInsert>,
): Promise<number> {
  console.log(
    `🔵 [productosSucursal.updateProductoSucursal] Actualizando producto sucursal con: productoId=${productoId}, sucursalId=${sucursalId}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE PRODUCTOS_SUCURSAL SET CANTIDAD = COALESCE(?, CANTIDAD), ESTADO = COALESCE(?, ESTADO) WHERE ID_PRODUCTO = ? AND ID_SUCURSAL = ?",
      [data.CANTIDAD ?? null, data.ESTADO ?? null, productoId, sucursalId],
    );
    console.log(
      `✅ [productosSucursal.updateProductoSucursal] Éxito actualizando producto sucursal: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [productosSucursal.updateProductoSucursal] Error actualizando producto sucursal: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteProductoSucursal(
  productoId: string,
  sucursalId: string,
): Promise<number> {
  console.log(
    `🔵 [productosSucursal.deleteProductoSucursal] Eliminando producto sucursal: productoId=${productoId}, sucursalId=${sucursalId}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM PRODUCTOS_SUCURSAL WHERE ID_PRODUCTO = ? AND ID_SUCURSAL = ?",
      [productoId, sucursalId],
    );
    console.log(
      `✅ [productosSucursal.deleteProductoSucursal] Éxito eliminando producto sucursal: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [productosSucursal.deleteProductoSucursal] Error eliminando producto sucursal: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
