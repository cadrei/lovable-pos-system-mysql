import pool from "../../../database/mysqlpool";
import {
  CashRegisterRow,
  CashSessionReporte,
  CashSessionRow,
  CashMovementRow,
} from "@/types/mysqltypes";

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

import {
  CashRegisterInsert,
  CashRegisterSelect,
  CashMovementInsert,
  CashMovementSelect,
  CashSessionInsert,
  CashSessionSelect,
} from "@/types/mysqltypes";
import { ResultSetHeader } from "mysql2";

export async function getCajas(): Promise<CashRegisterSelect[]> {
  console.log("🔵 [DB] Obteniendo cajas registradoras");
  const [rows] = await pool.query<CashRegisterSelect[]>(
    "SELECT id, branch_id, code, name, active, created_at, updated_at FROM cash_registers ORDER BY name",
  );
  console.log(`✅ [DB] Cajas retornadas: ${rows.length}`);
  return rows;
}

export async function insertCaja(data: CashRegisterInsert): Promise<number> {
  console.log("🔵 [DB] Insertando caja registradora");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO cash_registers (id, branch_id, code, name, active) VALUES (?, ?, ?, ?, ?)",
    [data.id, data.branch_id, data.code, data.name, data.active ?? true],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function getSesionesCaja(): Promise<CashSessionSelect[]> {
  console.log("🔵 [DB] Obteniendo sesiones de caja");
  const [rows] = await pool.query<CashSessionSelect[]>(
    "SELECT id, cash_register_id, user_id, user_name, opened_at, opening_amount, closed_at, expected_amount, declared_amount, difference, status, notes, created_at, updated_at FROM cash_sessions ORDER BY opened_at DESC",
  );
  console.log(`✅ [DB] Sesiones de caja retornadas: ${rows.length}`);
  return rows;
}

export async function getSesionesCajaReporte(
  desde: string,
  hasta: string,
): Promise<CashSessionReporte[]> {
  console.log("🔵 [DB] Obteniendo sesiones de caja para reportes");
  const [rows] = await pool.query<CashSessionSelect[]>(
    "SELECT id, cash_register_id, user_id, user_name, opened_at, opening_amount, closed_at, expected_amount, declared_amount, difference, status, notes, created_at, updated_at FROM cash_sessions WHERE opened_at >= ? AND opened_at <= ? ORDER BY opened_at DESC",
    [desde, hasta],
  );
  console.log(`✅ [DB] Sesiones de caja de reportes retornadas: ${rows.length}`);
  return rows.map((row) => ({
    ...row,
    opened_at: new Date(row.opened_at).toISOString(),
    closed_at: row.closed_at ? new Date(row.closed_at).toISOString() : null,
    created_at: new Date(row.created_at).toISOString(),
    updated_at: new Date(row.updated_at).toISOString(),
  }));
}

export async function insertSesionCaja(data: CashSessionInsert): Promise<number> {
  console.log("🔵 [DB] Insertando sesión de caja");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO cash_sessions (id, cash_register_id, user_id, user_name, opened_at, opening_amount, closed_at, expected_amount, declared_amount, difference, status, notes) VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?, ?, ?, ?, ?, ?, ?)",
    [
      data.id,
      data.cash_register_id,
      data.user_id ?? null,
      data.user_name ?? null,
      data.opened_at ?? null,
      data.opening_amount ?? 0,
      data.closed_at ?? null,
      data.expected_amount ?? null,
      data.declared_amount ?? null,
      data.difference ?? null,
      data.status ?? "abierta",
      data.notes ?? null,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function getMovimientosCajaDetalle(sessionId?: string): Promise<CashMovementSelect[]> {
  console.log("🔵 [DB] Obteniendo movimientos de caja completos");
  const [rows] = await pool.query<CashMovementSelect[]>(
    sessionId
      ? "SELECT id, cash_session_id, type, amount, concept, reference, user_id, created_at FROM cash_movements WHERE cash_session_id = ? ORDER BY created_at DESC"
      : "SELECT id, cash_session_id, type, amount, concept, reference, user_id, created_at FROM cash_movements ORDER BY created_at DESC",
    sessionId ? [sessionId] : [],
  );
  console.log(`✅ [DB] Movimientos de caja retornados: ${rows.length}`);
  return rows;
}

export async function insertMovimientoCaja(data: CashMovementInsert): Promise<number> {
  console.log("🔵 [DB] Insertando movimiento de caja");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO cash_movements (id, cash_session_id, type, amount, concept, reference, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      data.id,
      data.cash_session_id,
      data.type,
      data.amount,
      data.concept,
      data.reference ?? null,
      data.user_id ?? null,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateSesionCaja(
  id: string,
  data: {
    status: "abierta" | "cerrada";
    closed_at?: Date;
    expected_amount?: number;
    declared_amount?: number;
    difference?: number;
  },
): Promise<number> {
  console.log("🔵 [DB] Actualizando sesión de caja");
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE cash_sessions SET status = ?, closed_at = COALESCE(?, closed_at), expected_amount = COALESCE(?, expected_amount), declared_amount = COALESCE(?, declared_amount), difference = COALESCE(?, difference) WHERE id = ?",
    [
      data.status,
      data.closed_at ?? null,
      data.expected_amount ?? null,
      data.declared_amount ?? null,
      data.difference ?? null,
      id,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
