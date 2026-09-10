import { createServerFn } from "@tanstack/react-start";
import { deleteMarca, getMarcas, insertMarca, updateMarca } from "../integrations/mysql/marcas";
import { MarcaInsert, MarcaSelect } from "../types/mysqltypes";

export const fnMarcasGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: MarcaSelect[] = await getMarcas();
    const marcas = data.map((m) => ({
      id: m.ID_MARCA,
      name: m.NOMBRE,
      active: m.ESTADO === "A",
      estado: m.ESTADO,
      description: m.DESCRIPCION ?? "",
      createdAt: m.FECHA_CREACION,
      updatedAt: m.FECHA_ACTUALIZACION,
    }));
    return { success: true, data: marcas };
  } catch (error) {
    console.error("❌ [fnMarcasGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnMarcaInsert = createServerFn({ method: "POST" })
  .validator((data: MarcaInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertMarca(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnMarcaInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnMarcaUpdate = createServerFn({ method: "POST" })
  .validator((data: { id: number; marca: Partial<MarcaInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateMarca(data.id, data.marca);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnMarcaUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnMarcaDelete = createServerFn({ method: "POST" })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteMarca(data.id);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnMarcaDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
