import { createServerFn } from "@tanstack/react-start";
import { getCategorias } from "../integrations/mysql/categorias";

export const getCategoriasFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await getCategorias();
    const categorias = data.map((c) => ({
      id: c.ID_CATEGORIA,
      name: c.NOMBRE_CATEGORIA,
      description: c.DESCRIPCION ?? "",
      estado: c.ESTADO,
      createdAt: c.FECHA_CREACION,
      updatedAt: c.FECHA_ACTUALIZACION,
    }));
    return { success: true, data: categorias };
  } catch (error) {
    console.error("❌ [fnGetCategorias] Error en categorías:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
});
