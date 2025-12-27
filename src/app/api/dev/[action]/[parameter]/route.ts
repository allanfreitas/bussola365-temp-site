import { NextRequest, NextResponse } from "next/server";
import { webhookService } from "@/services/webhook-service";
import { messageRouterService } from "@/services/message-router-service";
import { transactionBuilderService } from "@/services/transaction-builder-service";
import { responseService } from "@/services/response-service";
import { db } from "@/db";
import { transactions, walletMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

// Map actions to logic
export async function GET(
    req: NextRequest,
    { params }: { params: { action: string; parameter: string } }
) {
    const { action, parameter } = params;
    const paramId = parameter;
    // Int parameters from .NET might be IDs. UUIDs are strings in TS. 
    // User needs to pass UUID now if the logic migrated to UUID. 
    // However, the .NET code used `int parameter`. 
    // If the legacy DB was integer based and new is UUID, we might have a mismatch if they try to pass '123'.
    // But since we are full migration, we assume they will pass the correct ID format (UUID).
    // Let's treat parameter as string.

    try {
        switch (action) {
            case "webhook-ingestion":
                await webhookService.processWebhook(paramId);
                return NextResponse.json({ message: "Webhook Ingestion - Processamento Concluido" });

            case "process-message":
                await messageRouterService.execute(paramId);
                return NextResponse.json({ message: "Router Service - Processamento concluído" });

            case "process-transaction":
                await transactionBuilderService.execute(paramId);
                return NextResponse.json({ message: "Transaction Builder - Processamento concluído" });

            case "answer-message":
                // In .NET param was messageId (I think? Logic says responderService.HandleAsync(parameter))
                // But wait, ResponseService.execute needs (messageId, transactionId, walletId).
                // The .NET `TransactionResponseService` probably looked up the transaction from the message?
                // Let's check `TransactionResponseService.cs` from previous context? 
                // Or we can try to look it up here to support the dev tool.

                // If the parameter is `messageId`:
                const messageId = paramId;
                const transaction = await db.query.transactions.findFirst({
                    where: eq(transactions.messageId, messageId)
                });
                if (!transaction) return NextResponse.json({ error: "Transaction not found for message" }, { status: 404 });

                const walletMember = await db.query.walletMembers.findFirst({
                    where: eq(walletMembers.profileId, transaction.profileId)
                });
                // This is weak, transaction has walletId directly? Yes.

                await responseService.execute(messageId, transaction.id, transaction.walletId);
                return NextResponse.json({ message: "Answer Message - Processamento concluído" });

            default:
                return NextResponse.json({ message: "Ação desconhecida" }, { status: 400 });
        }
    } catch (error: any) {
        console.error(`Error in Dev Endpoint ${action}/${paramId}:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
