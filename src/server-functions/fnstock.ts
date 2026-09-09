import { createServerFn } from "@tanstack/react-start";
import {
  deleteStock,
  getStock,
  getStocks,
  insertStock,
  updateStock,
} from "../integrations/mysql/stock";
import { StockInsert, StockSelect } from "../types/mysqltypes";

export const fnStocksGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: StockSelect[] = await getStocks();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnStocksGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnStockGet = createServerFn({ method: "POST" })
  .validator((data: { idStock: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result: StockSelect | null = await getStock(data.idStock);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnStockGet] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnStockInsert = createServerFn({ method: "POST" })
  .validator((data: StockInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertStock(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnStockInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnStockUpdate = createServerFn({ method: "POST" })
  .validator((data: { idStock: string; stock: Partial<StockInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateStock(data.idStock, data.stock);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnStockUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnStockDelete = createServerFn({ method: "POST" })
  .validator((data: { idStock: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteStock(data.idStock);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnStockDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
