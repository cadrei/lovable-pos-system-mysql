import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import type { RowDataPacket } from "mysql2";
import { StockInsert, StockSelect } from "@/types/mysqltypes";

export async function getStocks(): Promise<StockSelect[]> {
  console.log("🔵 [DB] Obteniendo stocks activos");
  const [rows] = await pool.query<(StockSelect & RowDataPacket)[]>(
    "SELECT ID_STOCK, TIPO_STOCK, AMBITO, DESCRIPCION, CANTIDAD, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM STOCK WHERE ESTADO='A' ORDER BY AMBITO, TIPO_STOCK",
  );
  console.log(`✅ [DB] Stocks retornados: ${rows.length}`);
  return rows;
}

export async function getStock(idStock: string): Promise<StockSelect | null> {
  console.log(`🔵 [DB] Obteniendo stock ${idStock}`);
  const [rows] = await pool.query<(StockSelect & RowDataPacket)[]>(
    "SELECT ID_STOCK, TIPO_STOCK, AMBITO, DESCRIPCION, CANTIDAD, ESTADO, FECHA_CREACION, FECHA_ACTUALIZACION FROM STOCK WHERE ID_STOCK = ?",
    [idStock],
  );
  console.log(`✅ [DB] Stocks retornados: ${rows.length}`);
  return rows[0] ?? null;
}

export async function insertStock(stock: StockInsert): Promise<number> {
  console.log("🔵 [DB] Insertando stock");
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateStock(idStock: string, stock: Partial<StockInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando stock ${idStock}`);
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
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteStock(idStock: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando stock ${idStock}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM STOCK WHERE ID_STOCK = ?", [
    idStock,
  ]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
