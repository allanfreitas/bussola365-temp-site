import { AttachmentStatusEnum, MessageDirectionEnum, MessageStatusEnum, MessageTypeEnum, WebhookStatusEnum } from "@/enums/enums";
import { db } from "../db";
import { webhooks, profiles, messages, attachments } from "../db/schema";
import { eq } from "drizzle-orm";

class WppWebhookService {
  constructor() { }

  async processWebhook(webhookId: string): Promise<string[]> {
    const [webhook] = await db
      .select()
      .from(webhooks)
      .where(eq(webhooks.id, webhookId))
      .limit(1);
    if (!webhook) {
      console.error(`Webhook ${webhookId} not found`);
      return [];
    }

    //const jobEnabled = await configService.getJobEnabled();

    const messageIds: string[] = [];

    await db
      .update(webhooks)
      .set({ statusId: WebhookStatusEnum.PROCESSING })
      .where(eq(webhooks.id, webhookId));

    try {
      const payload = webhook.payload as any; // Typed appropriately in real app

      let hasMessages = false;
      // Basic WhatsApp generic processing
      if (payload.entry) {
        for (const entry of payload.entry) {
          for (const change of entry.changes) {
            const value = change.value;

            // Process Contacts
            // if (value.contacts) {
            //   for (const contact of value.contacts) {
            //     const waId = contact.wa_id;
            //     const name = contact.profile?.name || "Unknown";

            //     let [profile] = await db
            //       .select()
            //       .from(profiles)
            //       .where(eq(profiles.phoneNumber, waId))
            //       .limit(1);
            //     if (!profile) {
            //       [profile] = await db
            //         .insert(profiles)
            //         .values({
            //           phoneNumber: waId,
            //           displayName: name,
            //           //status: "lead",
            //           //email: `${waId}@bussola365`, // Better-Auth might require email
            //         })
            //         .returning();
            //     } else {
            //       await db
            //         .update(profiles)
            //         .set({ displayName: name, updatedAt: new Date() })
            //         .where(eq(profiles.id, profile.id));
            //     }
            //   }
            // }

            // Process Messages
            if (value.messages) {
              hasMessages = true;
              for (const msgData of value.messages) {
                const mid = msgData.id;
                const [existing] = await db
                  .select()
                  .from(messages)
                  .where(eq(messages.messageUid, mid))
                  .limit(1);
                if (existing) {
                  messageIds.push(existing.id);
                  continue;
                }

                const timestamp = parseInt(msgData.timestamp, 10);
                const createdAt = new Date(timestamp * 1000);
                const type = msgData.type;
                const from = msgData.from;
                let content = type === MessageTypeEnum.TEXT ? msgData.text?.body : null;

                if (type === MessageTypeEnum.INTERACTIVE) {
                  content = msgData.interactive;
                }

                const [newMessage] = await db
                  .insert(messages)
                  .values({
                    webhookId: webhookId,
                    messageUid: mid,
                    senderId: from,
                    directionId: MessageDirectionEnum.INBOUND,
                    messageType: type,
                    content: content,
                    createdAt: createdAt,
                    statusId: MessageStatusEnum.PENDING,
                  })
                  .returning();

                messageIds.push(newMessage.id);

                // Media
                if ([
                  MessageTypeEnum.IMAGE, MessageTypeEnum.AUDIO,
                  MessageTypeEnum.VIDEO, MessageTypeEnum.DOCUMENT
                ].includes(type)) {
                  const media = msgData[type];
                  if (media) {
                    await db.insert(attachments).values({
                      messageId: newMessage.id,
                      originalId: media.id,
                      fileType: media.mime_type,
                      statusId: AttachmentStatusEnum.PENDING,
                    });
                  }
                }

              }
            }
          }
        }
      }

      let finalStatus = hasMessages ? WebhookStatusEnum.COMPLETED : WebhookStatusEnum.IGNORED;
      await db
        .update(webhooks)
        .set({ statusId: finalStatus, processedAt: new Date() })
        .where(eq(webhooks.id, webhookId));

      return messageIds;

    } catch (error) {
      console.error("Error processing webhook", error);
      await db
        .update(webhooks)
        .set({ statusId: WebhookStatusEnum.FAILED })
        .where(eq(webhooks.id, webhookId));
      throw error;
    }
  }
}

const wppWebhookService = new WppWebhookService();
export default wppWebhookService;
