// inngest/functions/trial-recovery-service.ts
import { inngest } from "@/inngest/client";

// export const trialRecoveryService = inngest.createFunction(
//     {
//         id: "trial-recovery-service",
//         name: "Trial Recovery Service",
//         idempotency: "event.data.messageId",
//     },
//     { event: "message.requires.trial_recovery" },
//     async ({ event }) => {
//         await inngest.send({
//             name: "outbound.message.send.requested",
//             data: {
//                 channel: "whatsapp",
//                 profileId: event.data.profileId,
//                 content: {
//                     type: "interactive",
//                     body: buildUpgradeCTA(),
//                 },
//             },
//         });
//     }
// );
