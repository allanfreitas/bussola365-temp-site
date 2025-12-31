import { inngest } from "@/inngest/client";
import { messageRouterService } from "@/services/message-router-service";
import { InngestEnum } from "@/enums/enums";

export const routeMessage = inngest.createFunction(
    { id: "route-message" },
    { event: InngestEnum.MessageCreated },
    async ({ event, step }) => {
        const { messageId } = event.data;

        const result = await step.run("route-message-service", async () => {
            return await messageRouterService.execute(messageId);
        });

        // if (result && result.isTransaction) {
        //     await step.sendEvent(InngestEnum.TriggerTransactionBuilder, {
        //         name: InngestEnum.MessageRouted,
        //         data: { messageId }
        //     });
        // }

        return result;
    }
);
