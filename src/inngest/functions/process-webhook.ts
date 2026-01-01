import { InngestEnum } from "@/enums/enums";
import { inngest } from "@/inngest/client";
import webhookService from "@/services/wpp-webhook-service";

export const processWebhook = inngest.createFunction(
    { id: "process-webhook" },
    { event: InngestEnum.WebhookReceived },
    async ({ event, step }) => {
        const { webhookId } = event.data;

        const messageIds = await step.run("process-webhook-service", async () => {
            return await webhookService.processWebhook(webhookId);
        });

        if (messageIds && messageIds.length > 0) {
            const events = messageIds.map(id => ({
                name: InngestEnum.MessageCreated,
                data: { messageId: id }
            }));
            await step.sendEvent("message-created", events as any);
        }

        return { processed: true, messagesCreated: messageIds?.length || 0 };
    }
);
