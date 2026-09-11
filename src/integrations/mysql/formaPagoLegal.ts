import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { FormaPagoLegalInsert, FormaPagoLegalSelect } from "@/types/mysqltypes";

export async function getFormasPagoLegales(): Promise<FormaPagoLegalSelect[]> {
  console.log("🔵 [formaPagoLegal.getFormasPagoLegales] Obteniendo formas de pago legal...");
  try {
    const [rows] = await pool.query<FormaPagoLegalSelect[]>(
      "SELECT ID_FPL, NOMBRE_FPL, DETALLE_FPL FROM FORMA_PAGO_LEGAL ORDER BY NOMBRE_FPL",
    );
    console.log(
      `✅ [formaPagoLegal.getFormasPagoLegales] Éxito obteniendo forma de pago legal: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [formaPagoLegal.getFormasPagoLegales] Error obteniendo forma de pago legal: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertFormaPagoLegal(data: FormaPagoLegalInsert): Promise<number> {
  console.log(
    `🔵 [formaPagoLegal.insertFormaPagoLegal] Insertando forma de pago legal: id=${data.ID_FPL}, nombre=${data.NOMBRE_FPL}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO FORMA_PAGO_LEGAL (ID_FPL, NOMBRE_FPL, DETALLE_FPL) VALUES (?, ?, ?)",
      [data.ID_FPL, data.NOMBRE_FPL, data.DETALLE_FPL ?? null],
    );
    console.log(
      `✅ [formaPagoLegal.insertFormaPagoLegal] Éxito insertando forma de pago legal: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [formaPagoLegal.insertFormaPagoLegal] Error insertando forma de pago legal: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateFormaPagoLegal(
  id: string,
  data: Partial<FormaPagoLegalInsert>,
): Promise<number> {
  console.log(
    `🔵 [formaPagoLegal.updateFormaPagoLegal] Actualizando forma de pago legal: id=${id}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE FORMA_PAGO_LEGAL SET NOMBRE_FPL = COALESCE(?, NOMBRE_FPL), DETALLE_FPL = ? WHERE ID_FPL = ?",
      [data.NOMBRE_FPL ?? null, data.DETALLE_FPL ?? null, id],
    );
    console.log(
      `✅ [formaPagoLegal.updateFormaPagoLegal] Éxito actualizando forma de pago legal: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [formaPagoLegal.updateFormaPagoLegal] Error actualizando forma de pago legal: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteFormaPagoLegal(id: string): Promise<number> {
  console.log(
    `🔵 [formaPagoLegal.deleteFormaPagoLegal] Eliminando forma de pago legal con: id=${id}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM FORMA_PAGO_LEGAL WHERE ID_FPL = ?",
      [id],
    );
    console.log(
      `✅ [formaPagoLegal.deleteFormaPagoLegal] Éxito eliminando forma de pago legal: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [formaPagoLegal.deleteFormaPagoLegal] Error eliminando forma de pago legal: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
