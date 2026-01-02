//wpp-send-message-template.ts

import { db } from "@/db";
import { messageTemplates, Profile } from "@/db/schema";
import { eq } from "drizzle-orm";
import whatsappService from "./WhatsAppService";
import { WhatsAppNumberFixer } from "@/lib/helpers/whats-app-number-fixer";

export class WppSendMessageTemplate {
    async execute(templateName: string, to: string, variables: Record<string, string> = {}) {
        const [tpl] = await db.select().from(messageTemplates).where(eq(messageTemplates.template, templateName));
        to = WhatsAppNumberFixer.adjustBrazilianNumber(to);

        if (!tpl) {
            throw new Error("Template not found");
        }

        const mergedVars = { ...(tpl.variables || {}), ...variables };

        const contentFinal = this.applyVariables(tpl.content, mergedVars);

        let payload: any;

        if (tpl.type === "text") {
            payload = {
                messaging_product: "whatsapp",
                to: to,
                type: "text",
                text: {
                    preview_url: false,
                    //language: tpl.language,
                    body: contentFinal
                },
            };
        } else if (tpl.type === "interactive") {
            // const button: any = { type: tpl.buttonType };
            // if (tpl.buttonType === "flow") {
            //     button.flow = { name: tpl.flowName, button_text: tpl.buttonText, };
            // } else if (tpl.buttonType === "url") {
            //     button.url = tpl.url;
            //     button.text = tpl.buttonText;
            // }

            if (tpl.buttonType === "flow") {
                payload = {
                    recipient_type: "individual",
                    messaging_product: "whatsapp",
                    to,
                    type: "interactive",
                    interactive: {
                        type: "flow",
                        //header: { type: "text", text: "WhatsApp Flow Header" },
                        body: { text: contentFinal },
                        //footer: { text: "Por Bússola365" },
                        action: {
                            name: "flow",
                            parameters: {
                                flow_message_version: "3",
                                flow_name: tpl.flowName,
                                flow_cta: tpl.buttonText
                            }
                        }
                    }
                };
            }

            // implement other interactive types if needed
        }

        const response = await whatsappService.sendMessage(payload);
        return response;
    }

    private applyVariables(content: string, variables: Record<string, string> | null | undefined): string {
        let result = content;
        const safeVars = variables ?? {};
        for (const [key, value] of Object.entries(safeVars)) {
            result = result.replace(new RegExp(key, "g"), value);
        }
        return result;
    }

}

const wppSendMessageTemplate = new WppSendMessageTemplate();
export default wppSendMessageTemplate;
