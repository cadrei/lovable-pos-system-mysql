import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { CashRegisterInsert, CashRegisterSelect } from "@/types/mysqltypes";

export async function getCashRegisters(): Promise<CashRegisterSelect[]> {
  console.log("🔵 [cashRegisters.getCashRegisters] Obteniendo informacion de cash registers... ");
  try {
    const [rows] = await pool.query<CashRegisterSelect[]>(
      "SELECT id, branch_id, code, name, active, created_at, updated_at FROM cash_registers WHERE active = TRUE ORDER BY name",
    );
    console.log(
      `✅ [cashRegisters.getCashRegisters] cash_registers obtenidos: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [cashRegisters.getCashRegisters] Error al obtener cash_registers: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertCashRegister(data: CashRegisterInsert): Promise<number> {
  console.log(
    `🔵 [cashRegisters.insertCashRegister] Insertando en cash_registers: id=${data.id}, code=${data.code}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO cash_registers (id, branch_id, code, name, active) VALUES (?, ?, ?, ?, ?)",
      [data.id, data.branch_id, data.code, data.name, data.active ?? true],
    );
    console.log(
      `✅ [cashRegisters.insertCashRegister] insertado en cash_registers: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [cashRegisters.insertCashRegister] Error al insertar cash_registers: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateCashRegister(
  id: string,
  data: Partial<CashRegisterInsert>,
): Promise<number> {
  console.log(`🔵 [cashRegisters.updateCashRegister] Actualizando cash_registers: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE cash_registers SET branch_id = COALESCE(?, branch_id), code = COALESCE(?, code), name = COALESCE(?, name), active = COALESCE(?, active) WHERE id = ?",
      [data.branch_id ?? null, data.code ?? null, data.name ?? null, data.active ?? null, id],
    );
    console.log(
      `✅ [cashRegisters.updateCashRegister] Exito actualizando cash_registers, registros afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [cashRegisters.updateCashRegister] Error ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteCashRegister(id: string): Promise<number> {
  console.log(`🔵 [cashRegisters.deleteCashRegister] Eliminando cash_registers con id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM cash_registers WHERE id = ?", [
      id,
    ]);
    console.log(
      `✅ [cashRegisters.deleteCashRegister] Éxito eliminando cash_register: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [cashRegisters.deleteCashRegister] Error eliminando cash_register: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
