import { createServerFn } from "@tanstack/react-start";
import { clearSessionToken } from "../integrations/mysql/auth";

export const fnSessionClearBackend = createServerFn({ method: "POST" })
  .validator((data: { userId: number }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data?.userId) {
        return {
          success: false,
          error: "userId es obligatorio",
        };
      }
      await clearSessionToken(data.userId);
      return { success: true, data: true };
    } catch (error) {
      console.error("❌ [fnSessionClearBackend] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
