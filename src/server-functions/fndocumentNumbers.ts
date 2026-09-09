import { createServerFn } from "@tanstack/react-start";
import {
  deleteDocumentNumber,
  getDocumentNumbers,
  insertDocumentNumber,
  updateDocumentNumber,
} from "../integrations/mysql/documentNumbers";
import { DocumentNumberInsert, DocumentNumberSelect } from "../types/mysqltypes";

export const fnDocumentNumbersGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: DocumentNumberSelect[] = await getDocumentNumbers();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnDocumentNumbersGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnDocumentNumberInsert = createServerFn({ method: "POST" })
  .validator((data: DocumentNumberInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertDocumentNumber(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnDocumentNumberInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnDocumentNumberUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: number; document: Partial<DocumentNumberInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateDocumentNumber(data.id, data.document);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnDocumentNumberUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnDocumentNumberDelete = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteDocumentNumber(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnDocumentNumberDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
