import { createServerFn } from "@tanstack/react-start";
import { clearSession, getSession, SessionData } from "../integrations/mysql/session";

export const fnSessionGet = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data: SessionData | null = await getSession();
    return { success: true, data };
  } catch (error) {
    console.error("❌ [fnSessionGet] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});

export const fnSessionClear = createServerFn({ method: "POST" }).handler(async () => {
  try {
    clearSession();
    return { success: true, data: true };
  } catch (error) {
    console.error("❌ [fnSessionClear] Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
});
