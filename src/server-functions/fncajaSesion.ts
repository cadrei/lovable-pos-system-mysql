import { createServerFn } from "@tanstack/react-start";
import { getSesionCaja, updateSesionCaja } from "../integrations/mysql/caja";
import {
  getCajas,
  getSesionesCaja,
  insertCaja,
  insertSesionCaja,
} from "../integrations/mysql/caja";
import {
  CashRegisterInsert,
  CashRegisterSelect,
  CashSessionInsert,
  CashSessionSelect,
} from "../types/mysqltypes";

export const getSesionCajaFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sesion = await getSesionCaja();
    return { success: true, data: sesion };
  } catch (error) {
    console.error("❌ [ServerFn] Error obteniendo sesión de caja:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnCajasGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: CashRegisterSelect[] = await getCajas();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnCajasGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnCajaInsert = createServerFn({ method: "POST" })
  .validator((data: CashRegisterInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertCaja(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnCajaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnSesionesCajaGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: CashSessionSelect[] = await getSesionesCaja();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnSesionesCajaGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnSesionCajaInsert = createServerFn({ method: "POST" })
  .validator((data: CashSessionInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertSesionCaja(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnSesionCajaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnUpdateSesionCaja = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      status: "abierta" | "cerrada";
      closed_at?: Date;
      expected_amount?: number;
      declared_amount?: number;
      difference?: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    try {
      const result = await updateSesionCaja(data.id, {
        status: data.status,
        ...(data.closed_at !== undefined && { closed_at: data.closed_at }),
        ...(data.expected_amount !== undefined && { expected_amount: data.expected_amount }),
        ...(data.declared_amount !== undefined && { declared_amount: data.declared_amount }),
        ...(data.difference !== undefined && { difference: data.difference }),
      });
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnUpdateSesionCaja] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
