import { createServerFn } from "@tanstack/react-start";
import { getNextDocumentNumber } from "../integrations/mysql/caja";

export const getNextDocumentNumberFn = createServerFn({ method: "POST" })
  .validator((data: { docType: string; series: string }) => data)
  .handler(async ({ data }) => {
    try {
      const numero = await getNextDocumentNumber(data.docType, data.series);
      return { success: true, data: numero };
    } catch (error) {
      console.error("❌ [ServerFn] Error obteniendo número de documento:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
