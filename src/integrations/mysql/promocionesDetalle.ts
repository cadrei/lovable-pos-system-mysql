import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { PromocionesDetalleInsert, PromocionesDetalleSelect } from "@/types/mysqltypes";

export async function getPromocionesDetalle(
  idPromoCombo?: string,
): Promise<PromocionesDetalleSelect[]> {
  console.log(
    `🔵 [promocionesDetalle.getPromocionesDetalle] Obteniendo promociones detalle con: idPromoCombo=${idPromoCombo ?? "todos"}`,
  );
  try {
    const [rows] = await pool.query<PromocionesDetalleSelect[]>(
      idPromoCombo
        ? "SELECT ID_DETALLE, ID_PROMO_COMBO, ID_PRODUCTO, TIPO_DESCUENTO, VALOR_DESCUENTO FROM PROMOCIONES_DETALLE WHERE ID_PROMO_COMBO = ?"
        : "SELECT ID_DETALLE, ID_PROMO_COMBO, ID_PRODUCTO, TIPO_DESCUENTO, VALOR_DESCUENTO FROM PROMOCIONES_DETALLE",
      idPromoCombo ? [idPromoCombo] : [],
    );
    console.log(
      `✅ [promocionesDetalle.getPromocionesDetalle] Promociones detalle obtenidos: ${rows.length}`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [promocionesDetalle.getPromocionesDetalle] Error obteniendo promociones detalle: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertPromocionDetalle(data: PromocionesDetalleInsert): Promise<number> {
  console.log(
    `🔵 [promocionesDetalle.insertPromocionDetalle] Insertando promociones detalle con: producto=${data.ID_PRODUCTO}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO PROMOCIONES_DETALLE (ID_PROMO_COMBO, ID_PRODUCTO, TIPO_DESCUENTO, VALOR_DESCUENTO) VALUES (?, ?, ?, ?)",
      [
        data.ID_PROMO_COMBO,
        data.ID_PRODUCTO,
        data.TIPO_DESCUENTO ?? null,
        data.VALOR_DESCUENTO ?? null,
      ],
    );
    console.log(
      `✅ [promocionesDetalle.insertPromocionDetalle] Exito insertando promociones detalle: ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [promocionesDetalle.insertPromocionDetalle] Error insertando promociones detalle: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updatePromocionDetalle(
  idDetalle: number,
  data: Partial<PromocionesDetalleInsert>,
): Promise<number> {
  console.log(
    `🔵 [promocionesDetalle.updatePromocionDetalle] Actualizando promociones detalle con: idDetalle=${idDetalle}`,
  );
  try {
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
    console.log(
      `✅ [promocionesDetalle.updatePromocionDetalle] Exito actualizando promociones detalle: ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [promocionesDetalle.updatePromocionDetalle] Error actualizando promociones detalle: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deletePromocionDetalle(idDetalle: number): Promise<number> {
  console.log(
    `🔵 [promocionesDetalle.deletePromocionDetalle] Eliminando promociones detalle con: idDetalle=${idDetalle}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM PROMOCIONES_DETALLE WHERE ID_DETALLE = ?",
      [idDetalle],
    );
    console.log(
      `✅ [promocionesDetalle.deletePromocionDetalle] Exito eliminando promociones detalle: ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [promocionesDetalle.deletePromocionDetalle] Error eliminando promociones detalle: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
