import { GoogleGenerativeAI } from "@google/generative-ai";
import { InferSelectModel } from "drizzle-orm";
import { prompts } from "@/db/schema";

type Prompt = InferSelectModel<typeof prompts>;

export class GeminiService {
    private genAI: GoogleGenerativeAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not defined");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateWithSystemPromptTemplate(
        prompt: Prompt,
        systemPromptTemplate: string,
        content: string,
        mediaBase64?: string,
        mimeType?: string
    ): Promise<string> {
        const model = this.genAI.getGenerativeModel({
            model: prompt.model,
            systemInstruction: systemPromptTemplate,
            generationConfig: prompt.modelConfig as any,
        });

        const parts: any[] = [{ text: content }];

        if (mediaBase64 && mimeType) {
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: mediaBase64,
                },
            });
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        return response.text();
    }
}

export const geminiService = new GeminiService();
