import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";

import { wppWebhookHandler } from "@/inngest/functions/wpp-webhook-handler";
import { inboundMessageClassifierHandler } from "@/inngest/functions/inbound-message-classifier-handler";
import { onboardingHandler } from "@/inngest/functions/onboarding-handler";


export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        wppWebhookHandler,
        inboundMessageClassifierHandler,
        onboardingHandler,
    ],
});
