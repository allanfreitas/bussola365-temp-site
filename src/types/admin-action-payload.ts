import { AdmDevActionEnum } from "@/enums/enums";

export interface AdminActionPayload {
    action: AdmDevActionEnum;
    recordId: string;
}