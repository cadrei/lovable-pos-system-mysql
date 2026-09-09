import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { PagoInsert, PagoSelect } from "@/types/mysqltypes";

export async function getPagos(): Promise<PagoSelect[]> {
  console.log("🔵 [DB] Obteniendo pagos");
  const [rows] = await pool.query<PagoSelect[]>(
    "SELECT ID_PAGO, ID_FORMA_PAGO, MONEDA, MONTO, FECHA_HORA, REFERENCIA, ESTADO, FECHA_CREACION, FECHA_MODIFICACION FROM PAGO ORDER BY FECHA_HORA DESC",
  );
  console.log(`✅ [DB] Pagos retornados: ${rows.length}`);
  return rows;
}

export async function insertPago(data: PagoInsert): Promise<number> {
  console.log("🔵 [DB] Insertando pago");
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function updatePago(idPago: number, data: Partial<PagoInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando pago ${idPago}`);
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deletePago(idPago: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando pago ${idPago}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM PAGO WHERE ID_PAGO = ?", [
    idPago,
  ]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
