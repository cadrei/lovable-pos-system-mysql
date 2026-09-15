import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { TipoDocumentoInsert, TipoDocumentoSelect } from "@/types/mysqltypes";

export async function getTiposDocumento(): Promise<TipoDocumentoSelect[]> {
  console.log("🔵 [tipoDocumento.getTiposDocumento] Obteniendo tipo_documento...");
  try {
    const [rows] = await pool.query<TipoDocumentoSelect[]>(
      "SELECT ID_TIPO_DOC, NOMBRE_TIPO_DOC, DETALLE_TIPO_DOC, LONGITUD_DOC, FUNCION_VALIDACION FROM TIPO_DOCUMENTO ORDER BY NOMBRE_TIPO_DOC",
    );
    console.log(`✅ [tipoDocumento.getTiposDocumento] tipo_documento obtenidos: ${rows.length}`);
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [tipoDocumento.getTiposDocumento] Error obteniendo tipo_documento: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertTipoDocumento(data: TipoDocumentoInsert): Promise<number> {
  console.log(
    `🔵 [tipoDocumento.insertTipoDocumento] Insertando tipo_documento: id=${data.ID_TIPO_DOC}`,
  );
  try {
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
    console.log(
      `✅ [tipoDocumento.insertTipoDocumento] Exito insertando tipo_documento afectados=: ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [tipoDocumento.insertTipoDocumento] Error insertando tipo_documento: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateTipoDocumento(
  id: string,
  data: Partial<TipoDocumentoInsert>,
): Promise<number> {
  console.log(`🔵 [tipoDocumento.updateTipoDocumento] Actualizando tipo_documento: id=${id}`);
  try {
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
    console.log(
      `✅ [tipoDocumento.updateTipoDocumento] Exito actualizando tipo_documento afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [tipoDocumento.updateTipoDocumento] Error actualizando tipo_documento: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteTipoDocumento(id: string): Promise<number> {
  console.log(`🔵 [tipoDocumento.deleteTipoDocumento] Eliminando tipo_documento con: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM TIPO_DOCUMENTO WHERE ID_TIPO_DOC = ?",
      [id],
    );
    console.log(
      `✅ [tipoDocumento.deleteTipoDocumento] Exito eliminando tipo_documento afectados= ${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [tipoDocumento.deleteTipoDocumento] Error eliminando tipo_documento: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
