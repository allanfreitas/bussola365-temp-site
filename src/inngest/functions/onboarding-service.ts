// inngest/functions/onboarding-service.ts
import { inngest } from "@/inngest/client";

export const onboardingService = inngest.createFunction(
    {
        id: "onboarding-service",
        name: "Onboarding Service",
        idempotency: "event.data.messageId",
    },
    { event: "message.requires.onboarding" },
    async ({ event, step }) => {
        const { profileId } = event.data;

        await step.run("mark-onboarding", async () => {
            await updateProfileStatus(profileId, "onboarding");
        });

        await step.run("send-cta", async () => {
            await inngest.send({
                name: "outbound.message.send.requested",
                data: {
                    channel: "whatsapp",
                    profileId,
                    content: {
                        type: "interactive",
                        body: buildAccountCreationCTA(),
                    },
                },
            });
        });

        await step.sleep("wait-for-followup", "3h");

        const profile = await getProfile(profileId);

        if (profile.status === "onboarding") {
            await inngest.send({
                name: "outbound.message.send.requested",
                data: {
                    channel: "whatsapp",
                    profileId,
                    content: {
                        type: "text",
                        body: "Need help creating your account? Talk to a human here 👇",
                    },
                },
            });
        }
    }
);
