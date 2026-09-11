import { createServerFn } from "@tanstack/react-start";
import { buildGeminiBody } from "@/types/gemini";

type GeminiRequest = { prompt: string };
type GeminiResponse = { output: string };

export const consultarGemini = createServerFn({ method: "POST" })
  .validator((data: GeminiRequest): GeminiRequest => data)
  .handler(async ({ data }): Promise<GeminiResponse> => {
    const prompt = data?.prompt;
    if (!prompt) {
      console.error("❌ No se recibió prompt en la request");
      return { output: "No se recibió prompt" };
    }

    const callGemini = async (model: string, lite: boolean = false): Promise<GeminiResponse> => {
      console.log(`🌐 Invocando al modelo ${model} con prompt:`, prompt);

      const body = buildGeminiBody(prompt, {
        temperature: 0.1,
        lite,
        ...(lite ? {} : { thinkingBudget: 0 }),
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env["GEMINI_API_KEY"]}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const dataGemini = await response.json();
      console.log(`📦 Data cruda de ${model}:`, JSON.stringify(dataGemini, null, 2));
      if (dataGemini?.error) {
        console.error(`❌ Error en modelo ${model}:`, dataGemini.error);
        return { output: "" };
      }
      const output = dataGemini?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      console.log(`📝 Respuesta exitosa de ${model}:`, output.slice(0, 100) + "...");
      return { output };
    };
    // 1️⃣ Intento con gemini-flash-latest (normal)
    let result = await callGemini("gemini-flash-latest");

    // 2️⃣ Fallback automático con gemini-3.5-flash-lite
    if (!result.output) {
      console.log("⚠️ Fallback: intentando con gemini-3.5-flash-lite...");
      result = await callGemini("gemini-3.5-flash-lite", true);

      if (!result.output) {
        console.error("❌ Ambos modelos fallaron");
        return { output: "El modelo está saturado, intenta de nuevo más tarde." };
      }
    }

    return result;
  });
