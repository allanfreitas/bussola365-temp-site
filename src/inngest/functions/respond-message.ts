import { inngest } from "@/inngest/client";
import { responseService } from "@/services/response-service";

// export const respondMessage = inngest.createFunction(
//     { id: "respond-message" },
//     { event: "transaction.created" },
//     async ({ event, step }) => {
//         const { messageId, transactionId, walletId } = event.data;

//         await step.run("execute-service", async () => {
//             await responseService.execute(messageId, transactionId, walletId);
//         });
//     }
// );
