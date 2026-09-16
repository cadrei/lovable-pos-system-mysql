import { createServerFn } from "@tanstack/react-start";
import {
  deletePromocionCombo,
  getPromocionCombo,
  getPromocionesCombos,
  insertPromocionCombo,
  updatePromocionCombo,
} from "../integrations/mysql/promocionesCombos";
import { PromocionesCombosInsert, PromocionesCombosSelect } from "../types/mysqltypes";

export const fnPromocionesCombosGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: PromocionesCombosSelect[] = await getPromocionesCombos();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnPromocionesCombosGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnPromocionComboGet = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: PromocionesCombosSelect | null = await getPromocionCombo(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPromocionComboGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPromocionComboInsert = createServerFn({ method: "POST" })
  .validator((data: PromocionesCombosInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertPromocionCombo(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPromocionComboInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPromocionComboUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; promocion: Partial<PromocionesCombosInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updatePromocionCombo(data.id, data.promocion);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPromocionComboUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnPromocionComboDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deletePromocionCombo(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnPromocionComboDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
