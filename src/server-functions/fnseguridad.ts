import { createServerFn } from "@tanstack/react-start";
import { getRolesSeguridad } from "../integrations/mysql/seguridad";
import { SeguridadRolSelect } from "../types/mysqltypes";

export const fnRolesSeguridadGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: SeguridadRolSelect[] = await getRolesSeguridad();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnRolesSeguridadGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});
