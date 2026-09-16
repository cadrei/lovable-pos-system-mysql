import { createServerFn } from "@tanstack/react-start";
import {
  deleteEmpleado,
  getEmpleados,
  insertEmpleado,
  updateEmpleado,
} from "../integrations/mysql/empleados";
import { EmpleadoInsert, EmpleadoSelect } from "../types/mysqltypes";

export const fnEmpleadosGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: EmpleadoSelect[] = await getEmpleados();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnEmpleadosGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnEmpleadoInsert = createServerFn({ method: "POST" })
  .validator((data: EmpleadoInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertEmpleado(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnEmpleadoInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnEmpleadoUpdate = createServerFn({ method: "POST" })
  .validator((data: { idEmpleado: number; empleado: Partial<EmpleadoInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateEmpleado(data.idEmpleado, data.empleado);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnEmpleadoUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnEmpleadoDelete = createServerFn({ method: "POST" })
  .validator((data: { idEmpleado: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteEmpleado(data.idEmpleado);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnEmpleadoDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
