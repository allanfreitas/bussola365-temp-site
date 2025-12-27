import { inngest } from "@/inngest/client";
import { messageRouterService } from "@/services/message-router-service";

export const routeMessage = inngest.createFunction(
    { id: "route-message" },
    { event: "message.created" },
    async ({ event, step }) => {
        const { messageId } = event.data;

        const result = await step.run("route-message-service", async () => {
            return await messageRouterService.execute(messageId);
        });

        if (result && result.isTransaction) {
            await step.sendEvent("trigger-transaction-builder", {
                name: "message.routed",
                data: { messageId }
            });
        }

        return result;
    }
);
