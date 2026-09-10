import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { NotaVentaInsert, NotaVentaSelect } from "@/types/mysqltypes";

export async function getNotasVenta(): Promise<NotaVentaSelect[]> {
  console.log("🔵 [DB] Obteniendo notas de venta");
  const [rows] = await pool.query<NotaVentaSelect[]>(
    "SELECT ID_NOTA_VENTA, ID_VENTA, NUMERO_NOTA_VENTA, NUM_AUTORIZACION, FECHA_EMISION, TOTAL FROM NOTA_VENTA ORDER BY FECHA_EMISION DESC",
  );
  console.log(`✅ [DB] Notas de venta retornadas: ${rows.length}`);
  return rows;
}

export async function insertNotaVenta(data: NotaVentaInsert): Promise<number> {
  console.log("🔵 [DB] Insertando nota de venta");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO NOTA_VENTA (ID_VENTA, NUMERO_NOTA_VENTA, NUM_AUTORIZACION, FECHA_EMISION, TOTAL) VALUES (?, ?, ?, ?, ?)",
    [data.ID_VENTA, data.NUMERO_NOTA_VENTA, data.NUM_AUTORIZACION, data.FECHA_EMISION, data.TOTAL],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function updateNotaVenta(id: number, data: Partial<NotaVentaInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando nota de venta ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE NOTA_VENTA SET ID_VENTA = COALESCE(?, ID_VENTA), NUMERO_NOTA_VENTA = COALESCE(?, NUMERO_NOTA_VENTA), NUM_AUTORIZACION = COALESCE(?, NUM_AUTORIZACION), FECHA_EMISION = COALESCE(?, FECHA_EMISION), TOTAL = COALESCE(?, TOTAL) WHERE ID_NOTA_VENTA = ?",
    [
      data.ID_VENTA ?? null,
      data.NUMERO_NOTA_VENTA ?? null,
      data.NUM_AUTORIZACION ?? null,
      data.FECHA_EMISION ?? null,
      data.TOTAL ?? null,
      id,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteNotaVenta(id: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando nota de venta ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM NOTA_VENTA WHERE ID_NOTA_VENTA = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
