import { db } from "@/db";
import { Message, messages, Profile, profiles } from "@/db/schema";
import { ProfileStatusEnum } from "@/enums/enums";
import { DomainEvent } from "@/types/event-bus";
import { eq } from "drizzle-orm";



class InboundMessageClassifier {
    async execute(messageId: string): Promise<DomainEvent> {
        const message = await this.getMessage(messageId);
        const profile = await this.getOrCreateProfile(message.senderId);

        switch (profile.statusId) {
            case ProfileStatusEnum.LEAD:
            case ProfileStatusEnum.ONBOARDING:
                return {
                    name: "message.requires.onboarding",
                    data: {
                        messageId,
                        profileId: profile.id,
                        status: profile.statusId,
                    },
                };
            case ProfileStatusEnum.TRIAL:
            case ProfileStatusEnum.ACTIVE:
                return {
                    name: "message.ready.for.conversation",
                    data: {
                        messageId,
                        profileId: profile.id,
                        status: profile.statusId,
                    },
                };
            case ProfileStatusEnum.TRIAL_EXPIRED:
                return {
                    name: "message.requires.trial_recovery",
                    data: {
                        messageId,
                        profileId: profile.id,
                        status: profile.statusId,
                    },
                };
            default:
                throw new Error("Invalid profile status");
        }
    }

    async getMessage(messageId: string): Promise<Message> {
        const message = await db.select().from(messages).where(eq(messages.id, messageId));
        if (message.length > 0) {
            return message[0];
        }

        throw new Error("Message not found");
    }

    async getOrCreateProfile(phoneNumber: string): Promise<Profile> {
        const profile = await db.select().from(profiles).where(eq(profiles.phoneNumber, phoneNumber));
        if (profile.length > 0) {
            return profile[0];
        }

        const newProfile = await db.insert(profiles).values({
            phoneNumber,
            statusId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        return newProfile[0];
    }
}

const inboundMessageClassifier = new InboundMessageClassifier();

export default inboundMessageClassifier;