import { pgView } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { CodebookType, CodebookTypeEnum } from "@/enums/enums";
import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";

function toCamelCase(str: string) { return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase()); }

export const codebook = pgTable("codebook", {
    type: text("type").notNull(),
    id: integer("id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    color: text("color"),
    icon: text("icon"),
}, (table) => [
    primaryKey({ columns: [table.type, table.id] })
]);

export type CodebookViewShape = {
    id: typeof codebook.id;
    name: typeof codebook.name;
    description: typeof codebook.description;
    color: typeof codebook.color;
    icon: typeof codebook.icon;
};

/*

  MessageDirection: "message_direction",
*/

export const vwWebhookStatus = pgView(`vw_webhook_status`).as((qb) =>
    qb
        .select({
            id: codebook.id,
            name: codebook.name,
            description: codebook.description,
            color: codebook.color,
            icon: codebook.icon,
        })
        .from(codebook)
        .where(eq(codebook.type, CodebookType.WebhookStatus))
);

export const vwMessageStatus = pgView(`vw_message_status`).as((qb) =>
    qb
        .select({
            id: codebook.id,
            name: codebook.name,
            description: codebook.description,
            color: codebook.color,
            icon: codebook.icon,
        })
        .from(codebook)
        .where(eq(codebook.type, CodebookType.MessageStatus))
);

export const vwAttachmentStatus = pgView(`vw_attachment_status`).as((qb) =>
    qb
        .select({
            id: codebook.id,
            name: codebook.name,
            description: codebook.description,
            color: codebook.color,
            icon: codebook.icon,
        })
        .from(codebook)
        .where(eq(codebook.type, CodebookType.AttachmentStatus))
);

//ProfileStatus
export const vwProfileStatus = pgView(`vw_profile_status`).as((qb) =>
    qb
        .select({
            id: codebook.id,
            name: codebook.name,
            description: codebook.description,
            color: codebook.color,
            icon: codebook.icon,
        })
        .from(codebook)
        .where(eq(codebook.type, CodebookType.ProfileStatus))
);

// WalletStatus
export const vwWalletStatus = pgView(`vw_wallet_status`).as((qb) =>
    qb
        .select({
            id: codebook.id,
            name: codebook.name,
            description: codebook.description,
            color: codebook.color,
            icon: codebook.icon,
        })
        .from(codebook)
        .where(eq(codebook.type, CodebookType.WalletStatus))
);

export const vwMessageDirection = pgView(`vw_message_direction`).as((qb) =>
    qb
        .select({
            id: codebook.id,
            name: codebook.name,
            description: codebook.description,
            color: codebook.color,
            icon: codebook.icon,
        })
        .from(codebook)
        .where(eq(codebook.type, CodebookType.MessageDirection))
);

// const viewsToCreate = Object.values(CodebookType);
// console.log(viewsToCreate);

// // Generate views for each type
// export const codebookViews = viewsToCreate.reduce((acc, type) => {
//     const key = toCamelCase(type);
//     const viewName = `vw_${type}` as const;
//     const view = pgView(viewName).as((qb) =>
//         qb
//             .select({
//                 id: codebook.id,
//                 description: codebook.description,
//                 color: codebook.color,
//                 icon: codebook.icon,
//             })
//             .from(codebook)
//             .where(eq(codebook.type, type))
//     );

//     acc[key] = view;
//     return acc;
// //}, {} as Record<string, any>);
// }, {} as Record<`vw_${CodebookTypeEnum}`, ReturnType<ReturnType<typeof pgView>["as"]>>);
