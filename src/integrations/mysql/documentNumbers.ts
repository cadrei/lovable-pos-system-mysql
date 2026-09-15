import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { DocumentNumberInsert, DocumentNumberSelect } from "@/types/mysqltypes";

export async function getDocumentNumbers(): Promise<DocumentNumberSelect[]> {
  console.log("🔵 [documentNumbers.getDocumentNumbers] Obteniendo numero de documento...");
  try {
    const [rows] = await pool.query<DocumentNumberSelect[]>(
      "SELECT id, doc_type, series, current_number FROM document_numbers ORDER BY doc_type, series",
    );
    console.log(
      `✅ [documentNumbers.getDocumentNumbers] Éxito al obtener numero de documento: ${rows.length} registros`,
    );
    return rows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [documentNumbers.getDocumentNumbers] Error al obtener numero de documento ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function insertDocumentNumber(data: DocumentNumberInsert): Promise<number> {
  console.log(
    `🔵 [documentNumbers.insertDocumentNumber] Insertando numero de documento: tipo=${data.doc_type}, serie=${data.series}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO document_numbers (doc_type, series, current_number) VALUES (?, ?, ?)",
      [data.doc_type, data.series, data.current_number ?? 0],
    );
    console.log(
      `✅ [documentNumbers.insertDocumentNumber] Éxito al insertar numero de documento: insertId=${result.insertId}, afectados=${result.affectedRows}`,
    );
    return result.insertId;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [documentNumbers.insertDocumentNumber] Error al insertar numero de documento ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function updateDocumentNumber(
  id: number,
  data: Partial<DocumentNumberInsert>,
): Promise<number> {
  console.log(
    `🔵 [documentNumbers.updateDocumentNumber] Actualizando numero de documento con: id=${id}`,
  );
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE document_numbers SET doc_type = COALESCE(?, doc_type), series = COALESCE(?, series), current_number = COALESCE(?, current_number) WHERE id = ?",
      [data.doc_type ?? null, data.series ?? null, data.current_number ?? null, id],
    );
    console.log(
      `✅ [documentNumbers.updateDocumentNumber] Éxito al actualizar numero de documento: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [documentNumbers.updateDocumentNumber] Error al actualizar numero de documento: ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}

export async function deleteDocumentNumber(id: number): Promise<number> {
  console.log(`🔵 [documentNumbers.deleteDocumentNumber] Eliminando numero de documento: id=${id}`);
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM document_numbers WHERE id = ?",
      [id],
    );
    console.log(
      `✅ [documentNumbers.deleteDocumentNumber] Éxito eliminando numero de documento: afectados=${result.affectedRows}`,
    );
    return result.affectedRows;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `❌ [documentNumbers.deleteDocumentNumber] Error eliminando numero de documento ${err instanceof Error ? "conocido" : "desconocido"}: ${message}`,
    );
    throw new Error(message);
  }
}
