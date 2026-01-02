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
        if (event.data.channel !== "whatsapp") return {
            message: "Not a WhatsApp webhook, ignoring",
        }

        const messageIds: string[] = await webhookService.processWebhook(event.data.webhookId);

        if (!messageIds.length) return {
            message: "No messages extracted from webhook",
        }

        const jobEnabled = await configService.getJobEnabled();
        if (!jobEnabled) return {
            message: "Inbound message processing job is disabled",
        }

        const payload = {
            channel: "whatsapp",
            messageIds,
            extractedAt: new Date().toISOString(),
        };

        try {
            await inngest.send({
                name: InngestEventType.InboundMessage,
                data: payload,
            });
                console.log("Dispatched inbound/message event:", payload);
            } catch (err) {
                console.error("Failed to dispatch event:", err);
            }

        return {
            message: "Webhook processed successfully",
            data: payload,
        }
    }
);
