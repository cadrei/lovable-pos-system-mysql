import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { VentaPromocionInsert, VentaPromocionSelect } from "@/types/mysqltypes";

export async function getVentasPromociones(idVenta?: number): Promise<VentaPromocionSelect[]> {
  console.log("🔵 [DB] Obteniendo promociones aplicadas a ventas");
  const [rows] = await pool.query<VentaPromocionSelect[]>(
    idVenta === undefined
      ? "SELECT ID_VENTA, ID_PROMO_COMBO, DESCUENTO FROM VENTA_PROMOCION"
      : "SELECT ID_VENTA, ID_PROMO_COMBO, DESCUENTO FROM VENTA_PROMOCION WHERE ID_VENTA = ?",
    idVenta === undefined ? [] : [idVenta],
  );
  console.log(`✅ [DB] Promociones de venta retornadas: ${rows.length}`);
  return rows;
}

export async function insertVentaPromocion(data: VentaPromocionInsert): Promise<number> {
  console.log("🔵 [DB] Insertando promoción aplicada a venta");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO VENTA_PROMOCION (ID_VENTA, ID_PROMO_COMBO, DESCUENTO) VALUES (?, ?, ?)",
    [data.ID_VENTA, data.ID_PROMO_COMBO, data.DESCUENTO],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateVentaPromocion(
  idVenta: number,
  idPromoCombo: string,
  descuento: number,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando promoción de venta ${idVenta}/${idPromoCombo}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE VENTA_PROMOCION SET DESCUENTO = ? WHERE ID_VENTA = ? AND ID_PROMO_COMBO = ?",
    [descuento, idVenta, idPromoCombo],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteVentaPromocion(idVenta: number, idPromoCombo: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando promoción de venta ${idVenta}/${idPromoCombo}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM VENTA_PROMOCION WHERE ID_VENTA = ? AND ID_PROMO_COMBO = ?",
    [idVenta, idPromoCombo],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
