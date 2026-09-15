import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { ImpuestoInsert, ImpuestoSelect } from "@/types/mysqltypes";

export async function getImpuestos(): Promise<ImpuestoSelect[]> {
  console.log("🔵 [impuestos.getImpuestos] Obteniendo impuestos...");
  try {
    const [rows] = await pool.query<ImpuestoSelect[]>(
      "SELECT ID_TIPO_IMPUESTO, NOMBRE_TIPO_IMPUESTO, DETALLE_IMPUESTO, VALOR_IMPUESTO FROM IMPUESTO ORDER BY NOMBRE_TIPO_IMPUESTO",
    );
    console.log(`✅ [impuestos.getImpuestos] Éxito obteniendo impuestos: ${rows.length} registros`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [impuestos.getImpuestos] Error obteniendo impuestos: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertImpuesto(data: ImpuestoInsert): Promise<number> {
  console.log(
    `🔵 [impuestos.insertImpuesto] Insertando impuesto con: id=${data.ID_TIPO_IMPUESTO}, nombre=${data.NOMBRE_TIPO_IMPUESTO}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO IMPUESTO (ID_TIPO_IMPUESTO, NOMBRE_TIPO_IMPUESTO, DETALLE_IMPUESTO, VALOR_IMPUESTO) VALUES (?, ?, ?, ?)",
      [
        data.ID_TIPO_IMPUESTO,
        data.NOMBRE_TIPO_IMPUESTO,
        data.DETALLE_IMPUESTO ?? null,
        data.VALOR_IMPUESTO,
      ],
    );
    console.log(
      `✅ [impuestos.insertImpuesto] Éxito insertando impuesto: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [impuestos.insertImpuesto] Error insertando impuesto: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateImpuesto(id: string, data: Partial<ImpuestoInsert>): Promise<number> {
  console.log(`🔵 [impuestos.updateImpuesto] Actualizando impuesto con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE IMPUESTO SET NOMBRE_TIPO_IMPUESTO = COALESCE(?, NOMBRE_TIPO_IMPUESTO), DETALLE_IMPUESTO = ?, VALOR_IMPUESTO = COALESCE(?, VALOR_IMPUESTO) WHERE ID_TIPO_IMPUESTO = ?",
      [
        data.NOMBRE_TIPO_IMPUESTO ?? null,
        data.DETALLE_IMPUESTO ?? null,
        data.VALOR_IMPUESTO ?? null,
        id,
      ],
    );
    console.log(
      `✅ [impuestos.updateImpuesto] Éxito actualizando impuesto: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [impuestos.updateImpuesto] Error actualizando impuesto: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteImpuesto(id: string): Promise<number> {
  console.log(`🔵 [impuestos.deleteImpuesto] Eliminando impuesto con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM IMPUESTO WHERE ID_TIPO_IMPUESTO = ?",
      [id],
    );
    console.log(
      `✅ [impuestos.deleteImpuesto] Éxito eliminando impuesto: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [impuestos.deleteImpuesto] Error eliminando impuesto: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
