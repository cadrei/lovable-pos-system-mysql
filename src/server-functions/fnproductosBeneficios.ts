import { createServerFn } from "@tanstack/react-start";
import { getProductosBeneficio } from "../integrations/mysql/productos";
import {
  deleteProductoBeneficio,
  getProductosBeneficios,
  insertProductoBeneficio,
  updateProductoBeneficio,
} from "../integrations/mysql/productosBeneficios";
import { ProductoBeneficioInsert, ProductoBeneficioSelect } from "../types/mysqltypes";

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

export const fnProductosBeneficiosGet = createServerFn({ method: "POST" })
  .validator((data: { productoId?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: ProductoBeneficioSelect[] = await getProductosBeneficios(data.productoId);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductosBeneficiosGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnProductoBeneficioInsert = createServerFn({ method: "POST" })
  .validator((data: ProductoBeneficioInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertProductoBeneficio(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductoBeneficioInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnProductoBeneficioUpdate = createServerFn({ method: "POST" })
  .validator((data: { productoId: string; beneficioId: string; estado: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateProductoBeneficio(data.productoId, data.beneficioId, data.estado);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductoBeneficioUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnProductoBeneficioDelete = createServerFn({ method: "POST" })
  .validator((data: { productoId: string; beneficioId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteProductoBeneficio(data.productoId, data.beneficioId);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnProductoBeneficioDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
