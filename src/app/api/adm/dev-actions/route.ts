import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AdmDevActionEnum, InngestEnum } from "@/enums/enums";
import { AdminActionPayload } from "@/types/admin-action-payload";
import { headers } from "next/headers";

//
import { inngest } from "@/inngest/client";
//
import webhookService from "@/services/WebhookService";

const actions: Record<AdmDevActionEnum, (recordId: string) => Promise<any> | any> = {
    [AdmDevActionEnum.ProcessWebhook]: async (recordId: string) => {
        // const webhookService = new WebhookService();
        //const messageIds = await webhookService.processWebhook(recordId);

        await inngest.send({
            name: InngestEnum.WebhookReceived,
            data: { webhookId: recordId }
        });

        return { message: "Processamento de webhook agendado com sucesso" };
    },
    [AdmDevActionEnum.RouteMessage]: async (recordId: string) => {
        return { message: "Registro deletado com sucesso", recordId };
    },
    [AdmDevActionEnum.ProcessMessage]: async (recordId: string) => {
        return { message: "ProcessMessage", recordId };
    },
    [AdmDevActionEnum.AnswerMessage]: async (recordId: string) => {
        return { message: "AnswerMessage", recordId };
    },
    [AdmDevActionEnum.CacheMessageMidia]: async (recordId: string) => {
        return { message: "CacheMessageMidia", recordId };
    },
};

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        if (session.user.role !== "admin") {
            return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
        }

        const body = await req.json() as AdminActionPayload;
        const { action, recordId } = body;

        if (!action || !recordId) {
            return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
        }

        const handler = actions[action];
        if (!handler) {
            return NextResponse.json({ error: "Ação desconhecida" }, { status: 400 });
        }

        const result = await handler(recordId);

        return NextResponse.json({ success: true, action, recordId, result });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
