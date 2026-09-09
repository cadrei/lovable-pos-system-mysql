import { createServerFn } from "@tanstack/react-start";
import { getClientes } from "../integrations/mysql/clientes";
import {
  deleteCliente,
  getClientesDetalle,
  insertCliente,
  updateCliente,
} from "../integrations/mysql/clientes";
import { ClienteInsert, ClienteSelect } from "../types/mysqltypes";

export const getClientesFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await getClientes();
    // devolvemos solo los campos que necesita el POS
    const clientes = data.map((c) => ({
      id: c.ID_CLIENTE,
      code: c.ID_DOCUMENTO,
      name: c.NOMBRES,
      email: c.EMAIL,
      phone: c.TELEFONO,
      address: c.DIRECCION,
    }));
    return { success: true, data: clientes };
  } catch (error) {
    console.error("❌ [fnclientes] Error en clientes:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
});

export const fnClientesDetalleGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: ClienteSelect[] = await getClientesDetalle();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnClientesDetalleGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnClienteInsert = createServerFn({ method: "POST" })
  .validator((data: ClienteInsert) => data)
  .handler(async ({ data }) => {
    try {
      const result = await insertCliente(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnClienteInsert] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnClienteUpdate = createServerFn({ method: "POST" })
  .validator((data: { idCliente: number; cliente: Partial<ClienteInsert> }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await updateCliente(data.idCliente, data.cliente);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnClienteUpdate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });

export const fnClienteDelete = createServerFn({ method: "POST" })
  .validator((data: { idCliente: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await deleteCliente(data.idCliente);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ [fnClienteDelete] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
