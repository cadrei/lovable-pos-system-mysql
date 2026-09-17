import { createServerFn } from "@tanstack/react-start";
import { validateSessionToken } from "../integrations/mysql/auth";

export const fnSessionValidate = createServerFn({ method: "POST" })
  .validator((data: { userId: number; sessionToken: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data?.userId || !data?.sessionToken) {
        return {
          success: false,
          error: "userId y sessionToken son obligatorios",
        };
      }
      const isValid = await validateSessionToken(data.userId, data.sessionToken);
      return { success: true, data: { isValid } };
    } catch (error) {
      console.error("❌ [fnSessionValidate] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
