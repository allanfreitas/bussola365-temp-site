// inngest/functions/onboarding-handler.ts
import { InngestEventType } from "@/enums/enums";
import { inngest } from "@/inngest/client";
import wppOnboardingService from "@/services/wpp-onboarding-service";

export const onboardingHandler = inngest.createFunction(
    {
        id: "onboarding-handler",
        name: "Onboarding Handler",
        idempotency: "event.data.messageId",
    },
    { event: InngestEventType.MessageRequiresOnboarding },
    //async ({ event, step }) => {
    async ({ event }) => {
        const { profileId, messageId } = event.data;
        await wppOnboardingService.execute(messageId, profileId);

        // await step.run("send-cta", async () => {
        //     await wppOnboardingService.execute(messageId, profileId);
        // });
        // await step.sleep("wait-for-followup", "3h");

        // const profile = await getProfile(profileId);

        // if (profile.status === "onboarding") {
        //     await inngest.send({
        //         name: "outbound.message.send.requested",
        //         data: {
        //             channel: "whatsapp",
        //             profileId,
        //             content: {
        //                 type: "text",
        //                 body: "Need help creating your account? Talk to a human here 👇",
        //             },
        //         },
        //     });
        // }
    }
);
