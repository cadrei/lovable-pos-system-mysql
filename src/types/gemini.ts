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

// Para modelos lite (sin razonamiento)
export interface GeminiLiteRequestBody {
  contents: {
    role: "user" | "system" | "assistant";
    parts: { text: string }[];
  }[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

// Helper para construir el body
export function buildGeminiBody(
  prompt: string,
  options?: { temperature?: number; thinkingBudget?: number; lite?: boolean },
): GeminiRequestBody | GeminiLiteRequestBody {
  const base = {
    contents: [
      {
        role: "user" as const,
        parts: [{ text: prompt }],
      },
    ],
  };
  if (options?.lite) {
    // Lite: sin thinkingConfig
    return {
      ...base,
      generationConfig: {
        temperature: options?.temperature ?? 0.1,
        maxOutputTokens: 512,
      },
    };
  }
  // Normal: incluye thinkingConfig
  return {
    ...base,
    generationConfig: {
      thinkingConfig: {
        thinkingBudget: options?.thinkingBudget ?? 0,
      },
      temperature: options?.temperature ?? 0.1,
    },
  };
}
