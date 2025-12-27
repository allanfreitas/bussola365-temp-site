import { db } from "@/db";
import {
    messages,
    prompts,
    categories,
    transactions,
    messageLogs,
    walletMembers,
    profiles
} from "@/db/schema";
import { geminiService } from "@/services/gemini-service";
import { walletService } from "@/services/wallet-service";
import { eq, and } from "drizzle-orm";

export class TransactionBuilderService {
    async execute(messageId: string): Promise<{ transactionId: string; walletId: string }> {
        // 1. Fetch Message
        const message = await db.query.messages.findFirst({
            where: eq(messages.id, messageId),
            with: {
                attachments: true,
            },
        });
        if (!message) throw new Error(`Message ${messageId} not found`);

        // 2. Fetch Prompt & Categories
        const prompt = await db.query.prompts.findFirst({
            where: and(
                eq(prompts.type, "transaction_builder"),
                eq(prompts.active, 1)
            ),
        });

        if (!prompt) throw new Error("Transaction Builder Prompt not found");

        const categoriesList = await db.query.categories.findMany();

        // 3. Prepare Prompt Templates
        const receitas = categoriesList
            .filter((c) => c.typeId === 1)
            .map((c) => `${c.id} = ${c.name} (${c.description})`)
            .join("\n      ");

        const despesas = categoriesList
            .filter((c) => c.typeId === 2)
            .map((c) => `${c.id} = ${c.name} (${c.description})`)
            .join("\n      ");

        const systemTemplate = prompt.systemInstruction
            .replace(":receitas_list", receitas)
            .replace(":despesas_list", despesas);

        const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const userContent = prompt.userTemplate
            .replace(":data_atual", date)
            .replace(":conteudo_usuario", message.content || "");

        // 4. Call AI
        // Cast prompt to any to bypass Date serialization type check if strictly typed
        const aiResponse = await geminiService.generateWithSystemPromptTemplate(
            prompt as any,
            systemTemplate,
            userContent
        );

        // 5. Parse Response
        // Regex adapted for UUIDs in category (c:[^,]+)
        const regex = /v:(-?\d+),c:([^,]+),d:(.+),o:(\d{4}-\d{2}-\d{2}),s:([\d.]+),j:(.+)/;
        const match = aiResponse.match(regex);

        if (!match) {
            throw new Error(`Failed to parse AI response: ${aiResponse}`);
        }

        const transactionData = {
            amountCents: parseInt(match[1]),
            categoryId: match[2],
            description: match[3],
            occurredAt: match[4],
            score: parseFloat(match[5]),
            justification: match[6]
        };

        // 6. Resolve Wallet & Profile
        const profile = await db.query.profiles.findFirst({
            where: eq(profiles.phoneNumber, message.senderId)
        });

        if (!profile) throw new Error(`Profile not found for phone ${message.senderId}`);

        // Ensure wallet exists
        const walletId = await walletService.ensureWalletForProfile(profile.id, profile.displayName || "Pessoal");

        // 7. Insert Transaction
        // Find category to get typeId
        const category = categoriesList.find(c => c.id === transactionData.categoryId);
        const typeId = category ? category.typeId : 0;

        const [inserted] = await db.insert(transactions).values({
            walletId,
            profileId: profile.id,
            categoryId: transactionData.categoryId,
            amountCents: transactionData.amountCents,
            typeId,
            description: transactionData.description,
            transactionDate: new Date(transactionData.occurredAt),
            messageId: message.id,
        }).returning({ id: transactions.id });

        // 8. Update Message Status & Create Log
        await db.update(messages)
            .set({ statusId: 3 }) // ROUTED (Enum value 3)
            .where(eq(messages.id, messageId));

        await db.insert(messageLogs).values({
            messageId,
            step: "transaction_building",
            description: "Transaction built successfully",
            metadata: transactionData,
            statusId: 3,
            startedAt: new Date(),
            finishedAt: new Date(),
        });

        return { transactionId: inserted.id, walletId };
    }
}

export const transactionBuilderService = new TransactionBuilderService();
