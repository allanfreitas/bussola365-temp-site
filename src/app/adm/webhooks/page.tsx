import { db } from "@/db";
import { codebookViews, vwWebhookStatus, webhooks } from "@/db/schema";
import { desc, sql, count, eq } from "drizzle-orm";
import { WebhooksTable } from "./WebhooksTable";

export const dynamic = "force-dynamic";

export default async function WebhooksPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string }>;
}) {
    const { page = "1", limit = "10" } = await searchParams;
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));
    const offset = (pageNumber - 1) * limitNumber;

    const [allWebhooks, [{ total }]] = await Promise.all([
        db
            .select({
                id: webhooks.id,
                platformId: webhooks.platformId,
                processedAt: webhooks.processedAt,
                statusId: webhooks.statusId,
                payload: webhooks.payload,
                createdAt: webhooks.createdAt,
                updatedAt: webhooks.updatedAt,
                statusName: vwWebhookStatus.description,
                statusDescription: vwWebhookStatus.description,
            })
            .from(webhooks)
            .leftJoin(vwWebhookStatus, eq(webhooks.statusId, vwWebhookStatus.id))
            .orderBy(desc(webhooks.createdAt))
            .limit(limitNumber)
            .offset(offset),

        db.select({ total: count() }).from(webhooks),
    ]);


    const pageCount = Math.ceil(Number(total) / limitNumber);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-platinum-50 tracking-tight">Webhooks</h1>
                <p className="text-iron-grey-400 mt-1">Lista de recebimentos de webhooks das plataformas integradas.</p>
            </div>

            <div className="rounded-xl border border-prussian-blue-800 bg-prussian-blue-900/40 p-6 shadow-2xl backdrop-blur-sm">
                <WebhooksTable
                    data={allWebhooks as any}
                    pageCount={pageCount}
                    currentPage={pageNumber}
                    pageSize={limitNumber}
                    totalItems={Number(total)}
                />
            </div>
        </div>
    );
}
