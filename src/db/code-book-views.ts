import { pgView } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { CodebookType } from "@/enums/enums";
import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";


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
    description: typeof codebook.description;
    color: typeof codebook.color;
    icon: typeof codebook.icon;
};

// Generate views for each type
export const codebookViews = Object.values(CodebookType).reduce((acc, type) => {
    const viewName = `vw_${type}` as const;

    const view = pgView(viewName).as((qb) =>
        qb
            .select({
                id: codebook.id,
                description: codebook.description,
                color: codebook.color,
                icon: codebook.icon,
            })
            .from(codebook)
            .where(eq(codebook.type, type))
    );

    acc[viewName] = view;
    return acc;
}, {} as Record<string, any>);
