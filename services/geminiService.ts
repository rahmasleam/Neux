import { GoogleGenAI, Modality } from "@google/genai";
import { ChatMessage } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSummary = async (text: string, lang: 'en' | 'ar'): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI Service Unavailable (Missing Key)";

  try {
    const prompt = lang === 'ar' 
      ? `لخّص النص التقني التالي في 3 نقاط رئيسية باللغة العربية:\n\n${text}`
      : `Summarize the following tech content into 3 concise bullet points:\n\n${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Error generating summary.";
  }
};

export const translateText = async (text: string, targetLang: 'en' | 'ar'): Promise<string> => {
    const ai = getClient();
    if (!ai) return text;
  
    try {
      const prompt = `Translate the following text to ${targetLang === 'ar' ? 'Arabic' : 'English'}. Keep technical terms accurate:\n\n${text}`;
  
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
  
      return response.text || text;
    } catch (error) {
      console.error("Gemini Translation Error:", error);
      return text;
    }
  };

export const analyzeMarketData = async (dataContext: string): Promise<string> => {
    const ai = getClient();
    if (!ai) return "AI Analysis Unavailable";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a financial analyst specializing in Egyptian and Global tech markets. Analyze this data snapshot and give 2 sentences of insight:\n${dataContext}`,
        });
        return response.text || "No insights available.";
    } catch (e) {
        return "Could not analyze market data.";
    }
}

export const generateSpeech = async (text: string): Promise<string | null> => {
    const ai = getClient();
    if (!ai) return null;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;

        // Convert base64 to blob url for audio element
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/pcm' }); // Note: Raw PCM often needs decoding, but for simple playback in some contexts we might need WAV container. 
        // *Correction for Browser Playback*: Browsers cannot play raw PCM via <audio src>. 
        // We will return the base64 string and handle it or assume the environment supports it, 
        // BUT for a guaranteed web app without complex AudioContext logic in the component, 
        // let's return null if we can't easily make a WAV header.
        // HOWEVER, to keep it simple as per instructions, we will return the base64 and use a helper to play it if possible, 
        // or just return the text saying "Audio Generated" if playback is complex.
        
        // Actually, let's use the AudioContext approach in the component, so we return the base64 string.
        return base64Audio;

    } catch (error) {
        console.error("Gemini TTS Error:", error);
        return null;
    }
}

export const sendMessageToAssistant = async (
  history: ChatMessage[], 
  newMessage: string,
  contextData?: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "I'm sorry, I cannot connect to the AI service right now. Please check your API key.";

  try {
    const systemInstruction = `You are NexusMena AI, a specialized assistant for the NexusMena tech platform. 
    You have access to Global and Egyptian tech news, startups, events, and market data.
    Your goal is to help users find information within the platform, summarize articles, or explain complex tech/financial concepts.
    Be concise, professional, and helpful. 
    If provided with Context Data, prioritize that information.
    Answer in the language the user speaks (English or Arabic).`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    let messageToSend = newMessage;
    if (contextData) {
        messageToSend = `[Context from current page: ${contextData}]\n\nUser Question: ${newMessage}`;
    }

    const result = await chat.sendMessage({ message: messageToSend });
    return result.text;

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I encountered an error processing your request.";
  }
};
