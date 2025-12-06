import { GoogleGenAI } from "@google/genai";

// Safely retrieve API key to prevent "process is not defined" errors in browser environments
const getApiKey = () => {
  try {
    // Check for Node/Webpack environment (standard for Vercel/CRA)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (error) {
    console.warn("Environment variable access check failed.");
  }
  return '';
};

export const generateTravelTip = async (): Promise<string> => {
  try {
    const apiKey = getApiKey();

    // If no key is present, fallback immediately without calling API to avoid errors
    if (!apiKey) {
      console.log("No API Key found, using fallback tip.");
      return "Dica do dia: Chegue 5 minutos antes para garantir tranquilidade!";
    }

    // Initialize inside the function to prevent crash on load
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Escreva uma dica curta, útil e motivadora de 1 frase para um passageiro que vai fazer uma viagem de carro executivo em Jaraguá do Sul. Fale sobre conforto, segurança ou a beleza da cidade.',
    });

    return response.text || "Viaje com segurança e conforto sempre.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a safe fallback so the UI doesn't break
    return "Dica: Mantenha seu cinto de segurança afivelado durante toda a viagem.";
  }
};