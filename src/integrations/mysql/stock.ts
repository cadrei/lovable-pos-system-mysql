import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { StockInsert, StockSelect } from "@/types/mysqltypes";

export async function getStocks(): Promise<StockSelect[]> {
  console.log("🔵 [stock.getStocks] Obteniendo Stock...");
  try {
    const [rows] = await pool.query<(StockSelect & RowDataPacket)[]>(
      "SELECT ID_STOCK, TIPO_STOCK, AMBITO, DESCRIPCION, CANTIDAD, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM STOCK WHERE ESTADO='A' ORDER BY AMBITO, TIPO_STOCK",
    );
    console.log(`✅ [stock.getStocks] Stock obtenido: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [stock.getStocks] Error obteniendo stock: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function getStock(idStock: string): Promise<StockSelect | null> {
  console.log(`🔵 [stock.getStock] Obteniendo stock con: idStock=${idStock}`);
  try {
    const [rows] = await pool.query<(StockSelect & RowDataPacket)[]>(
      "SELECT ID_STOCK, TIPO_STOCK, AMBITO, DESCRIPCION, CANTIDAD, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM STOCK WHERE ID_STOCK = ?",
      [idStock],
    );
    console.log(
      `✅ [stock.getStock] Stock obtenido: ${rows.length}, resultado=${rows[0] ? "encontrado" : "null"}`,
    );
    return rows[0] ?? null;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [stock.getStock] Error al obtener stock: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertStock(stock: StockInsert): Promise<number> {
  console.log(`🔵 [stock.insertStock] Insertando stock con: idStock=${stock.ID_STOCK}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO STOCK (ID_STOCK, TIPO_STOCK, AMBITO, DESCRIPCION, CANTIDAD, ESTADO) VALUES (?, ?, ?, ?, ?, ?)",
      [
        stock.ID_STOCK,
        stock.TIPO_STOCK,
        stock.AMBITO,
        stock.DESCRIPCION ?? null,
        stock.CANTIDAD,
        stock.ESTADO ?? "A",
      ],
    );
    console.log(`✅ [stock.insertStock] Exito insertando stock afectados= ${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [stock.insertStock] Error insertando stock: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateStock(idStock: string, stock: Partial<StockInsert>): Promise<number> {
  console.log(`🔵 [stock.updateStock] Actualizando stock con: idStock=${idStock}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE STOCK SET TIPO_STOCK = COALESCE(?, TIPO_STOCK), AMBITO = COALESCE(?, AMBITO), DESCRIPCION = ?, CANTIDAD = COALESCE(?, CANTIDAD), ESTADO = COALESCE(?, ESTADO) WHERE ID_STOCK = ?",
      [
        stock.TIPO_STOCK ?? null,
        stock.AMBITO ?? null,
        stock.DESCRIPCION ?? null,
        stock.CANTIDAD ?? null,
        stock.ESTADO ?? null,
        idStock,
      ],
    );
    console.log(
      `✅ [stock.updateStock] Exito actualizando stock afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [stock.updateStock] Error actualizando stock: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteStock(idStock: string): Promise<number> {
  console.log(`🔵 [stock.deleteStock] Eliminando stock con: idStock=${idStock}`);
  try {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM STOCK WHERE ID_STOCK = ?", [
      idStock,
    ]);
    console.log(`✅ [stock.deleteStock] Exito eliminando stock: ${result.affectedRows}`);
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [stock.deleteStock] Error eliminando stock: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
