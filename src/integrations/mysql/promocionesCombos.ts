import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { PromocionesCombosInsert, PromocionesCombosSelect } from "@/types/mysqltypes";

export async function getPromocionesCombos(): Promise<PromocionesCombosSelect[]> {
  console.log("🔵 [promocionesCombos.getPromocionesCombos] Obteniendo promociones combos...");
  try {
    const [rows] = await pool.query<PromocionesCombosSelect[]>(
      "SELECT ID_PROMO_COMBO, TIPO, DESCRIPCION, CRITERIO, FECHA_INICIO, FECHA_FIN, ESTADO, USOS_MAXIMOS, CANAL, FECHA_CREACION, FECHA_ACTUALIZACION FROM PROMOCIONES_COMBOS WHERE ESTADO='A' ORDER BY FECHA_INICIO DESC",
    );
    console.log(
      `✅ [promocionesCombos.getPromocionesCombos] promociones combos obtenidos: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [promocionesCombos.getPromocionesCombos] Error obteniendo promociones combos: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function getPromocionCombo(id: string): Promise<PromocionesCombosSelect | null> {
  console.log(
    `🔵 [promocionesCombos.getPromocionCombo] Obteniendo promociones combos con: id=${id}`,
  );
  try {
    const [rows] = await pool.query<PromocionesCombosSelect[]>(
      "SELECT ID_PROMO_COMBO, TIPO, DESCRIPCION, CRITERIO, FECHA_INICIO, FECHA_FIN, ESTADO, USOS_MAXIMOS, CANAL, FECHA_CREACION, FECHA_ACTUALIZACION FROM PROMOCIONES_COMBOS WHERE ID_PROMO_COMBO = ?",
      [id],
    );
    console.log(
      `✅ [promocionesCombos.getPromocionCombo] Éxito obteniendo promocion combo: ${rows.length} registros, resultado=${rows[0] ? "encontrado" : "nulo"}`,
    );
    return rows[0] ?? null;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [promocionesCombos.getPromocionCombo] Error obteniendo promocion combo: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertPromocionCombo(data: PromocionesCombosInsert): Promise<number> {
  console.log(
    `🔵 [promocionesCombos.insertPromocionCombo] Insertando promocion combo con: id=${data.ID_PROMO_COMBO}, tipo=${data.TIPO}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO PROMOCIONES_COMBOS (ID_PROMO_COMBO, TIPO, DESCRIPCION, CRITERIO, FECHA_INICIO, FECHA_FIN, ESTADO, USOS_MAXIMOS, CANAL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data.ID_PROMO_COMBO,
        data.TIPO,
        data.DESCRIPCION,
        data.CRITERIO ?? null,
        data.FECHA_INICIO,
        data.FECHA_FIN,
        data.ESTADO ?? "A",
        data.USOS_MAXIMOS ?? null,
        data.CANAL ?? null,
      ],
    );
    console.log(
      `✅ [promocionesCombos.insertPromocionCombo] Éxito insertando promocion combo: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [promocionesCombos.insertPromocionCombo] Error insertando promocion combo: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updatePromocionCombo(
  id: string,
  data: Partial<PromocionesCombosInsert>,
): Promise<number> {
  console.log(
    `🔵 [promocionesCombos.updatePromocionCombo] Actualizando promocion combo con: id=${id}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE PROMOCIONES_COMBOS SET TIPO = COALESCE(?, TIPO), DESCRIPCION = COALESCE(?, DESCRIPCION), CRITERIO = ?, FECHA_INICIO = COALESCE(?, FECHA_INICIO), FECHA_FIN = COALESCE(?, FECHA_FIN), ESTADO = COALESCE(?, ESTADO), USOS_MAXIMOS = ?, CANAL = ? WHERE ID_PROMO_COMBO = ?",
      [
        data.TIPO ?? null,
        data.DESCRIPCION ?? null,
        data.CRITERIO ?? null,
        data.FECHA_INICIO ?? null,
        data.FECHA_FIN ?? null,
        data.ESTADO ?? null,
        data.USOS_MAXIMOS ?? null,
        data.CANAL ?? null,
        id,
      ],
    );
    console.log(
      `✅ [promocionesCombos.updatePromocionCombo] Éxito actualizando promocion combo: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [promocionesCombos.updatePromocionCombo] Error actualizando promocion combo: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deletePromocionCombo(id: string): Promise<number> {
  console.log(`🔵 [promocionesCombos.deletePromocionCombo] Eliminando promocion combo: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM PROMOCIONES_COMBOS WHERE ID_PROMO_COMBO = ?",
      [id],
    );
    console.log(
      `✅ [promocionesCombos.deletePromocionCombo] Éxito eliminando promocion combo: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [promocionesCombos.deletePromocionCombo] Error eliminando promocion combo: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
