import { createServerFn } from "@tanstack/react-start";
import { getBeneficios } from "../integrations/mysql/sintbeneficios";
import { BeneficioRow } from "../types/mysqltypes";

export const getBeneficiosFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: BeneficioRow[] = await getBeneficios();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnbeneficios] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
});
