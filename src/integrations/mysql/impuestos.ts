import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { ImpuestoInsert, ImpuestoSelect } from "@/types/mysqltypes";

export async function getImpuestos(): Promise<ImpuestoSelect[]> {
  console.log("🔵 [DB] Obteniendo impuestos");
  const [rows] = await pool.query<ImpuestoSelect[]>(
    "SELECT ID_TIPO_IMPUESTO, NOMBRE_TIPO_IMPUESTO, DETALLE_IMPUESTO, VALOR_IMPUESTO FROM IMPUESTO ORDER BY NOMBRE_TIPO_IMPUESTO",
  );
  console.log(`✅ [DB] Impuestos retornados: ${rows.length}`);
  return rows;
}

export async function insertImpuesto(data: ImpuestoInsert): Promise<number> {
  console.log("🔵 [DB] Insertando impuesto");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO IMPUESTO (ID_TIPO_IMPUESTO, NOMBRE_TIPO_IMPUESTO, DETALLE_IMPUESTO, VALOR_IMPUESTO) VALUES (?, ?, ?, ?)",
    [
      data.ID_TIPO_IMPUESTO,
      data.NOMBRE_TIPO_IMPUESTO,
      data.DETALLE_IMPUESTO ?? null,
      data.VALOR_IMPUESTO,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateImpuesto(id: string, data: Partial<ImpuestoInsert>): Promise<number> {
  console.log(`🔵 [DB] Actualizando impuesto ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE IMPUESTO SET NOMBRE_TIPO_IMPUESTO = COALESCE(?, NOMBRE_TIPO_IMPUESTO), DETALLE_IMPUESTO = ?, VALOR_IMPUESTO = COALESCE(?, VALOR_IMPUESTO) WHERE ID_TIPO_IMPUESTO = ?",
    [
      data.NOMBRE_TIPO_IMPUESTO ?? null,
      data.DETALLE_IMPUESTO ?? null,
      data.VALOR_IMPUESTO ?? null,
      id,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteImpuesto(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando impuesto ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM IMPUESTO WHERE ID_TIPO_IMPUESTO = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
