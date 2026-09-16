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
}): Promise<number> {
  try {
    console.log("🔵 [inventario.ajustarInventarioSuc] Actualizando stock...", {
      productId,
      nuevoStock,
      sucursalId,
    });
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE PRODUCTOS_SUCURSAL 
       SET CANTIDAD = ? 
       WHERE ID_PRODUCTO = ? AND ID_SUCURSAL = ?`,
      [nuevoStock, productId, sucursalId],
    );
    console.log("✅ [inventario.ajustarInventarioSuc] Stock actualizado", {
      productId,
      sucursalId,
      insertId: result.insertId,
    });
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ [inventario.ajustarInventarioSuc] Error al actualizar stock: ", {
      productId,
      nuevoStock,
      sucursalId,
      message,
    });
    throw new Error(`[inventario.ajustarInventarioSuc] ${message}`);
  }
}
