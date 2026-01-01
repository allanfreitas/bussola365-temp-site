//wpp-onboarding-service.ts

import messageRepo from "@/db/repo/message-repo";
import profileRepo from "@/db/repo/profile-repo";
import { ProfileStatusEnum } from "@/enums/enums";
import whatsappService from "./WhatsAppService";
import wppSendMessageTemplate from "./wpp-send-message-template";

export class WppOnboardingService {
    async execute(messageId: string, profileId: string) {
        let message;
        try {
            message = await messageRepo.getMessage(messageId);
        } catch (e: any) {
            console.error(e);
            return;
        }

        let profile;
        try {
            profile = await profileRepo.getProfile(profileId);
        } catch (e: any) {
            console.error(e);
            return;
        }

        if (![ProfileStatusEnum.LEAD, ProfileStatusEnum.ONBOARDING].includes(profile.statusId)) {
            return;
        }

        const phoneNumber = profile.phoneNumber;

        if (profile.statusId === ProfileStatusEnum.LEAD) {
            const typing = await whatsappService.typingIndicator(message.messageUid);
            console.log(typing);

            const sentSignupFlow = await wppSendMessageTemplate.execute("signup_flow", phoneNumber, { "{{days}}": "7" });
            console.log(sentSignupFlow);

            const sentSignupFollowup = await wppSendMessageTemplate.execute("signup_followup", phoneNumber);
            console.log(sentSignupFollowup);

            profile.statusId = ProfileStatusEnum.ONBOARDING;
            await profileRepo.updateProfile(profile);
        }
    }
}

const wppOnboardingService = new WppOnboardingService();
export default wppOnboardingService;
