// inngest/functions/inbound-message-classifier.ts
import { InngestEventType } from "@/enums/enums";
import { inngest } from "@/inngest/client";
import configService from "@/services/config-service";
import inboundMessageClassifier from "@/services/inbound-message-classifier";

export const inboundMessageClassifierHandler = inngest.createFunction(
    {
        id: "inbound-message-classifier",
        name: "Inbound Message Classifier",
        concurrency: 10,
    },
    { event: InngestEventType.InboundMessage },
    async ({ event }) => {
        const jobsEnabled = await configService.getJobEnabled();

        for (const messageId of event.data.messageIds) {

            const domainEvent = await inboundMessageClassifier.execute(messageId);

            if (!jobsEnabled || domainEvent.name === InngestEventType.DoNothing) {
                continue;
            }

            await inngest.send(domainEvent);
        }
    }
);
