import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { FormaPagoInsert, FormaPagoSelect } from "@/types/mysqltypes";

export async function getFormasPago(): Promise<FormaPagoSelect[]> {
  console.log("🔵 [DB] Obteniendo formas de pago activas");
  const [rows] = await pool.query<FormaPagoSelect[]>(
    "SELECT ID_FORMA_PAGO, NOMBRE_FORMA_PAGO, DETALLE_FORMA_PAGO, ID_FPL, ESTADO, FECHA_CREACION, FECHA_MODIFICACION FROM FORMA_PAGO WHERE ESTADO='A' ORDER BY NOMBRE_FORMA_PAGO",
  );
  console.log(`✅ [DB] Formas de pago retornadas: ${rows.length}`);
  return rows;
}

export async function insertFormaPago(data: FormaPagoInsert): Promise<number> {
  console.log("🔵 [DB] Insertando forma de pago");
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateFormaPago(id: string, data: Partial<FormaPagoInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando forma de pago ${id}`);
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteFormaPago(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando forma de pago ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM FORMA_PAGO WHERE ID_FORMA_PAGO = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
