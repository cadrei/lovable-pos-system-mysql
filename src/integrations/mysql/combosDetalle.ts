import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { CombosDetalleInsert, CombosDetalleSelect } from "@/types/mysqltypes";

export async function getCombosDetalle(idPromoCombo?: string): Promise<CombosDetalleSelect[]> {
  console.log("🔵 [DB] Obteniendo detalles de combos");
  const [rows] = await pool.query<CombosDetalleSelect[]>(
    idPromoCombo
      ? "SELECT ID_DETALLE, ID_PROMO_COMBO, ID_PRODUCTO, CANTIDAD_PRODUCTO FROM COMBOS_DETALLE WHERE ID_PROMO_COMBO = ?"
      : "SELECT ID_DETALLE, ID_PROMO_COMBO, ID_PRODUCTO, CANTIDAD_PRODUCTO FROM COMBOS_DETALLE",
    idPromoCombo ? [idPromoCombo] : [],
  );
  console.log(`✅ [DB] Detalles de combos retornados: ${rows.length}`);
  return rows;
}

export async function insertComboDetalle(data: CombosDetalleInsert): Promise<number> {
  console.log("🔵 [DB] Insertando detalle de combo");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO COMBOS_DETALLE (ID_PROMO_COMBO, ID_PRODUCTO, CANTIDAD_PRODUCTO) VALUES (?, ?, ?)",
    [data.ID_PROMO_COMBO, data.ID_PRODUCTO, data.CANTIDAD_PRODUCTO ?? 1],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateComboDetalle(
  idDetalle: number,
  data: Partial<CombosDetalleInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando detalle de combo ${idDetalle}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE COMBOS_DETALLE SET ID_PROMO_COMBO = COALESCE(?, ID_PROMO_COMBO), ID_PRODUCTO = COALESCE(?, ID_PRODUCTO), CANTIDAD_PRODUCTO = COALESCE(?, CANTIDAD_PRODUCTO) WHERE ID_DETALLE = ?",
    [
      data.ID_PROMO_COMBO ?? null,
      data.ID_PRODUCTO ?? null,
      data.CANTIDAD_PRODUCTO ?? null,
      idDetalle,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteComboDetalle(idDetalle: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando detalle de combo ${idDetalle}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM COMBOS_DETALLE WHERE ID_DETALLE = ?",
    [idDetalle],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
