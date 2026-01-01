// inngest/functions/wpp-webhook-handler.ts
import { inngest } from "@/inngest/client";
import configService from "@/services/config-service";
import webhookService from "@/services/wpp-webhook-service";
import { InngestEventType } from "@/enums/enums";

export const wppWebhookHandler = inngest.createFunction(
    {
        id: "wpp-webhook-handler",
        name: "WhatsApp Webhook Handler",
    },
    { event: InngestEventType.WebhookReceived },
    async ({ event }) => {
        if (event.data.channel !== "whatsapp") return;

        const messageIds: string[] = await webhookService.processWebhook(event.data.webhookId);

        if (!messageIds.length) return;

        const jobEnabled = await configService.getJobEnabled();
        if (!jobEnabled) return;

        await inngest.send({
            name: InngestEventType.InboundMessage,
            data: {
                channel: "whatsapp",
                messageIds,
                extractedAt: new Date().toISOString(),
            },
        });
    }
);
