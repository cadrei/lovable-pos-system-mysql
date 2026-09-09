import { createServerFn } from "@tanstack/react-start";
import { getCategorias } from "../integrations/mysql/categorias";
import {
  deleteCategoria,
  getCategoriasDetalle,
  insertCategoria,
  updateCategoria,
} from "../integrations/mysql/categorias";
import { CategoriaInsert, CategoriaSelect } from "../types/mysqltypes";

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

export const fnCategoriasDetalleGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: CategoriaSelect[] = await getCategoriasDetalle();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnCategoriasDetalleGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnCategoriaInsert = createServerFn({ method: "POST" })
  .validator((data: CategoriaInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertCategoria(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCategoriaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnCategoriaUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; categoria: Partial<CategoriaInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateCategoria(data.id, data.categoria);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCategoriaUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnCategoriaDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteCategoria(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCategoriaDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
