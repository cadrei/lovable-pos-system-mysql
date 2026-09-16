import pool from "../../../database/mysqlpool";
import {
  CashRegisterRow,
  CashSessionReporte,
  CashSessionRow,
  CashMovementRow,
  CashRegisterInsert,
  CashRegisterSelect,
  CashMovementInsert,
  CashMovementSelect,
  CashSessionInsert,
  CashSessionSelect,
} from "@/types/mysqltypes";
import { ResultSetHeader } from "mysql2";

// Obtener la última sesión abierta
export async function getSesionCaja(): Promise<CashSessionRow | null> {
  console.log("🔵 [caja.getSesionCaja] Obteniendo sesion de caja...");
  try {
    const [rows] = await pool.query<CashSessionRow[]>(
      "SELECT id, cash_register_id, user_id, user_name, opened_at, opening_amount, status " +
        "FROM cash_sessions WHERE status='abierta' ORDER BY opened_at DESC LIMIT 1",
    );
    console.log(`✅ [caja.getSesionCaja] sesiones de caja obtenidas: ${rows.length}`);
    return rows[0] ?? null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ [caja.getSesionCaja] Error al obtener la sesión de caja: ${err.message}`);
      throw new Error(`[caja.getSesionCaja] Error al obtener la sesión de caja: ${err.message}`);
    }
    console.error(
      `❌ [caja.getSesionCaja] Error desconocido al obtener la sesión de caja: ${String(err)}`,
    );
    throw new Error(
      `[caja.getSesionCaja] Error desconocido al obtener la sesión de caja: ${String(err)}`,
    );
  }
}

// Obtener movimientos de caja
export async function getMovimientosCaja(sessionId: string): Promise<CashMovementRow[]> {
  console.log(`🔵 [caja.getMovimientosCaja] Obteniendo movimientos, sessionId: ${sessionId}`);
  try {
    const [rows] = await pool.query<CashMovementRow[]>(
      "SELECT id, cash_session_id, type, amount, concept, reference, user_id, created_at " +
        "FROM cash_movements WHERE cash_session_id=? ORDER BY created_at DESC",
      [sessionId],
    );
    console.log(`✅ [caja.getMovimientosCaja] movimientos caja obtenidos: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [caja.getMovimientosCaja] Error al obtener los movimientos de caja: ${err.message}`,
      );
      throw new Error(
        `[caja.getMovimientosCaja] Error al obtener los movimientos de caja: ${err.message}`,
      );
    }
    console.error(
      `❌ [caja.getMovimientosCaja] Error desconocido al obtener los movimientos de caja: ${String(err)}`,
    );
    throw new Error(
      `[caja.getMovimientosCaja] Error desconocido al obtener los movimientos de caja: ${String(err)}`,
    );
  }
}

//Obtener el siguiente numero de documento
export async function getNextDocumentNumber(docType: string, series: string): Promise<string> {
  console.log(
    `🔵 [caja.getNextDocumentNumber] Obteniendo numero, docType: ${docType}, series: ${series}`,
  );
  try {
    const [rows] = await pool.query(
      "CALL next_document_number(?, ?, @next_num); SELECT @next_num AS numero;",
      [docType, series],
    );
    // El resultado viene en dos sets, tomamos el segundo
    const resultSets = rows as unknown as Array<Array<{ numero?: string }>>;
    const numero = resultSets[1]?.[0]?.numero;
    console.log(
      `✅ [caja.getNextDocumentNumber] numeros de documento obtenidos: ${resultSets[1]?.length ?? 0}`,
    );
    return numero ?? "";
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [caja.getNextDocumentNumber] Error al obtener el siguiente número de documento: ${err.message}`,
      );
      throw new Error(
        `[caja.getNextDocumentNumber] Error al obtener el siguiente número de documento: ${err.message}`,
      );
    }
    console.error(
      `❌ [caja.getNextDocumentNumber] Error desconocido al obtener el siguiente número de documento: ${String(err)}`,
    );
    throw new Error(
      `[caja.getNextDocumentNumber] Error desconocido al obtener el siguiente número de documento: ${String(err)}`,
    );
  }
}

export async function getCajas(): Promise<CashRegisterSelect[]> {
  console.log("🔵 [caja.getCajas] Obteniendo cajas registradoras");
  try {
    const [rows] = await pool.query<CashRegisterSelect[]>(
      "SELECT id, branch_id, code, name, active, created_at, updated_at FROM cash_registers ORDER BY name",
    );
    console.log(`✅ [caja.getCajas] Cajas obtenidas: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ [caja.getCajas] Error al obtener las cajas registradoras: ${err.message}`);
      throw new Error(`[caja.getCajas] Error al obtener las cajas registradoras: ${err.message}`);
    }
    console.error(
      `❌ [caja.getCajas] Error desconocido al obtener las cajas registradoras: ${String(err)}`,
    );
    throw new Error(
      `[caja.getCajas] Error desconocido al obtener las cajas registradoras: ${String(err)}`,
    );
  }
}

export async function insertCaja(data: CashRegisterInsert): Promise<number> {
  console.log(
    `🔵 [caja.insertCaja] Insertando caja registradora, id: ${data.id}, branch_id: ${data.branch_id}, code: ${data.code}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO cash_registers (id, branch_id, code, name, active) VALUES (?, ?, ?, ?, ?)",
      [data.id, data.branch_id, data.code, data.name, data.active ?? true],
    );
    console.log(`✅ [caja.insertCaja] Registros afectados: ${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ [caja.insertCaja] Error al insertar la caja registradora: ${err.message}`);
      throw new Error(`[caja.insertCaja] Error al insertar la caja registradora: ${err.message}`);
    }
    console.error(
      `❌ [caja.insertCaja] Error desconocido al insertar la caja registradora: ${String(err)}`,
    );
    throw new Error(
      `[caja.insertCaja] Error desconocido al insertar la caja registradora: ${String(err)}`,
    );
  }
}

export async function getSesionesCaja(): Promise<CashSessionSelect[]> {
  console.log("🔵 [caja.getSesionesCaja] Obteniendo sesiones de caja");
  try {
    const [rows] = await pool.query<CashSessionSelect[]>(
      "SELECT id, cash_register_id, user_id, user_name, opened_at, opening_amount, closed_at, expected_amount, declared_amount, difference, status, notes, created_at, updated_at FROM cash_sessions ORDER BY opened_at DESC",
    );
    console.log(`✅ [caja.getSesionesCaja] Sesiones de caja retornadas: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [caja.getSesionesCaja] Error al obtener las sesiones de caja: ${err.message}`,
      );
      throw new Error(
        `[caja.getSesionesCaja] Error al obtener las sesiones de caja: ${err.message}`,
      );
    }
    console.error(
      `❌ [caja.getSesionesCaja] Error desconocido al obtener las sesiones de caja: ${String(err)}`,
    );
    throw new Error(
      `[caja.getSesionesCaja] Error desconocido al obtener las sesiones de caja: ${String(err)}`,
    );
  }
}

export async function getSesionesCajaReporte(
  desde: string,
  hasta: string,
): Promise<CashSessionReporte[]> {
  console.log(
    `🔵 [caja.getSesionesCajaReporte] Obteniendo sesiones de caja para reportes, desde: ${desde}, hasta: ${hasta}`,
  );
  try {
    const [rows] = await pool.query<CashSessionSelect[]>(
      "SELECT id, cash_register_id, user_id, user_name, opened_at, opening_amount, closed_at, expected_amount, declared_amount, difference, status, notes, created_at, updated_at FROM cash_sessions WHERE opened_at >= ? AND opened_at <= ? ORDER BY opened_at DESC",
      [desde, hasta],
    );
    console.log(
      `✅ [caja.getSesionesCajaReporte] Sesiones de caja de reportes retornadas: ${rows.length}`,
    );
    return rows.map((row) => ({
      ...row,
      opened_at: new Date(row.opened_at).toISOString(),
      closed_at: row.closed_at ? new Date(row.closed_at).toISOString() : null,
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
    }));
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [caja.getSesionesCajaReporte] Error al obtener el reporte de sesiones de caja, desde: ${desde}, hasta: ${hasta}: ${err.message}`,
      );
      throw new Error(
        `[caja.getSesionesCajaReporte] Error al obtener el reporte de sesiones de caja, desde: ${desde}, hasta: ${hasta}: ${err.message}`,
      );
    }
    console.error(
      `❌ [caja.getSesionesCajaReporte] Error desconocido al obtener el reporte de sesiones de caja, desde: ${desde}, hasta: ${hasta}: ${String(err)}`,
    );
    throw new Error(
      `[caja.getSesionesCajaReporte] Error desconocido al obtener el reporte de sesiones de caja, desde: ${desde}, hasta: ${hasta}: ${String(err)}`,
    );
  }
}

export async function insertSesionCaja(data: CashSessionInsert): Promise<number> {
  console.log(
    `🔵 [caja.insertSesionCaja] Insertando sesión de caja, id: ${data.id}, cash_register_id: ${data.cash_register_id}, user_id: ${data.user_id}`,
  );
  try {
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
    console.log(`✅ [caja.insertSesionCaja] Registros afectados: ${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [caja.insertSesionCaja] Error al insertar la sesión de caja, id: ${data.id}, cash_register_id: ${data.cash_register_id}: ${err.message}`,
      );
      throw new Error(
        `[caja.insertSesionCaja] Error al insertar la sesión de caja, id: ${data.id}, cash_register_id: ${data.cash_register_id}: ${err.message}`,
      );
    }
    console.error(
      `❌ [caja.insertSesionCaja] Error desconocido al insertar la sesión de caja, id: ${data.id}, cash_register_id: ${data.cash_register_id}: ${String(err)}`,
    );
    throw new Error(
      `[caja.insertSesionCaja] Error desconocido al insertar la sesión de caja, id: ${data.id}, cash_register_id: ${data.cash_register_id}: ${String(err)}`,
    );
  }
}

export async function getMovimientosCajaDetalle(sessionId?: string): Promise<CashMovementSelect[]> {
  console.log(
    `🔵 [caja.getMovimientosCajaDetalle] Obteniendo movimientos de caja completos, sessionId: ${sessionId ?? "todos"}`,
  );
  try {
    const [rows] = await pool.query<CashMovementSelect[]>(
      sessionId
        ? "SELECT id, cash_session_id, type, amount, concept, reference, user_id, created_at FROM cash_movements WHERE cash_session_id = ? ORDER BY created_at DESC"
        : "SELECT id, cash_session_id, type, amount, concept, reference, user_id, created_at FROM cash_movements ORDER BY created_at DESC",
      sessionId ? [sessionId] : [],
    );
    console.log(
      `✅ [caja.getMovimientosCajaDetalle] Movimientos de caja retornados: ${rows.length}`,
    );
    return rows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [caja.getMovimientosCajaDetalle] Error al obtener el detalle de movimientos de caja, sessionId: ${sessionId ?? "todos"}: ${err.message}`,
      );
      throw new Error(
        `[caja.getMovimientosCajaDetalle] Error al obtener el detalle de movimientos de caja, sessionId: ${sessionId ?? "todos"}: ${err.message}`,
      );
    }
    console.error(
      `❌ [caja.getMovimientosCajaDetalle] Error desconocido al obtener el detalle de movimientos de caja, sessionId: ${sessionId ?? "todos"}: ${String(err)}`,
    );
    throw new Error(
      `[caja.getMovimientosCajaDetalle] Error desconocido al obtener el detalle de movimientos de caja, sessionId: ${sessionId ?? "todos"}: ${String(err)}`,
    );
  }
}

export async function insertMovimientoCaja(data: CashMovementInsert): Promise<number> {
  console.log(
    `🔵 [caja.insertMovimientoCaja] Insertando movimiento de caja, id: ${data.id}, cash_session_id: ${data.cash_session_id}, type: ${data.type}`,
  );
  try {
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
    console.log(`✅ [caja.insertMovimientoCaja] Registros afectados: ${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [caja.insertMovimientoCaja] Error al insertar el movimiento de caja, id: ${data.id}, cash_session_id: ${data.cash_session_id}: ${err.message}`,
      );
      throw new Error(
        `[caja.insertMovimientoCaja] Error al insertar el movimiento de caja, id: ${data.id}, cash_session_id: ${data.cash_session_id}: ${err.message}`,
      );
    }
    console.error(
      `❌ [caja.insertMovimientoCaja] Error desconocido al insertar el movimiento de caja, id: ${data.id}, cash_session_id: ${data.cash_session_id}: ${String(err)}`,
    );
    throw new Error(
      `[caja.insertMovimientoCaja] Error desconocido al insertar el movimiento de caja, id: ${data.id}, cash_session_id: ${data.cash_session_id}: ${String(err)}`,
    );
  }
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
  console.log(
    `🔵 [caja.updateSesionCaja] Actualizando sesión de caja, id: ${id}, status: ${data.status}`,
  );
  try {
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
    console.log(`✅ [caja.updateSesionCaja] Registros afectados: ${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        `❌ [caja.updateSesionCaja] Error al actualizar la sesión de caja, id: ${id}, status: ${data.status}: ${err.message}`,
      );
      throw new Error(
        `[caja.updateSesionCaja] Error al actualizar la sesión de caja, id: ${id}, status: ${data.status}: ${err.message}`,
      );
    }
    console.error(
      `❌ [caja.updateSesionCaja] Error desconocido al actualizar la sesión de caja, id: ${id}, status: ${data.status}: ${String(err)}`,
    );
    throw new Error(
      `[caja.updateSesionCaja] Error desconocido al actualizar la sesión de caja, id: ${id}, status: ${data.status}: ${String(err)}`,
    );
  }
}
