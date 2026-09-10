import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { PromocionesDetalleInsert, PromocionesDetalleSelect } from "@/types/mysqltypes";

export async function getPromocionesDetalle(
  idPromoCombo?: string,
): Promise<PromocionesDetalleSelect[]> {
  console.log("🔵 [DB] Obteniendo detalles de promociones");
  const [rows] = await pool.query<PromocionesDetalleSelect[]>(
    idPromoCombo
      ? "SELECT ID_DETALLE, ID_PROMO_COMBO, ID_PRODUCTO, TIPO_DESCUENTO, VALOR_DESCUENTO FROM PROMOCIONES_DETALLE WHERE ID_PROMO_COMBO = ?"
      : "SELECT ID_DETALLE, ID_PROMO_COMBO, ID_PRODUCTO, TIPO_DESCUENTO, VALOR_DESCUENTO FROM PROMOCIONES_DETALLE",
    idPromoCombo ? [idPromoCombo] : [],
  );
  console.log(`✅ [DB] Detalles de promociones retornados: ${rows.length}`);
  return rows;
}

export async function insertPromocionDetalle(data: PromocionesDetalleInsert): Promise<number> {
  console.log("🔵 [DB] Insertando detalle de promoción");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO PROMOCIONES_DETALLE (ID_PROMO_COMBO, ID_PRODUCTO, TIPO_DESCUENTO, VALOR_DESCUENTO) VALUES (?, ?, ?, ?)",
    [
      data.ID_PROMO_COMBO,
      data.ID_PRODUCTO,
      data.TIPO_DESCUENTO ?? null,
      data.VALOR_DESCUENTO ?? null,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updatePromocionDetalle(
  idDetalle: number,
  data: Partial<PromocionesDetalleInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando detalle de promoción ${idDetalle}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE PROMOCIONES_DETALLE SET ID_PROMO_COMBO = COALESCE(?, ID_PROMO_COMBO), ID_PRODUCTO = COALESCE(?, ID_PRODUCTO), TIPO_DESCUENTO = ?, VALOR_DESCUENTO = ? WHERE ID_DETALLE = ?",
    [
      data.ID_PROMO_COMBO ?? null,
      data.ID_PRODUCTO ?? null,
      data.TIPO_DESCUENTO ?? null,
      data.VALOR_DESCUENTO ?? null,
      idDetalle,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deletePromocionDetalle(idDetalle: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando detalle de promoción ${idDetalle}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM PROMOCIONES_DETALLE WHERE ID_DETALLE = ?",
    [idDetalle],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
