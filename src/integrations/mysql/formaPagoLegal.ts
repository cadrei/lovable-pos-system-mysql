import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { FormaPagoLegalInsert, FormaPagoLegalSelect } from "@/types/mysqltypes";

export async function getFormasPagoLegales(): Promise<FormaPagoLegalSelect[]> {
  console.log("🔵 [DB] Obteniendo formas de pago legales");
  const [rows] = await pool.query<FormaPagoLegalSelect[]>(
    "SELECT ID_FPL, NOMBRE_FPL, DETALLE_FPL FROM FORMA_PAGO_LEGAL ORDER BY NOMBRE_FPL",
  );
  console.log(`✅ [DB] Formas de pago legales retornadas: ${rows.length}`);
  return rows;
}

export async function insertFormaPagoLegal(data: FormaPagoLegalInsert): Promise<number> {
  console.log("🔵 [DB] Insertando forma de pago legal");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO FORMA_PAGO_LEGAL (ID_FPL, NOMBRE_FPL, DETALLE_FPL) VALUES (?, ?, ?)",
    [data.ID_FPL, data.NOMBRE_FPL, data.DETALLE_FPL ?? null],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateFormaPagoLegal(
  id: string,
  data: Partial<FormaPagoLegalInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando forma de pago legal ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE FORMA_PAGO_LEGAL SET NOMBRE_FPL = COALESCE(?, NOMBRE_FPL), DETALLE_FPL = ? WHERE ID_FPL = ?",
    [data.NOMBRE_FPL ?? null, data.DETALLE_FPL ?? null, id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteFormaPagoLegal(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando forma de pago legal ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM FORMA_PAGO_LEGAL WHERE ID_FPL = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
