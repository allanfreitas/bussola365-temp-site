export const enum TypePromptEnum {
  AI_ROUTER = "ai_router",
  AUDIO_TRANSCRIPTION = "audio_transcription",
  TRANSACTION_BUILDER = "transaction_builder",
}

export const enum MessageTypeEnum {
  TEXT = "text",
  AUDIO = "audio",
  VIDEO = "video",
  DOCUMENT = "document",
  IMAGE = "image",
  INTERACTIVE = "interactive",
}

export const enum MessageLogStepEnum {
  ROUTING = "routing",
  INTENT_PROCESSING = "intent_processing",
  TRANSCRIBE = "transcribe",
  OCR_IMAGE = "ocr_image",
  PROCESSED = "processed",
  RESPONSE = "response",
  TRANSACTION_BUILDING = "transaction_building",
}


export const enum ConfigEnum {
  JobsEnabled = "jobs_enabled",
  WhatappBusinessNumberId = "whatapp_business_number_id",
}

export const enum MessageTemplateEnum {
  TransactionSuccess = "transaction_success",
  TransactionFailed = "transaction_failed",
}

export const enum MyQueueEnum {
  ProcessWebhook = "process_webhook",
  RouteMessage = "route_message",
  ProcessMessage = "process_message",
  AnswerMessage = "answer_message",
  CacheMessageMidia = "cache_message_midia",
}

export const enum InngestEnum {
  WebhookReceived = "webhook.received",
  MessageCreated = "message.created",
  ProcessMessage = "process_message",
  AnswerMessage = "answer_message",
  CacheMessageMidia = "cache_message_midia",
}

export const enum AdmDevActionEnum {
  ProcessWebhook = "webhook_process",
  RouteMessage = "message_route",
  ProcessMessage = "message_process",
  AnswerMessage = "message_answer",
  CacheMessageMidia = "message_cache_midia",
}


export const CodebookType = {
  WebhookStatus: "webhook_status",
  MessageStatus: "message_status",
  AttachmentStatus: "attachment_status",
  ProfileStatus: "profile_status",
  WalletStatus: "wallet_status",
  MessageDirection: "message_direction",
} as const;
export type CodebookTypeEnum = typeof CodebookType[keyof typeof CodebookType];




/****** ENUMs no Codebook ******/

// codebook webhook_status
export const enum WebhookStatusEnum {
  PENDING = 1, // Webhook criado e aguardando processamento
  PROCESSING = 2, // Webhook em processamento
  COMPLETED = 3, // Webhook processado com sucesso
  IGNORED = 4, // Webhook ignorado
  FAILED = 5, // Falha em qualquer etapa
}

// codebook message_status
export const enum MessageStatusEnum {
  PENDING = 1, // Mensagem criada e aguardando processamento
  CLASSIFIED = 2, // Mensagem classificada
  INTENT = 3, // Intenção já processada
  ROUTED = 4, // Prompt/job definido e disparado
  COMPLETED = 5, // Resposta enviada
  FAILED = 6, // Falha em qualquer etapa
}

// codebook attachment_status
export const enum AttachmentStatusEnum {
  PENDING = 1, // aguardando download e processamento
  PROCESSING = 2, // Anexo em processamento (ex: upload, transcrição)
  READY = 3, // Anexo processado com sucesso
  FAILED = 4, // Falha no processamento do anexo
}


// codebook profile_status
export const enum ProfileStatusEnum {
  LEAD = 1,
  ONBOARDING = 2,
  TRIAL = 3,
  TRIAL_EXPIRED = 4,
  INACTIVE = 5,
  BLOCKED = 6,
  ACTIVE = 7,
}

// codebook wallet_status
export const enum WalletStatusEnum {
  ACTIVE = 1,
}

// codebook message_direction
export const enum MessageDirectionEnum {
  INBOUND = 1,
  OUTBOUND = 2,
}