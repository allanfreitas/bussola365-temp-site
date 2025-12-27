import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  uuid,
  smallint,
  primaryKey,
  pgEnum,
  real,
  index,
} from "drizzle-orm/pg-core";
import { desc, relations, sql } from "drizzle-orm";

export const messageDirectionEnum = pgEnum("message_direction", [
  "inbound",
  "outbound",
]);

// --- Core Domain ---

export const appConfs = pgTable("app_confs", {
  confKey: text("conf_key").primaryKey(),
  confValue: text("conf_value").notNull(),
  description: text("description"),
});

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  authUserId: text("auth_user_id").unique(),
  phoneNumber: text("phone_number").notNull().unique(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const wallets = pgTable("wallets", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const walletMembers = pgTable(
  "wallet_members",
  {
    walletId: uuid("wallet_id")
      .notNull()
      .references(() => wallets.id, { onDelete: "cascade" }),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    role: text("role").default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.walletId, table.profileId] })]
);

export const webhooks = pgTable("webhooks", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  platform: text("platform").notNull(),
  payload: jsonb("payload").notNull().default({}),
  headers: jsonb("headers").notNull().default({}),
  status: integer("status").default(1),
  eventType: text("event_type"),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const prompts = pgTable("prompts", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  type: text("type").notNull(),
  provider: text("provider").notNull().default("gemini"),
  model: text("model").notNull(),
  systemInstruction: text("system_instruction").notNull(),
  userTemplate: text("user_template").notNull(),
  inputVariables: jsonb("input_variables").notNull().default([]),
  modelConfig: jsonb("model_config").notNull().default({}),
  active: smallint("active").default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  name: text("name").notNull(),
  typeId: smallint("type_id").notNull(), // 1 = Receita, 2 = Despesa
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const messageIntents = pgTable("message_intents", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  active: smallint("active").default(1),
});

export const messages = pgTable("messages", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  webhookId: uuid("webhook_id").references(() => webhooks.id),
  senderId: text("sender_id").notNull(),
  direction: messageDirectionEnum("direction").default("inbound").notNull(),
  parentId: uuid("parent_id"),
  messageUid: text("message_uid").notNull(),
  messageType: text("message_type").notNull(),
  content: text("content"),
  promptId: uuid("prompt_id").references(() => prompts.id),
  intentId: uuid("intent_id").references(() => messageIntents.id),
  intentScore: real("intent_score"),
  statusId: smallint("status_id").default(1).notNull(),
  externalId: text("external_id"),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    walletId: uuid("wallet_id")
      .notNull()
      .references(() => wallets.id, { onDelete: "cascade" }),
    profileId: uuid("profile_id").references(() => profiles.id, {
      onDelete: "set null",
    }),
    categoryId: uuid("category_id").references(() => categories.id),
    description: text("description"),
    amountCents: integer("amount_cents").notNull(),
    typeId: smallint("type_id").notNull(),
    transactionDate: timestamp("transaction_date", {
      withTimezone: true,
    }).defaultNow(),
    messageId: uuid("message_id").references(() => messages.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    walletDateIdx: index("idx_transactions_wallet_date").on(
      table.walletId,
      desc(table.transactionDate)
    ),
  })
);

export const coupons = pgTable("coupons", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  code: text("code").notNull(),
  description: text("description"),
  discountType: text("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(),
  maxUses: integer("max_uses").default(1),
  timesUsed: integer("times_used").default(0),
  validFrom: timestamp("valid_from", { withTimezone: true }),
  validUntil: timestamp("valid_until", { withTimezone: true }),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const messageTemplates = pgTable("message_templates", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  template: text("template").notNull(),
  content: text("content").notNull(),
  active: smallint("active").default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const messageLogs = pgTable(
  "message_logs",
  {
    id: uuid("id")
      .default(sql`uuidv7()`)
      .primaryKey(),
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id),
    statusId: smallint("status_id"),
    step: text("step"),
    description: text("description"),
    metadata: jsonb("metadata"),
    promptId: uuid("prompt_id").references(() => prompts.id),
    executionTimeMs: integer("execution_time_ms"),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    // Add FKs if needed, or keep loose.
  })
);

export const attachments = pgTable("attachments", {
  id: uuid("id")
    .default(sql`uuidv7()`)
    .primaryKey(),
  messageId: uuid("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  originalId: text("original_id"),
  fileType: text("file_type"),
  fileUrl: text("file_url"),
  fileSize: integer("file_size"),
  statusId: smallint("status_id").default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Relations

export const profilesRelations = relations(profiles, ({ many }) => ({
  memberships: many(walletMembers),
  transactions: many(transactions),
}));

export const walletsRelations = relations(wallets, ({ many }) => ({
  members: many(walletMembers),
  transactions: many(transactions),
}));

export const walletMembersRelations = relations(walletMembers, ({ one }) => ({
  wallet: one(wallets, {
    fields: [walletMembers.walletId],
    references: [wallets.id],
  }),
  profile: one(profiles, {
    fields: [walletMembers.profileId],
    references: [profiles.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  prompt: one(prompts, {
    fields: [messages.promptId],
    references: [prompts.id],
  }),
  intent: one(messageIntents, {
    fields: [messages.intentId],
    references: [messageIntents.id],
  }),
  logs: many(messageLogs),
  attachments: many(attachments),

  parent: one(messages, {
    fields: [messages.parentId],
    references: [messages.id],
    relationName: "message_thread",
  }),
  children: many(messages, {
    relationName: "message_thread",
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [transactions.walletId],
    references: [wallets.id],
  }),
  profile: one(profiles, {
    fields: [transactions.profileId],
    references: [profiles.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  message: one(messages, {
    fields: [transactions.messageId],
    references: [messages.id],
  }),
}));

export const messageLogsRelations = relations(messageLogs, ({ one }) => ({
  message: one(messages, {
    fields: [messageLogs.messageId],
    references: [messages.id],
  }),
  prompt: one(prompts, {
    fields: [messageLogs.promptId],
    references: [prompts.id],
  }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  message: one(messages, {
    fields: [attachments.messageId],
    references: [messages.id],
  }),
}));
