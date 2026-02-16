import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, AISuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model configuration
const MODEL_NAME = "gemini-3-flash-preview";

export const getProductDetails = async (productName: string): Promise<AISuggestion> => {
  try {
    const prompt = `Berikan detail untuk produk inventaris bernama: "${productName}". 
    Berikan deskripsi singkat (maksimal 20 kata), kategori yang sesuai (pilih dari: Elektronik, Pakaian, Makanan, Peralatan Rumah, Lainnya), dan estimasi harga dalam Rupiah (IDR) sebagai angka saja.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            estimatedPrice: { type: Type.NUMBER },
          },
          required: ["description", "category", "estimatedPrice"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AISuggestion;
  } catch (error) {
    console.error("Error fetching product details:", error);
    // Fallback data
    return {
      description: "Deskripsi tidak tersedia saat ini.",
      category: "Lainnya",
      estimatedPrice: 0
    };
  }
};

export const chatWithInventory = async (
  inventory: InventoryItem[], 
  userMessage: string,
  history: { role: "user" | "model", parts: { text: string }[] }[]
): Promise<string> => {
  // Summarize inventory for context (to avoid huge token usage if list is massive, we simplify)
  const inventorySummary = inventory.map(item => 
    `- ${item.name} (${item.category}): ${item.quantity} unit, Rp${item.price.toLocaleString()}`
  ).join("\n");

  const systemInstruction = `Anda adalah asisten manajemen inventaris yang cerdas.
  Anda memiliki akses ke data inventaris berikut:\n${inventorySummary}\n
  Jawab pertanyaan pengguna tentang stok, nilai total, saran restocking, atau analisis data. 
  Gunakan Bahasa Indonesia yang sopan dan profesional. Jawablah dengan ringkas.`;

  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "Maaf, saya tidak dapat memproses permintaan itu.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Terjadi kesalahan saat menghubungi AI.";
  }
};