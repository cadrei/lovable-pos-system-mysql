import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { DetalleVentaInsert, DetalleVentaSelect } from "@/types/mysqltypes";

export async function getDetallesVenta(idVenta?: number): Promise<DetalleVentaSelect[]> {
  console.log("🔵 [DB] Obteniendo detalles de venta");
  const [rows] = await pool.query<DetalleVentaSelect[]>(
    idVenta === undefined
      ? "SELECT ID_DETALLE, ID_VENTA, ID_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, DESCUENTO, SUBTOTAL, FECHA_CREACION FROM DETALLE_VENTA"
      : "SELECT ID_DETALLE, ID_VENTA, ID_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, DESCUENTO, SUBTOTAL, FECHA_CREACION FROM DETALLE_VENTA WHERE ID_VENTA = ?",
    idVenta === undefined ? [] : [idVenta],
  );
  console.log(`✅ [DB] Detalles de venta retornados: ${rows.length}`);
  return rows;
}

export async function insertDetalleVenta(data: DetalleVentaInsert): Promise<number> {
  console.log("🔵 [DB] Insertando detalle de venta");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO DETALLE_VENTA (ID_VENTA, ID_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, DESCUENTO) VALUES (?, ?, COALESCE(?, 0), ?, COALESCE(?, 0))",
    [
      data.ID_VENTA,
      data.ID_PRODUCTO,
      data.PRECIO_UNITARIO ?? null,
      data.CANTIDAD,
      data.DESCUENTO ?? null,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function updateDetalleVenta(
  idDetalle: number,
  data: Partial<DetalleVentaInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando detalle de venta ${idDetalle}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE DETALLE_VENTA SET ID_VENTA = COALESCE(?, ID_VENTA), ID_PRODUCTO = COALESCE(?, ID_PRODUCTO), PRECIO_UNITARIO = COALESCE(?, PRECIO_UNITARIO), CANTIDAD = COALESCE(?, CANTIDAD), DESCUENTO = COALESCE(?, DESCUENTO) WHERE ID_DETALLE = ?",
    [
      data.ID_VENTA ?? null,
      data.ID_PRODUCTO ?? null,
      data.PRECIO_UNITARIO ?? null,
      data.CANTIDAD ?? null,
      data.DESCUENTO ?? null,
      idDetalle,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteDetalleVenta(idDetalle: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando detalle de venta ${idDetalle}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM DETALLE_VENTA WHERE ID_DETALLE = ?",
    [idDetalle],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
