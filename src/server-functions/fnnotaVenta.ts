import { createServerFn } from "@tanstack/react-start";
import {
  deleteNotaVenta,
  getNotasVenta,
  insertNotaVenta,
  updateNotaVenta,
} from "../integrations/mysql/notaVenta";
import { NotaVentaInsert, NotaVentaSelect } from "../types/mysqltypes";

export const fnNotasVentaGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: NotaVentaSelect[] = await getNotasVenta();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnNotasVentaGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnNotaVentaInsert = createServerFn({ method: "POST" })
  .validator((data: NotaVentaInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertNotaVenta(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnNotaVentaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnNotaVentaUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: number; nota: Partial<NotaVentaInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateNotaVenta(data.id, data.nota);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnNotaVentaUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnNotaVentaDelete = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteNotaVenta(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnNotaVentaDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
