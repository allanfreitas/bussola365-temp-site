import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { transactionBuilder } from "@/inngest/functions/transaction-builder";
import { respondMessage } from "@/inngest/functions/respond-message";
import { processWebhook } from "@/inngest/functions/process-webhook";
import { routeMessage } from "@/inngest/functions/route-message";

// Create an API that serves zero-serverless functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        transactionBuilder,
        respondMessage,
        processWebhook,
        routeMessage,
    ],
});
