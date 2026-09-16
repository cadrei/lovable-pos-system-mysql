import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { FormaPagoInsert, FormaPagoSelect } from "@/types/mysqltypes";

export async function getFormasPago(): Promise<FormaPagoSelect[]> {
  console.log("🔵 [formaPago.getFormasPago] Obteniendo formas de pago...");
  try {
    const [rows] = await pool.query<FormaPagoSelect[]>(
      "SELECT ID_FORMA_PAGO, NOMBRE_FORMA_PAGO, DETALLE_FORMA_PAGO, ID_FPL, ESTADO, FECHA_CREACION, FECHA_MODIFICACION FROM FORMA_PAGO WHERE ESTADO='A' ORDER BY NOMBRE_FORMA_PAGO",
    );
    console.log(
      `✅ [formaPago.getFormasPago] Éxito obteniendo formas de pago: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [formaPago.getFormasPago] Error obteniendo formas de pago: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertFormaPago(data: FormaPagoInsert): Promise<number> {
  console.log(
    `🔵 [formaPago.insertFormaPago] Insertando forma de pago con: id=${data.ID_FORMA_PAGO}, nombre=${data.NOMBRE_FORMA_PAGO}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO FORMA_PAGO (ID_FORMA_PAGO, NOMBRE_FORMA_PAGO, DETALLE_FORMA_PAGO, ID_FPL, ESTADO) VALUES (?, ?, ?, ?, ?)",
      [
        data.ID_FORMA_PAGO,
        data.NOMBRE_FORMA_PAGO,
        data.DETALLE_FORMA_PAGO ?? null,
        data.ID_FPL,
        data.ESTADO ?? "A",
      ],
    );
    console.log(
      `✅ [formaPago.insertFormaPago] Éxito insertando forma de pago: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [formaPago.insertFormaPago] Error insertando forma de pago: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateFormaPago(id: string, data: Partial<FormaPagoInsert>): Promise<number> {
  console.log(`🔵 [formaPago.updateFormaPago] Actualizando forma de pago con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE FORMA_PAGO SET NOMBRE_FORMA_PAGO = COALESCE(?, NOMBRE_FORMA_PAGO), DETALLE_FORMA_PAGO = ?, ID_FPL = COALESCE(?, ID_FPL), ESTADO = COALESCE(?, ESTADO) WHERE ID_FORMA_PAGO = ?",
      [
        data.NOMBRE_FORMA_PAGO ?? null,
        data.DETALLE_FORMA_PAGO ?? null,
        data.ID_FPL ?? null,
        data.ESTADO ?? null,
        id,
      ],
    );
    console.log(
      `✅ [formaPago.updateFormaPago] Éxito actualizando forma de pago: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [formaPago.updateFormaPago] Error actualizando forma de pago ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteFormaPago(id: string): Promise<number> {
  console.log(`🔵 [formaPago.deleteFormaPago] Eliminando forma de pago con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM FORMA_PAGO WHERE ID_FORMA_PAGO = ?",
      [id],
    );
    console.log(
      `✅ [formaPago.deleteFormaPago] Éxito eliminando forma de pago: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [formaPago.deleteFormaPago] Error eliminando forma de pago ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
