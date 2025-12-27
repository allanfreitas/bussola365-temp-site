import { db } from "@/db";
import {
    messages,
    prompts,
    messageIntents,
    messageLogs,
    profiles
} from "@/db/schema";
// import { transcribeService } from "@/services/transcribe-service";
import { geminiService } from "@/services/gemini-service";
import { walletService } from "@/services/wallet-service";
import { eq, and } from "drizzle-orm";

export class MessageRouterService {
    async execute(messageId: string): Promise<any> {
        console.log(`Processing intent for message ${messageId}`);

        const message = await db.query.messages.findFirst({
            where: eq(messages.id, messageId),
            with: { attachments: true }
        });

        if (!message) {
            console.error(`Message ${messageId} not found`);
            return;
        }

        if (message.senderId) {
            const profile = await db.query.profiles.findFirst({
                where: eq(profiles.phoneNumber, message.senderId)
            });
            if (profile) {
                await walletService.ensureWalletForProfile(profile.id, profile.displayName || "Pessoal");
            }
        }

        if ((message.messageType === "audio" || (message.messageType === "voice")) && !message.content) {
            // TODO: message.content = await transcribeService.execute(message);
            // message.content = "Gastei 50 reais no almoco"; // Mock
        }

        try {
            const intentResult = await this.getIntention(message);

            // 4. Update Message
            if (intentResult.intentId === "-1" || intentResult.intentId === "unknown") {
                await db.update(messages).set({ statusId: 9 }).where(eq(messages.id, messageId)); // FAILED
                return;
            }

            await db.update(messages).set({
                intentId: intentResult.intentId, // UUID Need to fetch the ID from DB based on integer ID? 
                // Wait, In .NET Intent was an Integer ID matching an Enum/Table ID.
                // In Drizzle Schema `messageIntents.id` is UUID.
                // The AI returns an integer ID (e.g., 1=Transaction).
                // We need to map that integer ID to the UUID of the intent in the DB.
                // For now, let's assume we fetch the intent by name or store the integer ID in `active` or description?
                // The prompt injection `:intents` uses `row.Id` (UUID) in Drizzle?
                // Let's check `getIntention` implementation below.
                intentScore: intentResult.score,
                statusId: 2, // INTENT_PROCESSED
                updatedAt: new Date()
            }).where(eq(messages.id, messageId));

            // Log
            await db.insert(messageLogs).values({
                messageId,
                step: "intent_processing",
                description: "Message routed",
                metadata: intentResult,
                statusId: 2,
                startedAt: new Date(),
                finishedAt: new Date()
            });

            return {
                messageId,
                intentId: intentResult.intentId,
                isTransaction: intentResult.intentId !== "unknown" // Logic to decide if it triggers transaction builder. 
                // Need to know which Intent ID corresponds to "Transaction Builder".
                // Assuming we will configure specific Intents to map to events.
                // For now, let's pass the info back.
                // The score also matters.
            };

        } catch (error: any) {
            console.error("Error routing message:", error);
            await db.update(messages).set({ statusId: 9 }).where(eq(messages.id, messageId)); // FAILED

            await db.insert(messageLogs).values({
                messageId,
                step: "intent_processing",
                description: "Error routing message",
                errorMessage: error.message,
                statusId: 9,
                startedAt: new Date(),
                finishedAt: new Date()
            });
            throw error;
        }
    }

    private async getIntention(message: any): Promise<{ intentId: string; score: number; intentInt: number }> {
        const prompt = await db.query.prompts.findFirst({
            where: and(
                eq(prompts.type, "ai_router"),
                eq(prompts.active, 1)
            )
        });

        if (!prompt) throw new Error("AI_ROUTER prompt not found");

        const availableIntents = await db.query.messageIntents.findMany({
            where: eq(messageIntents.active, 1)
        });

        // Map integer (from .NET legacy or just index) to UUID
        // The Prompt expects "ID = Name (Description)".
        // We can just use the UUID as the ID in the prompt, or map an index.
        // Using UUID might be long for the AI but it's precise.
        // Let's use UUID.

        const intentsList = availableIntents
            .map(i => `${i.id} = ${i.name} (${i.description})`)
            .join("\n");

        const systemTemplate = prompt.systemInstruction.replace(":intents", intentsList);
        const date = new Date().toISOString().split("T")[0];
        const userContent = prompt.userTemplate
            .replace(":data_atual", date)
            .replace(":conteudo_usuario", message.content || "");

        const aiResponse = await geminiService.generateWithSystemPromptTemplate(
            prompt as any,
            systemTemplate,
            userContent
        );

        // Expected format: JSON or specific string?
        // .NET used `IntentResponse.Create(textResponse.Trim())` which might have parsed JSON or regex.
        // The `geminiService` usage in `transaction-builder` used regex.
        // Let's assume standard JSON response if configured, or Regex.

        // Simulating Regex or JSON parse.
        // Assuming AI returns JSON: { "intent": "UUID", "score": 0.9, "justification": "..." }
        try {
            // Try parsing JSON first (if AI is good)
            const cleaned = aiResponse.replace(/```json/g, "").replace(/```/g, "");
            const parsed = JSON.parse(cleaned);
            return {
                intentId: parsed.intent, // UUID
                score: parsed.score,
                intentInt: 0 // Legacy
            };
        } catch (e) {
            // Fallback Regex?
            console.error("Failed to parse JSON intent:", aiResponse);
            throw new Error("Failed to parse Intent");
        }
    }
}

export const messageRouterService = new MessageRouterService();
