export const enum TypePromptEnum {
  AI_ROUTER = "ai_router",
  AUDIO_TRANSCRIPTION = "audio_transcription",
  TRANSACTION_BUILDER = "transaction_builder",
}

export const enum MessageTypeEnum {
  TEXT = "text",
  AUDIO = "audio",
  IMAGE = "image",
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

export const enum MessageStatusEnum {
  PENDING = 1, // Mensagem criada e aguardando processamento
  INTENT = 2, // Intenção já processada
  ROUTED = 3, // Prompt/job definido e disparado
  COMPLETED = 4, // Resposta enviada
  FAILED = 5, // Falha em qualquer etapa
}

export const enum AttachmentStatusEnum {
  PENDING = 1, // aguardando download e processamento
  PROCESSING = 2, // Anexo em processamento (ex: upload, transcrição)
  READY = 3, // Anexo processado com sucesso
  FAILED = 4, // Falha no processamento do anexo
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
