import { createServerFn } from "@tanstack/react-start";
import { getProductosBeneficio } from "../integrations/mysql/productos";

export const getProdBenefFn = createServerFn({ method: "POST" })
  .validator((data: { beneficioId: string; sucursalId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const productoBenefRaw = await getProductosBeneficio(data.beneficioId, data.sucursalId);
      return { success: true, data: productoBenefRaw };
    } catch (error) {
      console.error("❌ [fnproductosBeneficios] Error al obtener productos beneficios:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
