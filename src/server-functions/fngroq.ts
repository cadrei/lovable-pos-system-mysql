import { createServerFn } from "@tanstack/react-start";
import Groq from "groq-sdk";

// Inicializa el cliente Groq con tu API Key
const groq = new Groq({ apiKey: process.env["GROQ_API_KEY"] });

// Definimos el tipo de respuesta
type GroqResponse = {
  success: boolean;
  output?: string;
  error?: string;
};

export const consultaGroq = createServerFn({ method: "POST" })
  .validator((data: { prompt: string }) => data)
  .handler(async ({ data }): Promise<GroqResponse> => {
    try {
      const { prompt } = data;
      if (!prompt) {
        console.error("❌ No se recibió prompt en la request");
        return { success: true, output: "No se recibió prompt" };
      }
      console.log("🔵 [fngroq] Obteniendo modelos disponibles en Groq...");
      const modelsList = await groq.models.list();
      const models = modelsList.data.map((m) => m.id);
      //console.log("✅ [fngroq] Modelos disponibles:", models);
      // 👉 Prioridad: Qwen → GPT-OSS-20B → Allam-2-7B → fallback al primero
      const modelToUse: string | undefined =
        models.find((m) => m.toLowerCase().includes("qwen")) ??
        models.find((m) => m.toLowerCase().includes("gpt-oss")) ??
        models.find((m) => m.toLowerCase().includes("allam")) ??
        models[0];
      if (!modelToUse) {
        console.error("❌ [fngroq] No hay modelos disponibles");
        return { success: false, error: "No hay modelos disponibles" };
      }
      console.log("🔵 [fngroq] Usando modelo:", modelToUse);
      console.log("🔵 [fngroq] Enviando prompt a Groq:", prompt);
      const response = await groq.chat.completions.create({
        model: modelToUse,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000, // límite de salida
      });
      const resp = response.choices[0]?.message?.content ?? "";
      console.log(
        "✅ [fngroq] Respuesta recibida:",
        resp.slice(0, 50) + (resp.length > 50 ? "..." : ""),
      );
      return { success: true, output: resp };
    } catch (error) {
      console.error("❌ [fngroq] Error consultando Groq:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  });
