import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { NotaVentaInsert, NotaVentaSelect } from "@/types/mysqltypes";

export async function getNotasVenta(): Promise<NotaVentaSelect[]> {
  console.log("🔵 [notaVenta.getNotasVenta] Obteniendo notas de venta...");
  try {
    const [rows] = await pool.query<NotaVentaSelect[]>(
      "SELECT ID_NOTA_VENTA, ID_VENTA, NUMERO_NOTA_VENTA, NUM_AUTORIZACION, FECHA_EMISION, TOTAL FROM NOTA_VENTA ORDER BY FECHA_EMISION DESC",
    );
    console.log(
      `✅ [notaVenta.getNotasVenta] Éxito obteniendo notas de venta: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [notaVenta.getNotasVenta] Error obteniendo notas de venta: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertNotaVenta(data: NotaVentaInsert): Promise<number> {
  console.log(
    `🔵 [notaVenta.insertNotaVenta] Insertando nota de venta con: venta=${data.ID_VENTA}, numero=${data.NUMERO_NOTA_VENTA}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO NOTA_VENTA (ID_VENTA, NUMERO_NOTA_VENTA, NUM_AUTORIZACION, FECHA_EMISION, TOTAL) VALUES (?, ?, ?, ?, ?)",
      [
        data.ID_VENTA,
        data.NUMERO_NOTA_VENTA,
        data.NUM_AUTORIZACION,
        data.FECHA_EMISION,
        data.TOTAL,
      ],
    );
    console.log(
      `✅ [notaVenta.insertNotaVenta] Éxito insertando nota de venta: insertId=${result.insertId}, afectados=${result.affectedRows}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [notaVenta.insertNotaVenta] Error insertando nota de venta: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateNotaVenta(id: number, data: Partial<NotaVentaInsert>): Promise<number> {
  console.log(`🔵 [notaVenta.updateNotaVenta] Actualizando nota de venta con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE NOTA_VENTA SET ID_VENTA = COALESCE(?, ID_VENTA), NUMERO_NOTA_VENTA = COALESCE(?, NUMERO_NOTA_VENTA), NUM_AUTORIZACION = COALESCE(?, NUM_AUTORIZACION), FECHA_EMISION = COALESCE(?, FECHA_EMISION), TOTAL = COALESCE(?, TOTAL) WHERE ID_NOTA_VENTA = ?",
      [
        data.ID_VENTA ?? null,
        data.NUMERO_NOTA_VENTA ?? null,
        data.NUM_AUTORIZACION ?? null,
        data.FECHA_EMISION ?? null,
        data.TOTAL ?? null,
        id,
      ],
    );
    console.log(
      `✅ [notaVenta.updateNotaVenta] Éxito actualizando nota de venta: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [notaVenta.updateNotaVenta] Error actualizando nota de venta: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteNotaVenta(id: number): Promise<number> {
  console.log(`🔵 [notaVenta.deleteNotaVenta] Eliminando nota de venta con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM NOTA_VENTA WHERE ID_NOTA_VENTA = ?",
      [id],
    );
    console.log(
      `✅ [notaVenta.deleteNotaVenta] Éxito eliminando nota de venta: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [notaVenta.deleteNotaVenta] Error eliminando nota de venta: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
