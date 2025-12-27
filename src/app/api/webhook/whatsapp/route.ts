import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { webhooks } from "@/db/schema";
import { inngest } from "@/inngest/client";

// GET: Webhook Verification
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const verifyToken = process.env.META_VERIFY_TOKEN || "bussola365-secret-token";

    console.log(`Received webhook Validation: ${mode}, ${token}, ${challenge}`);

    if (mode === "subscribe" && token === verifyToken) {
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse("Forbidden", { status: 403 });
}

// POST: Webhook Reception
export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();

        if (!bodyText) {
            return new NextResponse("Bad Request: Empty Body", { status: 400 });
        }

        // Save Raw Webhook to DB
        const [inserted] = await db.insert(webhooks).values({
            platform: "whatsapp",
            payload: JSON.parse(bodyText),
            headers: Object.fromEntries(req.headers.entries()),
            status: 1, // Pending
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning({ id: webhooks.id });

        console.log(`Received webhook and saved: ${inserted.id}`);

        // Trigger Inngest Event (ProcessWebhookJob equivalent)
        await inngest.send({
            name: "webhook.received",
            data: { webhookId: inserted.id }
        });

        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        console.error("Error receiving webhook:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
