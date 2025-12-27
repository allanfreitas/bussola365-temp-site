import { inngest } from "@/inngest/client";
import { db } from "@/db";
import {
    messages,
    prompts,
    categories,
    transactions,
    messageLogs,
    walletMembers,
    wallets,
    profiles
} from "@/db/schema";
import { geminiService } from "@/services/gemini-service";
import { walletService } from "@/services/wallet-service";
import { eq, and } from "drizzle-orm";

export const transactionBuilder = inngest.createFunction(
    { id: "transaction-builder" },
    { event: "message.routed" },
    async ({ event, step }) => {
        const { messageId } = event.data;

        // 1. Fetch Message
        const message = await step.run("fetch-message", async () => {
            const result = await db.query.messages.findFirst({
                where: eq(messages.id, messageId),
                with: {
                    attachments: true,
                },
            });
            if (!result) throw new Error(`Message ${messageId} not found`);
            return result;
        });

        // 2. Fetch Prompt & Categories
        const { prompt, categoriesList } = await step.run("fetch-context", async () => {
            const prompt = await db.query.prompts.findFirst({
                where: and(
                    eq(prompts.type, "transaction_builder"),
                    eq(prompts.active, 1)
                ),
            });

            if (!prompt) throw new Error("Transaction Builder Prompt not found");

            const categoriesList = await db.query.categories.findMany();
            return { prompt, categoriesList };
        });

        // 3. Prepare Prompt Templates
        const systemTemplate = await step.run("prepare-prompt", async () => {
            const receitas = categoriesList
                .filter((c) => c.typeId === 1)
                .map((c) => `${c.id} = ${c.name} (${c.description})`)
                .join("\n      ");

            const despesas = categoriesList
                .filter((c) => c.typeId === 2)
                .map((c) => `${c.id} = ${c.name} (${c.description})`)
                .join("\n      ");

            return prompt.systemInstruction
                .replace(":receitas_list", receitas)
                .replace(":despesas_list", despesas);
        });

        const userContent = await step.run("prepare-content", async () => {
            const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            return prompt.userTemplate
                .replace(":data_atual", date)
                .replace(":conteudo_usuario", message.content || "");
        });

        // 4. Call AI
        const aiResponse = await step.run("call-ai", async () => {
            // Inngest serializes Dates to strings, so we cast prompt to any or fix types
            return await geminiService.generateWithSystemPromptTemplate(
                prompt as any,
                systemTemplate,
                userContent
            );
        });

        // 5. Parse Response
        const transactionData = await step.run("parse-response", async () => {
            // Regex adapted for UUIDs in category (c:[^,]+)
            const regex = /v:(-?\d+),c:([^,]+),d:(.+),o:(\d{4}-\d{2}-\d{2}),s:([\d.]+),j:(.+)/;
            const match = aiResponse.match(regex);

            if (!match) {
                throw new Error(`Failed to parse AI response: ${aiResponse}`);
            }

            return {
                amountCents: parseInt(match[1]),
                categoryId: match[2],
                description: match[3],
                occurredAt: match[4], // Keep as string to avoid double serialization confusion, convert later
                score: parseFloat(match[5]), // intent score
                justification: match[6]
            };
        });

        // 6. Resolve Wallet & Profile
        const { walletId, profileId } = await step.run("resolve-wallet", async () => {
            const profile = await db.query.profiles.findFirst({
                where: eq(profiles.phoneNumber, message.senderId)
            });

            if (!profile) throw new Error(`Profile not found for phone ${message.senderId}`);

            // Ensure wallet exists
            const walletId = await walletService.ensureWalletForProfile(profile.id, profile.displayName || "Minha Carteira");

            return { walletId, profileId: profile.id };
        });

        // 7. Insert Transaction
        const transactionId = await step.run("create-transaction", async () => {
            // Find category to get typeId
            const category = categoriesList.find(c => c.id === transactionData.categoryId);
            const typeId = category ? category.typeId : 0;

            const [inserted] = await db.insert(transactions).values({
                walletId,
                profileId,
                categoryId: transactionData.categoryId,
                amountCents: transactionData.amountCents,
                typeId,
                description: transactionData.description,
                transactionDate: new Date(transactionData.occurredAt),
                messageId: message.id,
            }).returning({ id: transactions.id });

            return inserted.id;
        });

        // 8. Update Message Status & Create Log
        await step.run("finalize-processing", async () => {
            await db.update(messages)
                .set({ statusId: 3 }) // ROUTED (Enum value 3)
                .where(eq(messages.id, messageId));

            await db.insert(messageLogs).values({
                messageId,
                step: "transaction_building",
                description: "Transaction built successfully",
                metadata: transactionData,
                statusId: 3,
                startedAt: new Date(), // Placeholder
                finishedAt: new Date(),
            });
        });

        // 9. Trigger Response Job
        await step.sendEvent("trigger-response", {
            name: "transaction.created",
            data: {
                transactionId,
                messageId,
                walletId: walletId
            }
        });

        return { transactionId };
    }
);
