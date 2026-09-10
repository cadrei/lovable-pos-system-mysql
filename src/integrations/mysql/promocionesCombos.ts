import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { PromocionesCombosInsert, PromocionesCombosSelect } from "@/types/mysqltypes";

export async function getPromocionesCombos(): Promise<PromocionesCombosSelect[]> {
  console.log("🔵 [DB] Obteniendo promociones y combos activos");
  const [rows] = await pool.query<PromocionesCombosSelect[]>(
    "SELECT ID_PROMO_COMBO, TIPO, DESCRIPCION, CRITERIO, FECHA_INICIO, FECHA_FIN, ESTADO, USOS_MAXIMOS, CANAL, FECHA_CREACION, FECHA_ACTUALIZACION FROM PROMOCIONES_COMBOS WHERE ESTADO='A' ORDER BY FECHA_INICIO DESC",
  );
  console.log(`✅ [DB] Promociones y combos retornados: ${rows.length}`);
  return rows;
}

export async function getPromocionCombo(id: string): Promise<PromocionesCombosSelect | null> {
  console.log(`🔵 [DB] Obteniendo promoción o combo ${id}`);
  const [rows] = await pool.query<PromocionesCombosSelect[]>(
    "SELECT ID_PROMO_COMBO, TIPO, DESCRIPCION, CRITERIO, FECHA_INICIO, FECHA_FIN, ESTADO, USOS_MAXIMOS, CANAL, FECHA_CREACION, FECHA_ACTUALIZACION FROM PROMOCIONES_COMBOS WHERE ID_PROMO_COMBO = ?",
    [id],
  );
  console.log(`✅ [DB] Promociones y combos retornados: ${rows.length}`);
  return rows[0] ?? null;
}

export async function insertPromocionCombo(data: PromocionesCombosInsert): Promise<number> {
  console.log("🔵 [DB] Insertando promoción o combo");
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updatePromocionCombo(
  id: string,
  data: Partial<PromocionesCombosInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando promoción o combo ${id}`);
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deletePromocionCombo(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando promoción o combo ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM PROMOCIONES_COMBOS WHERE ID_PROMO_COMBO = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
