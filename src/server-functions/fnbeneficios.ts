import { createServerFn } from "@tanstack/react-start";
import { getBeneficios } from "../integrations/mysql/sintbeneficios";
import {
  deleteBeneficio,
  getBeneficiosDetalle,
  insertBeneficio,
  updateBeneficio,
} from "../integrations/mysql/sintbeneficios";
import { BeneficioRow } from "../types/mysqltypes";
import { BeneficiosSintomasInsert, BeneficiosSintomasSelect } from "../types/mysqltypes";

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

export const fnBeneficiosDetalleGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: BeneficiosSintomasSelect[] = await getBeneficiosDetalle();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnBeneficiosDetalleGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnBeneficioInsert = createServerFn({ method: "POST" })
  .validator((data: BeneficiosSintomasInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertBeneficio(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnBeneficioInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnBeneficioUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; beneficio: Partial<BeneficiosSintomasInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateBeneficio(data.id, data.beneficio);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnBeneficioUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnBeneficioDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteBeneficio(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnBeneficioDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
