// inngest/functions/outbound-message-sender.ts
import { inngest } from "@/inngest/client";

// export const outboundMessageSender = inngest.createFunction(
//     {
//         id: "outbound-message-sender",
//         name: "Outbound Message Sender",
//         concurrency: 30,
//     },
//     { event: "outbound.message.send.requested" },
//     async ({ event }) => {
//         switch (event.data.channel) {
//             case "whatsapp":
//                 await sendWhatsAppMessage(
//                     event.data.profileId,
//                     event.data.content
//                 );
//                 break;
//         }
//     }
// );
