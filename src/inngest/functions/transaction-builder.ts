import { inngest } from "@/inngest/client";
import { db } from "@/db";
import { transactionBuilderService } from "@/services/transaction-builder-service";

export const transactionBuilder = inngest.createFunction(
    { id: "transaction-builder" },
    { event: "message.routed" },
    async ({ event, step }) => {
        const { messageId } = event.data;

        // Delegate to Service
        await step.run("execute-service", async () => {
            const { transactionId, walletId } = await transactionBuilderService.execute(messageId);

            // Trigger Response Job 
            // (Events can still be triggered here or inside service if strictly coupled)
            await step.sendEvent("trigger-response", {
                name: "transaction.created",
                data: {
                    transactionId,
                    messageId,
                    walletId
                }
            });

            return { transactionId };
        });
    }
);
