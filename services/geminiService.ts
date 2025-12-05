import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTravelTip = async (): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "Dica do dia: Chegue 5 minutos antes para garantir tranquilidade!";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Escreva uma dica curta, útil e motivadora de 1 frase para um passageiro que vai fazer uma viagem de carro executivo em Jaraguá do Sul. Fale sobre conforto, segurança ou a beleza da cidade.',
    });

    return response.text || "Viaje com segurança e conforto sempre.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Dica: Mantenha seu cinto de segurança afivelado durante toda a viagem.";
  }
};