"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Table05 } from "@/components/table-05";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Code, Play, CheckCircle2, AlertCircle, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { WebhookStatusEnum } from "@/enums/enums";

interface WebhookRecord {
    id: string;
    platformId: string;
    eventType: string | null;
    statusId: number | null;
    payload: any;
    headers: any;
    createdAt: Date;
    processedAt: Date | null;
    statusName: string | null;
    statusDescription: string | null;
    [key: string]: any;
}

const webhookStatusBadge = (status: number) => {
    const baseClasses = "border-none";

    switch (status) {
        case WebhookStatusEnum.PENDING:
            return (
                <Badge
                    variant="outline"
                    className={`${baseClasses} bg-yellow-500/20 text-yellow-600`}
                >
                    Pendente
                </Badge>
            );
        case WebhookStatusEnum.PROCESSING:
            return (
                <Badge
                    variant="outline"
                    className={`${baseClasses} bg-blue-500/20 text-blue-600`}
                >
                    Processando
                </Badge>
            );
        case WebhookStatusEnum.COMPLETED:
            return (
                <Badge
                    variant="outline"
                    className={`${baseClasses} bg-green-500/20 text-green-600`}
                >
                    Completado
                </Badge>
            );
        case WebhookStatusEnum.FAILED:
            return (
                <Badge
                    variant="outline"
                    className={`${baseClasses} bg-red-500/20 text-red-600`}
                >
                    Falhou
                </Badge>
            );
        case WebhookStatusEnum.IGNORED:
            return (
                <Badge
                    variant="secondary"
                    className={`${baseClasses} bg-stone-500/20 text-stone-600`}
                >
                    Ignorado
                </Badge>
            );
        default:
            return (
                <Badge
                    variant="outline"
                    className={`${baseClasses} bg-gray-500/20 text-gray-600`}
                >
                    Desconhecido
                </Badge>
            );
    }
};


function JSONDialog({ title, data, icon: Icon }: { title: string; data: any; icon: any }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer h-8 w-8 text-iron-grey-400 hover:text-jungle-green-400">
                    <Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-4xl max-w-5xl bg-prussian-blue-900 border-prussian-blue-700 text-platinum-50">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-jungle-green-400" />
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div className="bg-prussian-blue-950 p-4 rounded-lg overflow-auto max-h-[70vh] border border-prussian-blue-800">
                    <pre className="text-sm font-mono text-jungle-green-500/90 whitespace-pre-wrap">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AdmDevActionEnum } from "@/enums/enums";

export function WebhooksTable({
    data,
    pageCount,
    currentPage,
    pageSize,
    totalItems
}: {
    data: WebhookRecord[];
    pageCount: number;
    currentPage: number;
    pageSize: number;
    totalItems: number;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const columns: ColumnDef<WebhookRecord>[] = useMemo(() => [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <span className="font-mono text-xs text-iron-grey-500">{row.original.id.slice(0, 8)}...</span>,
        },
        {
            accessorKey: "platformId",
            header: "Plataforma",
            cell: ({ row }) => <Badge variant="secondary" className="bg-prussian-blue-800 text-jungle-green-400 border-none">{row.original.platformId}</Badge>,
        },
        {
            accessorKey: "eventType",
            header: "Evento",
            cell: ({ row }) => <span className="text-sm font-medium">{row.original.eventType || "N/A"}</span>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.statusId;
                return webhookStatusBadge(status as number || WebhookStatusEnum.PENDING);
            },
        },
        {
            accessorKey: "payload",
            header: "Dados",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <JSONDialog title="Payload (JSON)" data={row.original.payload} icon={Code} />
                    <JSONDialog title="Headers (JSON)" data={row.original.headers} icon={Eye} />
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Criado em",
            cell: ({ row }) => (
                <span className="text-sm text-iron-grey-400">
                    {format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm")}
                </span>
            ),
        },
        {
            accessorKey: "processedAt",
            header: "Processado em",
            cell: ({ row }) => (
                <span className="text-sm text-iron-grey-400">
                    {row.original.processedAt ? format(new Date(row.original.processedAt), "dd/MM/yyyy HH:mm") : "-"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => {
                const handleProcess = async () => {
                    const processAction = async () => {
                        const response = await fetch("/api/adm/dev-actions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                action: AdmDevActionEnum.ProcessWebhook,
                                recordId: row.original.id,
                            }),
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || "Erro ao processar webhook");
                        }

                        return response.json();
                    };

                    toast.promise(processAction(), {
                        loading: 'Adicionando à fila...',
                        success: 'Webhook adicionado à fila com sucesso!',
                        error: (err: any) => err.message || 'Erro ao adicionar webhook.',
                    });

                    // Recarrega a página após o request finalizar (mesmo se for erro)
                    setTimeout(() => {
                        router.refresh();
                    }, 2000);
                };

                return (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleProcess}
                        className="cursor-pointer h-8 bg-prussian-blue-900 border-prussian-blue-700 hover:bg-jungle-green-600 hover:text-prussian-blue-950 transition-all gap-2"
                    >
                        <Play className="h-3.5 w-3.5" />
                    </Button>
                );
            },
        },
    ], [router]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    const handlePageSizeChange = (size: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", size.toString());
        params.set("page", "1"); // Reset to first page
        router.push(`?${params.toString()}`);
    };

    return (
        <Table05
            columns={columns}
            data={data}
            searchPlaceholder="Filtrar webhooks..."
            headerActions={
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        toast.info("Atualizando dados...");
                        router.refresh();
                    }}
                    className="cursor-pointer h-9 bg-prussian-blue-900 border-prussian-blue-800 text-platinum-50 hover:bg-prussian-blue-800 gap-2"
                >
                    <RotateCw className="h-4 w-4" />
                    Recarregar
                </Button>
            }
            manualPagination={{
                pageCount,
                currentPage,
                pageSize,
                totalItems,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange,
            }}
        />
    );
}
