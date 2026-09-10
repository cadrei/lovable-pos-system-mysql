import { createServerFn } from "@tanstack/react-start";
import { getSubcategorias } from "../integrations/mysql/subcategorias";
import {
  deleteSubcategoria,
  getSubcategoriasDetalle,
  insertSubcategoria,
  updateSubcategoria,
} from "../integrations/mysql/subcategorias";
import { SubcategoriaRow } from "../types/mysqltypes";
import { SubcategoriaInsert, SubcategoriaSelect } from "../types/mysqltypes";

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

export const fnSubcategoriasDetalleGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: SubcategoriaSelect[] = await getSubcategoriasDetalle();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnSubcategoriasDetalleGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnSubcategoriaInsert = createServerFn({ method: "POST" })
  .validator((data: SubcategoriaInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertSubcategoria(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnSubcategoriaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnSubcategoriaUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; subcategoria: Partial<SubcategoriaInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateSubcategoria(data.id, data.subcategoria);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnSubcategoriaUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnSubcategoriaDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteSubcategoria(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnSubcategoriaDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
