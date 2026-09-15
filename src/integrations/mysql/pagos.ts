import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { PagoInsert, PagoSelect, PagosMetodo } from "@/types/mysqltypes";

export async function getPagosMetodo(desde: string, hasta: string): Promise<PagosMetodo[]> {
  console.log(
    `🔵 [pagos.getPagosMetodo] Obteniendo pagos con metodo de pago: desde=${desde}, hasta=${hasta}`,
  );
  try {
    const [rows] = await pool.query<PagosMetodo[]>(
      "SELECT F.NOMBRE_FORMA_PAGO AS method, P.MONTO AS amount, P.FECHA_HORA AS created_at FROM PAGO P JOIN FORMA_PAGO F ON P.ID_FORMA_PAGO = F.ID_FORMA_PAGO WHERE P.FECHA_HORA >= ? AND P.FECHA_HORA <= ?",
      [desde, hasta],
    );
    const pagos = rows.map((row) => ({
      ...row,
      created_at: new Date(row.created_at).toISOString(),
    }));
    console.log(
      `✅ [pagos.getPagosMetodo] Éxito obteniendo pagos con metodo de pago: ${pagos.length} registros`,
    );
    return pagos;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [pagos.getPagosMetodo] Error obteniendo pagos con metodo de pago: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function getPagos(): Promise<PagoSelect[]> {
  console.log("🔵 [pagos.getPagos] Obteniendo pagos...");
  try {
    const [rows] = await pool.query<PagoSelect[]>(
      "SELECT ID_PAGO, ID_FORMA_PAGO, MONEDA, MONTO, FECHA_HORA, REFERENCIA, ESTADO, FECHA_CREACION, FECHA_MODIFICACION FROM PAGO ORDER BY FECHA_HORA DESC",
    );
    console.log(`✅ [pagos.getPagos] Éxito obteniendo pagos: ${rows.length} registros`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [pagos.getPagos] Error obteniendo pagos: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertPago(data: PagoInsert): Promise<number> {
  console.log(
    `🔵 [pagos.insertPago] Insertando pago con: formaPago=${data.ID_FORMA_PAGO}, monto=${data.MONTO}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO PAGO (ID_FORMA_PAGO, MONEDA, MONTO, FECHA_HORA, REFERENCIA, ESTADO) VALUES (?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?, ?)",
      [
        data.ID_FORMA_PAGO,
        data.MONEDA ?? "USD",
        data.MONTO,
        data.FECHA_HORA ?? null,
        data.REFERENCIA ?? null,
        data.ESTADO ?? "C",
      ],
    );
    console.log(
      `✅ [pagos.insertPago] Éxito insertando pago: insertId=${result.insertId}, afectados=${result.affectedRows}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [pagos.insertPago] Error insertando pago: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updatePago(idPago: number, data: Partial<PagoInsert>): Promise<number> {
  console.log(`🔵 [pagos.updatePago] Actualizando pago con: id=${idPago}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE PAGO SET ID_FORMA_PAGO = COALESCE(?, ID_FORMA_PAGO), MONEDA = COALESCE(?, MONEDA), MONTO = COALESCE(?, MONTO), FECHA_HORA = COALESCE(?, FECHA_HORA), REFERENCIA = ?, ESTADO = COALESCE(?, ESTADO) WHERE ID_PAGO = ?",
      [
        data.ID_FORMA_PAGO ?? null,
        data.MONEDA ?? null,
        data.MONTO ?? null,
        data.FECHA_HORA ?? null,
        data.REFERENCIA ?? null,
        data.ESTADO ?? null,
        idPago,
      ],
    );
    console.log(`✅ [pagos.updatePago] Éxito actualizando pago: afectados=${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [pagos.updatePago] Error actualizando pago: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deletePago(idPago: number): Promise<number> {
  console.log(`🔵 [pagos.deletePago] Eliminando pago con: id=${idPago}`);
  try {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM PAGO WHERE ID_PAGO = ?", [
      idPago,
    ]);
    console.log(`✅ [pagos.deletePago] Éxito eliminando pago: afectados=${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [pagos.deletePago] Error eliminando pago: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
