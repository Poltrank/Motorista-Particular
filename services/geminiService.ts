import { GoogleGenAI } from "@google/genai";

export const generateTravelTip = async (): Promise<string> => {
  try {
    let apiKey = '';

    // 1. Try resolving via Vite/Modern standard (import.meta.env)
    try {
      // @ts-ignore - ignore TS error for import.meta if config is strict
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
        // @ts-ignore
        apiKey = import.meta.env.VITE_API_KEY;
      }
    } catch (e) {
      // Ignore errors if import.meta doesn't exist
    }

    // 2. Try resolving via Node/Webpack standard (process.env)
    if (!apiKey) {
      try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
          apiKey = process.env.API_KEY;
        }
      } catch (e) {
        // Ignore errors if process is not defined
      }
    }

    // Check if key was found
    if (!apiKey) {
      console.warn("Gemini API Key not found in environment variables. Using fallback.");
      return "Dica do dia: Chegue 5 minutos antes para garantir tranquilidade!";
    }

    // Initialize only if we have a key and inside the async function
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Escreva uma dica curta, útil e motivadora de 1 frase para um passageiro que vai fazer uma viagem de carro executivo em Jaraguá do Sul. Fale sobre conforto, segurança ou a beleza da cidade.',
    });

    return response.text || "Viaje com segurança e conforto sempre.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a safe fallback so the UI doesn't break or show white screen
    return "Dica: Mantenha seu cinto de segurança afivelado durante toda a viagem.";
  }
};