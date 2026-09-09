import { createServerFn } from "@tanstack/react-start";
import { getClientes } from "../integrations/mysql/clientes";

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
