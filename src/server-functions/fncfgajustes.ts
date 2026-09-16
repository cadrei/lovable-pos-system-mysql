import { createServerFn } from "@tanstack/react-start";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { SystemSetting } from "../types/genericTypes";

const GENERIC_TYPES_PATH = resolve(process.cwd(), "src/types/genericTypes.ts");

/**
 * Persiste un nuevo SystemSetting agregándolo al arreglo defaultSystemSettings
 * en src/types/genericTypes.ts. Persistencia simulada por archivo (no hay tabla MySQL).
 */
export const fnCfgAjustePersist = createServerFn({ method: "POST" })
  .validator((data: SystemSetting) => data)
  .handler(async ({ data }) => {
    try {
      console.log("🔵 [fnCfgAjustePersist] Persistiendo ajuste:", data.key);
      const contenido = await readFile(GENERIC_TYPES_PATH, "utf-8");
      const marca = "export const defaultSystemSettings: SystemSetting[] = [";
      const idx = contenido.indexOf(marca);
      if (idx === -1) {
        throw new Error("No se encontró defaultSystemSettings en genericTypes.ts");
      }
      const cierreRel = contenido.indexOf("];", idx);
      if (cierreRel === -1) {
        throw new Error("No se pudo localizar el cierre del arreglo defaultSystemSettings");
      }
      const nuevaEntrada = `  { key: "${data.key}", value: "${data.value}", description: "${data.description ?? ""}" },\n`;
      // Insertar antes del cierre del arreglo
      const antes = contenido.slice(0, cierreRel);
      const despues = contenido.slice(cierreRel);
      const actualizado = `${antes}${nuevaEntrada}${despues}`;
      await writeFile(GENERIC_TYPES_PATH, actualizado, "utf-8");
      console.log(`✅ [fnCfgAjustePersist] Ajuste ${data.key} agregado a genericTypes.ts`);
      return { success: true, data: 1 };
    } catch (error) {
      console.error("❌ [fnCfgAjustePersist] Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
