import pool from "../../../database/mysqlpool";
import type { ResultSetHeader } from "mysql2/promise";
import { DocumentNumberInsert, DocumentNumberSelect } from "@/types/mysqltypes";

export async function getDocumentNumbers(): Promise<DocumentNumberSelect[]> {
  console.log("🔵 [DB] Obteniendo numeradores de documentos");
  const [rows] = await pool.query<DocumentNumberSelect[]>(
    "SELECT id, doc_type, series, current_number FROM document_numbers ORDER BY doc_type, series",
  );
  console.log(`✅ [DB] Numeradores retornados: ${rows.length}`);
  return rows;
}

export async function insertDocumentNumber(data: DocumentNumberInsert): Promise<number> {
  console.log("🔵 [DB] Insertando numerador de documento");
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO document_numbers (doc_type, series, current_number) VALUES (?, ?, ?)",
    [data.doc_type, data.series, data.current_number ?? 0],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.insertId;
}

export async function updateDocumentNumber(
  id: number,
  data: Partial<DocumentNumberInsert>,
): Promise<number> {
  console.log(`🔵 [DB] Actualizando numerador de documento ${id}`);
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE document_numbers SET doc_type = COALESCE(?, doc_type), series = COALESCE(?, series), current_number = COALESCE(?, current_number) WHERE id = ?",
    [data.doc_type ?? null, data.series ?? null, data.current_number ?? null, id],
  );
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}

export async function deleteDocumentNumber(id: number): Promise<number> {
  console.log(`🔵 [DB] Eliminando numerador de documento ${id}`);
  const [result] = await pool.query<ResultSetHeader>("DELETE FROM document_numbers WHERE id = ?", [
    id,
  ]);
  console.log(`✅ [DB] Registros afectados: ${result.affectedRows}`);
  return result.affectedRows;
}
