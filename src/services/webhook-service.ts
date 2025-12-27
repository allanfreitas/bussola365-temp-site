import { db } from "@/db";
import {
    webhooks,
    profiles,
    messages,
    attachments
} from "@/db/schema";
import { eq } from "drizzle-orm";
// import { s3Service } from "@/services/s3-service"; // Assuming S3 service exists
// import { whatsappService } from "@/services/whatsapp-service";

export class WebhookService {
    async processWebhook(webhookId: string): Promise<string[]> {
        const webhook = await db.query.webhooks.findFirst({
            where: eq(webhooks.id, webhookId)
        });

        if (!webhook) {
            console.error(`Webhook ${webhookId} not found`);
            return [];
        }

        // Update Status to Processing (2)
        await db.update(webhooks).set({ status: 2 }).where(eq(webhooks.id, webhookId));

        const createdMessageIds: string[] = [];

        try {
            const payload = webhook.payload as any;
            const entries = payload.entry || [];

            for (const entry of entries) {
                const changes = entry.changes || [];
                for (const change of changes) {
                    const value = change.value;
                    if (!value) continue;

                    // 1. Process Contacts
                    if (value.contacts) {
                        for (const contact of value.contacts) {
                            const waId = contact.wa_id;
                            const name = contact.profile?.name || "Unknown";

                            // Upsert Profile
                            const existing = await db.query.profiles.findFirst({
                                where: eq(profiles.phoneNumber, waId)
                            });

                            if (!existing) {
                                await db.insert(profiles).values({
                                    phoneNumber: waId,
                                    displayName: name,
                                    status: "lead"
                                });
                            } else {
                                await db.update(profiles)
                                    .set({ displayName: name, updatedAt: new Date() })
                                    .where(eq(profiles.id, existing.id));
                            }
                        }
                    }

                    // 2. Process Messages
                    if (value.messages) {
                        for (const msgData of value.messages) {
                            const mid = msgData.id;
                            const existingMsg = await db.query.messages.findFirst({
                                where: eq(messages.messageUid, mid)
                            });

                            if (existingMsg) continue;

                            const timestamp = parseInt(msgData.timestamp) * 1000;
                            const sentAt = new Date(timestamp);
                            const type = msgData.type || "text";
                            const from = msgData.from;
                            let content = null;

                            if (type === "text") {
                                content = msgData.text?.body;
                            }

                            // Insert Message
                            const [newMessage] = await db.insert(messages).values({
                                webhookId: webhook.id,
                                messageUid: mid,
                                senderId: from,
                                messageType: type,
                                content: content,
                                sentAt: sentAt,
                                statusId: 1, // PENDING
                            }).returning({ id: messages.id });

                            // Handle Media
                            if (this.isMedia(type)) {
                                const mediaData = msgData[type];
                                const fileId = mediaData.id;
                                const mimeType = mediaData.mime_type;

                                await db.insert(attachments).values({
                                    messageId: newMessage.id,
                                    originalId: fileId,
                                    fileType: mimeType,
                                    statusId: 1, // PENDING
                                });

                                // TODO: Trigge Media Download Job if needed
                            }

                            // We return the message ID to be used by the caller to trigger the route-message event
                            createdMessageIds.push(newMessage.id);
                        }
                    }
                }
            }

            // Update Webhook Status to Processed (3)
            await db.update(webhooks).set({
                status: 3,
                processedAt: new Date()
            }).where(eq(webhooks.id, webhookId));

            return createdMessageIds;

        } catch (error) {
            console.error(`Error processing webhook ${webhookId}:`, error);
            await db.update(webhooks).set({ status: 4 }).where(eq(webhooks.id, webhookId)); // Error
            throw error;
        }
    }

    private isMedia(type: string): boolean {
        return ["audio", "image", "video", "document", "sticker", "voice"].includes(type);
    }
}

export const webhookService = new WebhookService();
