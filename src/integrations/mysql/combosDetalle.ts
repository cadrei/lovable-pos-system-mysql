import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { CombosDetalleInsert, CombosDetalleSelect } from "@/types/mysqltypes";

export async function getCombosDetalle(idPromoCombo?: string): Promise<CombosDetalleSelect[]> {
  console.log(
    `🔵 [combosDetalle.getCombosDetalle] Obteniendo detalle de combos: idPromoCombo=${idPromoCombo ?? "todos"}`,
  );
  try {
    const [rows] = await pool.query<CombosDetalleSelect[]>(
      idPromoCombo
        ? "SELECT ID_DETALLE, ID_PROMO_COMBO, ID_PRODUCTO, CANTIDAD_PRODUCTO FROM COMBOS_DETALLE WHERE ID_PROMO_COMBO = ?"
        : "SELECT ID_DETALLE, ID_PROMO_COMBO, ID_PRODUCTO, CANTIDAD_PRODUCTO FROM COMBOS_DETALLE",
      idPromoCombo ? [idPromoCombo] : [],
    );
    console.log(
      `✅ [combosDetalle.getCombosDetalle] Éxito al obtener detalle de combos: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [combosDetalle.getCombosDetalle] Error al obtener detalle de combos ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertComboDetalle(data: CombosDetalleInsert): Promise<number> {
  console.log(
    `🔵 [combosDetalle.insertComboDetalle] Insertando detalle de combos con: combo=${data.ID_PROMO_COMBO}, producto=${data.ID_PRODUCTO}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO COMBOS_DETALLE (ID_PROMO_COMBO, ID_PRODUCTO, CANTIDAD_PRODUCTO) VALUES (?, ?, ?)",
      [data.ID_PROMO_COMBO, data.ID_PRODUCTO, data.CANTIDAD_PRODUCTO ?? 1],
    );
    console.log(
      `✅ [combosDetalle.insertComboDetalle] Éxito insertando detalle de combos: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [combosDetalle.insertComboDetalle] Error insertando detalle de combos ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateComboDetalle(
  idDetalle: number,
  data: Partial<CombosDetalleInsert>,
): Promise<number> {
  console.log(
    `🔵 [combosDetalle.updateComboDetalle] Actualizando detalle de combos con: id=${idDetalle}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE COMBOS_DETALLE SET ID_PROMO_COMBO = COALESCE(?, ID_PROMO_COMBO), ID_PRODUCTO = COALESCE(?, ID_PRODUCTO), CANTIDAD_PRODUCTO = COALESCE(?, CANTIDAD_PRODUCTO) WHERE ID_DETALLE = ?",
      [
        data.ID_PROMO_COMBO ?? null,
        data.ID_PRODUCTO ?? null,
        data.CANTIDAD_PRODUCTO ?? null,
        idDetalle,
      ],
    );
    console.log(
      `✅ [combosDetalle.updateComboDetalle] Éxito al actualizar detalle de combos: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [combosDetalle.updateComboDetalle] Error al actualizar detalle de combos: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteComboDetalle(idDetalle: number): Promise<number> {
  console.log(
    `🔵 [combosDetalle.deleteComboDetalle] Eliminando detalle de combos con: id=${idDetalle}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM COMBOS_DETALLE WHERE ID_DETALLE = ?",
      [idDetalle],
    );
    console.log(
      `✅ [combosDetalle.deleteComboDetalle] Éxito eliminando detalle de combos: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [combosDetalle.deleteComboDetalle] Error eliminando detalle de combos: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
