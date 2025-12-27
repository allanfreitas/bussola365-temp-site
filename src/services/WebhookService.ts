import { db } from "../db";
import { webhooks, profiles, messages, attachments } from "../db/schema";
import { eq } from "drizzle-orm";

export class WebhookService {
  constructor() {}

  async processWebhook(webhookId: string): Promise<void> {
    const [webhook] = await db
      .select()
      .from(webhooks)
      .where(eq(webhooks.id, webhookId))
      .limit(1);
    if (!webhook) {
      console.error(`Webhook ${webhookId} not found`);
      return;
    }

    // Processing status
    await db
      .update(webhooks)
      .set({ status: 2 })
      .where(eq(webhooks.id, webhookId));

    try {
      const payload = webhook.payload as any; // Typed appropriately in real app

      // Basic WhatsApp generic processing
      if (payload.entry) {
        for (const entry of payload.entry) {
          for (const change of entry.changes) {
            const value = change.value;

            // Process Contacts
            if (value.contacts) {
              for (const contact of value.contacts) {
                const waId = contact.wa_id;
                const name = contact.profile?.name || "Unknown";

                let [profile] = await db
                  .select()
                  .from(profiles)
                  .where(eq(profiles.phoneNumber, waId))
                  .limit(1);
                if (!profile) {
                  [profile] = await db
                    .insert(profiles)
                    .values({
                      phoneNumber: waId,
                      displayName: name,
                      //status: "lead",
                      //email: `${waId}@bussola365`, // Better-Auth might require email
                    })
                    .returning();
                } else {
                  await db
                    .update(profiles)
                    .set({ displayName: name, updatedAt: new Date() })
                    .where(eq(profiles.id, profile.id));
                }
              }
            }

            // Process Messages
            if (value.messages) {
              for (const msgData of value.messages) {
                const mid = msgData.id;
                const [existing] = await db
                  .select()
                  .from(messages)
                  .where(eq(messages.messageUid, mid))
                  .limit(1);
                if (existing) continue;

                const timestamp = parseInt(msgData.timestamp, 10);
                const createdAt = new Date(timestamp * 1000);
                const type = msgData.type;
                const from = msgData.from;
                const content = type === "text" ? msgData.text?.body : null;

                const [newMessage] = await db
                  .insert(messages)
                  .values({
                    webhookId: webhookId,
                    messageUid: mid,
                    senderId: from,
                    messageType: type,
                    content: content,
                    createdAt: createdAt,
                    statusId: 1, // PENDING
                  })
                  .returning();

                // Media
                if (["image", "audio", "video", "document"].includes(type)) {
                  const media = msgData[type];
                  if (media) {
                    await db.insert(attachments).values({
                      messageId: newMessage.id,
                      originalId: media.id,
                      fileType: media.mime_type,
                      statusId: 1, // PENDING
                    });
                  }
                }

                // TODO: Enqueue Job
                // await QueueService.add("route-message", { messageId: newMessage.id });
              }
            }
          }
        }
      }

      // Success
      await db
        .update(webhooks)
        .set({ status: 3, processedAt: new Date() })
        .where(eq(webhooks.id, webhookId));
    } catch (error) {
      console.error("Error processing webhook", error);
      await db
        .update(webhooks)
        .set({ status: 4 })
        .where(eq(webhooks.id, webhookId));
      throw error;
    }
  }
}
