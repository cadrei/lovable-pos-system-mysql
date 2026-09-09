import { createServerFn } from "@tanstack/react-start";
import { getSubcategorias } from "../integrations/mysql/subcategorias";
import { SubcategoriaRow } from "../types/mysqltypes";

export const getSubcategoriasFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: SubcategoriaRow[] = await getSubcategorias();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnGetSubcategorias] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
});
