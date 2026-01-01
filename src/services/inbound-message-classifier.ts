import { db } from "@/db";
import messageRepo from "@/db/repo/message-repo";
import { Message, messages, Profile, profiles } from "@/db/schema";
import { InngestEventType, ProfileStatusEnum } from "@/enums/enums";
import { DomainEvent } from "@/types/event-bus";
import { eq } from "drizzle-orm";


class InboundMessageClassifier {
    async execute(messageId: string): Promise<DomainEvent> {
        let message: Message;
        try {
            message = await messageRepo.getMessage(messageId);
        } catch (e: any) {
            console.error(e);
            return {
                name: InngestEventType.DoNothing,
                data: null,
            };
        }

        let profile: Profile;
        try {
            profile = await this.getOrCreateProfile(message.senderId);
        } catch (e: any) {
            console.error(e);
            return {
                name: InngestEventType.DoNothing,
                data: null,
            };
        }

        switch (profile.statusId) {
            case ProfileStatusEnum.LEAD:
            case ProfileStatusEnum.ONBOARDING:
                return {
                    name: InngestEventType.MessageRequiresOnboarding,
                    data: {
                        messageId,
                        profileId: profile.id,
                        status: profile.statusId,
                    },
                };
            case ProfileStatusEnum.TRIAL:
            case ProfileStatusEnum.ACTIVE:
                return {
                    name: InngestEventType.MessageReadyForConversation,
                    data: {
                        messageId,
                        profileId: profile.id,
                        status: profile.statusId,
                    },
                };
            case ProfileStatusEnum.TRIAL_EXPIRED:
                return {
                    name: InngestEventType.MessageRequiresTrialRecovery,
                    data: {
                        messageId,
                        profileId: profile.id,
                        status: profile.statusId,
                    },
                };
            default:
                return {
                    name: InngestEventType.DoNothing,
                    data: null,
                };
        }
    }


    async getOrCreateProfile(phoneNumber: string): Promise<Profile> {
        const profile = await db.select().from(profiles)
            .where(eq(profiles.phoneNumber, phoneNumber));
        if (profile.length > 0) {
            return profile[0];
        }

        const newProfile = await db.insert(profiles).values({
            phoneNumber,
            statusId: ProfileStatusEnum.LEAD,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        return newProfile[0];
    }
}

const inboundMessageClassifier = new InboundMessageClassifier();

export default inboundMessageClassifier;