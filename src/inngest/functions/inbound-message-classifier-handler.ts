// inngest/functions/inbound-message-classifier.ts
import { InngestEventType } from "@/enums/enums";
import { inngest } from "@/inngest/client";

export const inboundMessageClassifierHandler = inngest.createFunction(
    {
        id: "inbound-message-classifier",
        name: "Inbound Message Classifier",
        concurrency: 10,
    },
    { event: InngestEventType.InboundMessage },
    async ({ event }) => {
        for (const messageId of event.data.messageIds) {
            const message = await getMessage(messageId);
            const profile = await getOrCreateProfile(message.phoneNumber);

            await attachProfileToMessage(messageId, profile.id);

            switch (profile.status) {
                case "lead":
                case "onboarding":
                    await inngest.send({
                        name: "message.requires.onboarding",
                        data: {
                            messageId,
                            profileId: profile.id,
                            status: profile.status,
                        },
                    });
                    break;

                case "trial":
                case "active":
                    await inngest.send({
                        name: "message.ready.for.conversation",
                        data: {
                            messageId,
                            profileId: profile.id,
                            status: profile.status,
                        },
                    });
                    break;

                case "trial_expired":
                    await inngest.send({
                        name: "message.requires.trial_recovery",
                        data: {
                            messageId,
                            profileId: profile.id,
                            status: profile.status,
                        },
                    });
                    break;
            }
        }
    }
);
