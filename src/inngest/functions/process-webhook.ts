import { inngest } from "@/inngest/client";
import { webhookService } from "@/services/webhook-service";

export const processWebhook = inngest.createFunction(
    { id: "process-webhook" },
    { event: "webhook.received" },
    async ({ event, step }) => {
        const { webhookId } = event.data;

        const messageIds = await step.run("process-webhook-service", async () => {
            return await webhookService.processWebhook(webhookId);
        });

        if (messageIds && messageIds.length > 0) {
            const events = messageIds.map(id => ({
                name: "message.created",
                data: { messageId: id }
            }));

            await step.sendEvent("trigger-message-router", events as any);
        }

        return { processed: true, messagesCreated: messageIds?.length || 0 };
    }
);
