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
      const prompt = `Translate the following text to ${targetLang === 'ar' ? 'Arabic' : 'English'}. Keep technical terms accurate and maintain the formatting (Markdown tables, lists, etc):\n\n${text}`;
  
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
        return base64Audio;

    } catch (error) {
        console.error("Gemini TTS Error:", error);
        return null;
    }
}

export const analyzePodcast = async (url: string): Promise<any> => {
    const ai = getClient();
    if (!ai) return null;

    try {
        const prompt = `
        Please perform a comprehensive analysis of the following podcast: ${url}. 

        I need you to:

        1. Summarize the key points and main themes of the podcast.

        2. Analyze the podcast based on the following metrics:

        o Depth of Information: Assess how thoroughly topics are covered.
        o Technical Level: Determine the complexity and technicality of the content.
        o Authenticity: Evaluate the credibility and reliability of the information presented.
        o Speakers' Expertise: Judge the expertise of the speakers based on their statements.
        o Contradictions: Identify any contradictions or inconsistencies in the content.
        o Clarity: Assess how clearly the information is communicated.
        o Engagement: Evaluate how engaging and interesting the podcast is.
        o Relevance: Determine how relevant the content is to current events or your interests.
        o Bias and Objectivity: Assess whether the podcast presents information in a balanced manner or if there is any noticeable bias.
        o Practical Applications: Identify any practical tips or actionable advice provided.
        o Pacing: Assess whether the podcast maintains a good pace or if it feels rushed or slow.
        o Emotional Impact: Note any emotional responses elicited by the podcast.
        o Originality: Evaluate the uniqueness of the content and perspectives offered.

        3. Include any other relevant metrics that would help in evaluating the podcast.

        4. Present your analysis in a structured format suitable for a table.

        5. Provide a final recommendation on whether I should listen to the full podcast or if the summary suffices, along with an overall rating out of 10.

        **OUTPUT FORMAT**:
        You must return a raw JSON object with this exact structure:
        {
            "podcastName": "string",
            "episodeTitle": "string",
            "score": number,
            "summary": "string (A concise paragraph summarizing the key points)",
            "metrics": [
                { "name": "Depth of Information", "finding": "string" },
                { "name": "Technical Level", "finding": "string" },
                { "name": "Authenticity", "finding": "string" },
                { "name": "Speakers' Expertise", "finding": "string" },
                { "name": "Contradictions", "finding": "string" },
                { "name": "Clarity", "finding": "string" },
                { "name": "Engagement", "finding": "string" },
                { "name": "Relevance", "finding": "string" },
                { "name": "Bias and Objectivity", "finding": "string" },
                { "name": "Practical Applications", "finding": "string" },
                { "name": "Pacing", "finding": "string" },
                { "name": "Emotional Impact", "finding": "string" },
                { "name": "Originality", "finding": "string" },
                { "name": "Additional Metrics", "finding": "string (Optional)" }
            ],
            "recommendation": "string (Final recommendation and rating reasoning)"
        }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}]
            }
        });

        let jsonText = response.text || "{}";
        jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        try {
            return JSON.parse(jsonText);
        } catch (e) {
            console.error("Failed to parse analysis JSON", e);
            // Fallback
            return {
                podcastName: "Analysis Failed",
                episodeTitle: "Error",
                score: 0,
                summary: "Could not generate structured analysis.",
                metrics: [],
                recommendation: "Please try again."
            };
        }

    } catch (error) {
        console.error("Deep Analysis Error:", error);
        return null;
    }
};

export const fetchLatestFromSource = async (url: string): Promise<any> => {
    const ai = getClient();
    if (!ai) return null;

    try {
        const prompt = `
        You are an intelligent Content Scraper/Fetcher.
        
        Target URL: ${url}
        
        YOUR MISSION:
        1. **ANALYZE URL**: 
           - Is this a "Collection" (YouTube Channel, Podcast RSS, Blog Home)? 
           - Or a "Specific Item" (Single Video, Article)?
           
        2. **IF COLLECTION (e.g. YouTube Channel)**:
           - Use Google Search to find the **LATEST SPECIFIC VIDEO/EPISODE** from this channel that matches topics: "AI", "Tech", "Startups", or "Entrepreneurship".
           - **CRITICAL**: The 'specificUrl' field in your output MUST be the direct link to that single video (e.g., https://www.youtube.com/watch?v=XYZ), NOT the channel URL.
           
        3. **IF SPECIFIC ITEM**: Use the provided URL as the 'specificUrl'.

        4. **EXTRACT DETAILS**:
           - Title: Full title of the specific item.
           - Description: 2 sentence summary.
           - SummaryPoints: Extract 5 key takeaways or timestamps with topics.
           - Duration: Estimate duration (e.g. "25 min") if audio/video.
           - Date: YYYY-MM-DD.
           - Category: Suggest one of ['latest', 'startup', 'podcasts', 'events'].
        
        5. **OUTPUT FORMAT**:
           Return ONLY a raw JSON string (no markdown formatting) with this structure:
           {
               "title": "string",
               "description": "string",
               "source": "string",
               "specificUrl": "https://valid-link...", 
               "date": "YYYY-MM-DD",
               "category": "string",
               "duration": "string",
               "summaryPoints": ["point 1", "point 2", "point 3"]
           }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}] 
            }
        });

        let jsonText = response.text || "{}";
        jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const parsed = JSON.parse(jsonText);
            return parsed;
        } catch (e) {
            console.error("JSON Parse Failed", e);
            const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return null;
        }

    } catch (error) {
        console.error("Smart Fetch Error:", error);
        return null;
    }
};

export const getArticleContent = async (url: string): Promise<string> => {
    const ai = getClient();
    if (!ai) return "AI Service Unavailable";

    try {
        const prompt = `
        Please access and read the article at the following URL: ${url}
        
        Task:
        1. Extract the full textual content of the article.
        2. Return it formatted in clean Markdown.
        3. Do not summarize. Provide the comprehensive details, headers, and sections as they appear in the original text.
        4. If the content is very long, provide a highly detailed structured version that covers all information.
        
        Output: Markdown text only.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}]
            }
        });

        return response.text || "Could not retrieve article content.";
    } catch (error) {
        console.error("Article Extraction Error:", error);
        return "Error extracting article content.";
    }
};

export const reviewContent = async (data: any): Promise<any> => {
    const ai = getClient();
    if (!ai) return null;

    try {
        const prompt = `
        You are an expert editor for a Tech & Startup aggregator platform.
        Review the following content submission.
        
        Input Data:
        Title/Name: ${data.title || data.name}
        Description: ${data.description}
        Category: ${data.category || data.type}

        1. Fix any grammar issues.
        2. Make the title more catchy and professional.
        3. Make the description concise and impactful (max 2 sentences).
        4. Provide a brief feedback message explaining your changes.

        Return ONLY a JSON object with this structure:
        {
            "improvedTitle": "string",
            "improvedDescription": "string",
            "feedback": "string"
        }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Content Review Error:", error);
        return null;
    }
};

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