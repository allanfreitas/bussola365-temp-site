import { db } from "@/db";
import { messages, transactions, categories, messageTemplates, messageLogs } from "@/db/schema";
import { eq, sum } from "drizzle-orm";
import { WhatsAppService } from "@/services/WhatsAppService";

export class ResponseService {
    async execute(messageId: string, transactionId: string, walletId: string): Promise<void> {
        const message = await db.query.messages.findFirst({ where: eq(messages.id, messageId) });
        const transaction = await db.query.transactions.findFirst({ where: eq(transactions.id, transactionId) });

        if (!transaction || !message) throw new Error("Data not found");

        const category = await db.query.categories.findFirst({ where: eq(categories.id, transaction.categoryId!) });
        const template = await db.query.messageTemplates.findFirst({ where: eq(messageTemplates.template, "transaction_success") });

        // Calculate Balance
        const balanceResult = await db
            .select({ total: sum(transactions.amountCents) })
            .from(transactions)
            .where(eq(transactions.walletId, walletId));

        const currentBalance = Number(balanceResult[0]?.total || 0);

        let responseText = "Transação registrada com sucesso!"; // Fallback

        if (template) {
            const isExpense = category?.typeId === 2;
            const emoji = isExpense ? "📉" : "📈";
            const amount = (transaction.amountCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            const balance = (currentBalance / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            const occurredAt = new Date(transaction.transactionDate!).toLocaleDateString("pt-BR");

            responseText = template.content
                .replace("{{emoji_type}}", emoji)
                .replace("{{transaction_type}}", isExpense ? "Despesa" : "Receita")
                .replace("{{occurred_at}}", occurredAt)
                .replace("{{category}}", category?.name || "Geral")
                .replace("{{amount}}", amount)
                .replace("{{total_balance}}", balance);
        }

        const whatsapp = new WhatsAppService();
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: message.senderId,
            type: "text",
            text: { preview_url: false, body: responseText }
        };

        await whatsapp.sendMessage(payload);

        await db.update(messages).set({ statusId: 4 }).where(eq(messages.id, messageId)); // COMPLETED

        await db.insert(messageLogs).values({
            messageId,
            step: "response",
            description: "Message Answered",
            statusId: 4,
            startedAt: new Date(),
            finishedAt: new Date()
        });
    }
}

export const responseService = new ResponseService();
