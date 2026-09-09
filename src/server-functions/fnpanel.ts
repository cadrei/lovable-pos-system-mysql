import { createServerFn } from "@tanstack/react-start";
import { getPanelData } from "../integrations/mysql/panel";

export const panelFn = createServerFn({ method: "POST" }) // ✅ cambiamos a POST para enviar sucursalId
  .validator((data: { sucursalId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await getPanelData(data.sucursalId);
      return { success: true, data: result };
    } catch (err) {
      console.error("❌ [Panel] Error:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      };
    }
  });
