import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { TipoDocumentoInsert, TipoDocumentoSelect } from "@/types/mysqltypes";

export async function getTiposDocumento(): Promise<TipoDocumentoSelect[]> {
  console.log("🔵 [DB] Obteniendo tipos de documento");
  const [rows] = await pool.query<TipoDocumentoSelect[]>(
    "SELECT ID_TIPO_DOC, NOMBRE_TIPO_DOC, DETALLE_TIPO_DOC, LONGITUD_DOC, FUNCION_VALIDACION FROM TIPO_DOCUMENTO ORDER BY NOMBRE_TIPO_DOC",
  );
  console.log(`✅ [DB] Tipos de documento retornados: ${rows.length}`);
  return rows;
}

export async function insertTipoDocumento(data: TipoDocumentoInsert): Promise<number> {
  console.log("🔵 [DB] Insertando tipo de documento");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO TIPO_DOCUMENTO (ID_TIPO_DOC, NOMBRE_TIPO_DOC, DETALLE_TIPO_DOC, LONGITUD_DOC, FUNCION_VALIDACION) VALUES (?, ?, ?, ?, ?)",
    [
      data.ID_TIPO_DOC,
      data.NOMBRE_TIPO_DOC,
      data.DETALLE_TIPO_DOC ?? null,
      data.LONGITUD_DOC,
      data.FUNCION_VALIDACION,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function updateTipoDocumento(
  id: string,
  data: Partial<TipoDocumentoInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando tipo de documento ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE TIPO_DOCUMENTO SET NOMBRE_TIPO_DOC = COALESCE(?, NOMBRE_TIPO_DOC), DETALLE_TIPO_DOC = ?, LONGITUD_DOC = COALESCE(?, LONGITUD_DOC), FUNCION_VALIDACION = COALESCE(?, FUNCION_VALIDACION) WHERE ID_TIPO_DOC = ?",
    [
      data.NOMBRE_TIPO_DOC ?? null,
      data.DETALLE_TIPO_DOC ?? null,
      data.LONGITUD_DOC ?? null,
      data.FUNCION_VALIDACION ?? null,
      id,
    ],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteTipoDocumento(id: string): Promise<number> {
  console.log(`🔵 [DB] Eliminando tipo de documento ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM TIPO_DOCUMENTO WHERE ID_TIPO_DOC = ?",
    [id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
