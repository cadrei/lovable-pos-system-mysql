import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { CashRegisterInsert, CashRegisterSelect } from "@/types/mysqltypes";

export async function getCashRegisters(): Promise<CashRegisterSelect[]> {
  console.log("🔵 [DB] Obteniendo cajas registradoras activas");
  const [rows] = await pool.query<CashRegisterSelect[]>(
    "SELECT id, branch_id, code, name, active, created_at, updated_at FROM cash_registers WHERE active = TRUE ORDER BY name",
  );
  console.log(`✅ [DB] Cajas registradoras retornadas: ${rows.length}`);
  return rows;
}

export async function insertCashRegister(data: CashRegisterInsert): Promise<number> {
  console.log("🔵 [DB] Insertando caja registradora");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO cash_registers (id, branch_id, code, name, active) VALUES (?, ?, ?, ?, ?)",
    [data.id, data.branch_id, data.code, data.name, data.active ?? true],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateCashRegister(
  id: string,
  data: Partial<CashRegisterInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando caja registradora ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE cash_registers SET branch_id = COALESCE(?, branch_id), code = COALESCE(?, code), name = COALESCE(?, name), active = COALESCE(?, active) WHERE id = ?",
    [data.branch_id ?? null, data.code ?? null, data.name ?? null, data.active ?? null, id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteCashRegister(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando caja registradora ${id}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM cash_registers WHERE id = ?", [
    id,
  ]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
