import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { VentaPromocionInsert, VentaPromocionSelect } from "@/types/mysqltypes";

export async function getVentasPromociones(idVenta?: number): Promise<VentaPromocionSelect[]> {
  console.log(
    `🔵 [ventaPromocion.getVentasPromociones] Obteniendo venta_promocion: idVenta=${idVenta ?? "todas"}`,
  );
  try {
    const [rows] = await pool.query<VentaPromocionSelect[]>(
      idVenta === undefined
        ? "SELECT ID_VENTA, ID_PROMO_COMBO, DESCUENTO FROM VENTA_PROMOCION"
        : "SELECT ID_VENTA, ID_PROMO_COMBO, DESCUENTO FROM VENTA_PROMOCION WHERE ID_VENTA = ?",
      idVenta === undefined ? [] : [idVenta],
    );
    console.log(
      `✅ [ventaPromocion.getVentasPromociones] venta_promocion obtenidas: ${rows.length}`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [ventaPromocion.getVentasPromociones] Error obteniendo venta_promocion: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertVentaPromocion(data: VentaPromocionInsert): Promise<number> {
  console.log(
    `🔵 [ventaPromocion.insertVentaPromocion] Insertando venta_promocion con: idVenta=${data.ID_VENTA}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO VENTA_PROMOCION (ID_VENTA, ID_PROMO_COMBO, DESCUENTO) VALUES (?, ?, ?)",
      [data.ID_VENTA, data.ID_PROMO_COMBO, data.DESCUENTO],
    );
    console.log(
      `✅ [ventaPromocion.insertVentaPromocion] Exito insertando venta_promocion afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [ventaPromocion.insertVentaPromocion] Error insertando venta_promocion: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateVentaPromocion(
  idVenta: number,
  idPromoCombo: string,
  descuento: number,
): Promise<number> {
  console.log(
    `🔵 [ventaPromocion.updateVentaPromocion] Actualizando venta_promocion con: idVenta=${idVenta}, idPromoCombo=${idPromoCombo}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE VENTA_PROMOCION SET DESCUENTO = ? WHERE ID_VENTA = ? AND ID_PROMO_COMBO = ?",
      [descuento, idVenta, idPromoCombo],
    );
    console.log(
      `✅ [ventaPromocion.updateVentaPromocion] Exito actualizando venta_promocion afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [ventaPromocion.updateVentaPromocion] Error actualizando venta_promocion: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteVentaPromocion(idVenta: number, idPromoCombo: string): Promise<number> {
  console.log(
    `🔵 [ventaPromocion.deleteVentaPromocion] Eliminando venta_promocion con: idVenta=${idVenta}, idPromoCombo=${idPromoCombo}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM VENTA_PROMOCION WHERE ID_VENTA = ? AND ID_PROMO_COMBO = ?",
      [idVenta, idPromoCombo],
    );
    console.log(
      `✅ [ventaPromocion.deleteVentaPromocion] Exito eliminando venta_promocion afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [ventaPromocion.deleteVentaPromocion] Error eliminando venta_promocion: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
