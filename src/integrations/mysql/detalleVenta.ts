import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { DetalleVentaInsert, DetalleVentaSelect } from "@/types/mysqltypes";

export async function getDetallesVenta(idVenta?: number): Promise<DetalleVentaSelect[]> {
  console.log(
    `🔵 [detalleVenta.getDetallesVenta] Obteniendo detalles de venta para : idVenta=${idVenta ?? "todos"}`,
  );
  try {
    const [rows] = await pool.query<DetalleVentaSelect[]>(
      idVenta === undefined
        ? "SELECT ID_DETALLE, ID_VENTA, ID_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, DESCUENTO, SUBTOTAL, FECHA_CREACION FROM DETALLE_VENTA"
        : "SELECT ID_DETALLE, ID_VENTA, ID_PRODUCTO, PRECIO_UNITARIO, CANTIDAD, DESCUENTO, SUBTOTAL, FECHA_CREACION FROM DETALLE_VENTA WHERE ID_VENTA = ?",
      idVenta === undefined ? [] : [idVenta],
    );
    console.log(
      `✅ [detalleVenta.getDetallesVenta] Éxito al obtener detalles de venta: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [detalleVenta.getDetallesVenta] Error al obtener detalles de venta: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertDetalleVenta(data: DetalleVentaInsert): Promise<number> {
  console.log(
    `🔵 [detalleVenta.insertDetalleVenta] Insertando detalles de venta con: venta=${data.ID_VENTA}, producto=${data.ID_PRODUCTO}`,
  );
  try {
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
    console.log(
      `✅ [detalleVenta.insertDetalleVenta] Éxito al insertar detalle de venta: insertId=${result.insertId}, afectados=${result.affectedRows}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [detalleVenta.insertDetalleVenta] Error al insertar detalle de venta ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateDetalleVenta(
  idDetalle: number,
  data: Partial<DetalleVentaInsert>,
): Promise<number> {
  console.log(
    `🔵 [detalleVenta.updateDetalleVenta] Actualizando detalles de venta con : id=${idDetalle}`,
  );
  try {
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
    console.log(
      `✅ [detalleVenta.updateDetalleVenta] Éxito al actualizar detalle de venta: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [detalleVenta.updateDetalleVenta] Error al actualizar detalle de venta ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteDetalleVenta(idDetalle: number): Promise<number> {
  console.log(
    `🔵 [detalleVenta.deleteDetalleVenta] Eliminando detalles de venta con: id=${idDetalle}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM DETALLE_VENTA WHERE ID_DETALLE = ?",
      [idDetalle],
    );
    console.log(
      `✅ [detalleVenta.deleteDetalleVenta] Éxito eliminando detalles de venta: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [detalleVenta.deleteDetalleVenta] Error eliminando detalles de venta: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
