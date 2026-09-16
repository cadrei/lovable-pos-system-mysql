import { createServerFn } from "@tanstack/react-start";
import {
  deleteCashRegister,
  getCashRegisters,
  insertCashRegister,
  updateCashRegister,
} from "../integrations/mysql/cashRegisters";
import { CashRegisterInsert, CashRegisterSelect } from "../types/mysqltypes";

export const fnCashRegistersGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: CashRegisterSelect[] = await getCashRegisters();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnCashRegistersGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnCashRegisterInsert = createServerFn({ method: "POST" })
  .validator((data: CashRegisterInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertCashRegister(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCashRegisterInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnCashRegisterUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: string; register: Partial<CashRegisterInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateCashRegister(data.id, data.register);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCashRegisterUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnCashRegisterDelete = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteCashRegister(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCashRegisterDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
