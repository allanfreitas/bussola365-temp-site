// inngest/functions/route-message-service.ts
import { inngest } from "@/inngest/client";

// export const routeMessageService = inngest.createFunction(
//     {
//         id: "route-message-service",
//         name: "Route Message Service",
//         idempotency: "event.data.messageId",
//         concurrency: 100,
//     },
//     { event: "message.ready.for.conversation" },
//     async ({ event }) => {
//         const response = await generateConversationResponse(
//             event.data.messageId,
//             event.data.profileId
//         );

//         await inngest.send({
//             name: "outbound.message.send.requested",
//             data: {
//                 channel: "whatsapp",
//                 profileId: event.data.profileId,
//                 content: response,
//             },
//         });
//     }
// );
