import pool from "../../../database/mysqlpool";
import { CashRegisterRow, CashSessionRow, CashMovementRow } from "@/types/mysqltypes";

// Obtener la última sesión abierta
export async function getSesionCaja(): Promise<CashSessionRow | null> {
  console.log("🔵 [DB] Obteniendo sesion de caja");
  const [rows] = await pool.query<CashSessionRow[]>(
    "SELECT id, cash_register_id, user_id, user_name, opened_at, opening_amount, status " +
      "FROM cash_sessions WHERE status='abierta' ORDER BY opened_at DESC LIMIT 1",
  );
  console.log(`✅ [DB] Encontrada sesion de caja, cantidad: ${rows.length}`);
  return rows[0] ?? null;
}

// Obtener movimientos de caja
export async function getMovimientosCaja(sessionId: string): Promise<CashMovementRow[]> {
  console.log("🔵 [DB] Obteniendo movimientos de caja");
  const [rows] = await pool.query<CashMovementRow[]>(
    "SELECT id, cash_session_id, type, amount, concept, reference, user_id, created_at " +
      "FROM cash_movements WHERE cash_session_id=? ORDER BY created_at DESC",
    [sessionId],
  );
  console.log(`✅ [DB] Movimientos de caja retornado: ${rows.length}`);
  return rows;
}

//Obtener el siguiente numero de documento
export async function getNextDocumentNumber(docType: string, series: string): Promise<string> {
  console.log("🔵 [DB] Obteniendo el siguiente numero de documento");
  const [rows] = await pool.query(
    "CALL next_document_number(?, ?, @next_num); SELECT @next_num AS numero;",
    [docType, series],
  );
  // El resultado viene en dos sets, tomamos el segundo
  const resultSets = rows as unknown as Array<Array<{ numero?: string }>>;
  const numero = resultSets[1]?.[0]?.numero;
  console.log(`✅ [DB] Numero de documento obtenido: ${rows}`);
  return numero ?? "";
}
