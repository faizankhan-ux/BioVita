import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateHealthAdvice = async (prompt: string) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are a professional and empathetic AI Health Assistant named BioVita AI.
    Your goal is to provide helpful, accurate, and easy-to-understand health information.
    
    CRITICAL RULES:
    1. ALWAYS include a medical disclaimer: "Disclaimer: I am an AI, not a doctor. This information is for educational purposes only and should not replace professional medical advice. If you are experiencing a medical emergency, call your local emergency services immediately."
    2. Do NOT provide definitive diagnoses. Use phrases like "This could be related to..." or "It's common for these symptoms to be associated with...".
    3. Encourage users to consult with a healthcare professional for any persistent or serious concerns.
    4. Be concise but thorough.
    5. Use Markdown for formatting (bullet points, bold text, etc.).
    6. If the user mentions self-harm or severe distress, provide resources like the National Suicide Prevention Lifeline.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating health advice:", error);
    throw new Error("Failed to get a response from the AI. Please try again later.");
  }
};

export const startHealthChat = (history: { role: "user" | "model"; parts: { text: string }[] }[]) => {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `
        You are BioVita AI, a smart health assistant. 
        Provide empathetic, accurate health guidance. 
        Always include the medical disclaimer in your first response or when giving specific advice.
        Focus on wellness, symptom explanation, and healthy living.
      `,
    },
    history,
  });
};
