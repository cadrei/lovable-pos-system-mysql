import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { TransferenciaInsert, TransferenciaSelect } from "@/types/mysqltypes";

export async function getTransferencias(): Promise<TransferenciaSelect[]> {
  console.log("🔵 [transferencias.getTransferencias] Obteniendo transferencias...");
  try {
    const [rows] = await pool.query<TransferenciaSelect[]>(
      "SELECT ID_TRANSFERENCIA, ID_PRODUCTO, SUC_ORIGEN, SUC_DESTINO, CANTIDAD, FECHA FROM TRANSFERENCIA ORDER BY FECHA DESC",
    );
    console.log(`✅ [transferencias.getTransferencias] transferencias obtenidas: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [transferencias.getTransferencias] Error obteniendo transferencias: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertTransferencia(data: TransferenciaInsert): Promise<number> {
  console.log(
    `🔵 [transferencias.insertTransferencia] Insertando transferencia con: producto=${data.ID_PRODUCTO}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO TRANSFERENCIA (ID_PRODUCTO, SUC_ORIGEN, SUC_DESTINO, CANTIDAD, FECHA) VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))",
      [data.ID_PRODUCTO, data.SUC_ORIGEN, data.SUC_DESTINO, data.CANTIDAD, data.FECHA ?? null],
    );
    console.log(
      `✅ [transferencias.insertTransferencia] Exito al insertar transferencia afectados= ${result.affectedRows}, resultado=${result.insertId}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [transferencias.insertTransferencia] Error insertando transferencia: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateTransferencia(
  id: number,
  data: Partial<TransferenciaInsert>,
): Promise<number> {
  console.log(`🔵 [transferencias.updateTransferencia] Actualizando transferencia con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE TRANSFERENCIA SET ID_PRODUCTO = COALESCE(?, ID_PRODUCTO), SUC_ORIGEN = COALESCE(?, SUC_ORIGEN), SUC_DESTINO = COALESCE(?, SUC_DESTINO), CANTIDAD = COALESCE(?, CANTIDAD), FECHA = COALESCE(?, FECHA) WHERE ID_TRANSFERENCIA = ?",
      [
        data.ID_PRODUCTO ?? null,
        data.SUC_ORIGEN ?? null,
        data.SUC_DESTINO ?? null,
        data.CANTIDAD ?? null,
        data.FECHA ?? null,
        id,
      ],
    );
    console.log(
      `✅ [transferencias.updateTransferencia] Exito actualizando transferencia afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [transferencias.updateTransferencia] Error actualizando transferencia: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteTransferencia(id: number): Promise<number> {
  console.log(`🔵 [transferencias.deleteTransferencia] Eliminando transferencia con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM TRANSFERENCIA WHERE ID_TRANSFERENCIA = ?",
      [id],
    );
    console.log(
      `✅ [transferencias.deleteTransferencia] Exito eliminando transferencia afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [transferencias.deleteTransferencia] Error eliminando transferencia: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
