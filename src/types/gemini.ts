export interface GeminiRequestBody {
  contents: {
    role: "user" | "system" | "assistant";
    parts: { text: string }[];
  }[];
  generationConfig?: {
    thinkingConfig?: {
      thinkingBudget?: number;
    };
    temperature?: number;
  };
}

// Helper para construir el body
export function buildGeminiBody(
  prompt: string,
  options?: { temperature?: number; thinkingBudget?: number },
): GeminiRequestBody {
  return {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      thinkingConfig: {
        thinkingBudget: options?.thinkingBudget ?? 0, // por defecto desactiva razonamiento
      },
      temperature: options?.temperature ?? 0.1, // por defecto respuestas consistentes
    },
  };
}
