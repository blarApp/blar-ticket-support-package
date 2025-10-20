import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
});

export const ViewportSchema = z.object({
  w: z.number(),
  h: z.number(),
});

export const MetaSchema = z.object({
  url: z.string(),
  route: z.string(),
  ts: z.number(),
  locale: z.string().optional(),
  viewport: ViewportSchema,
  ua: z.string().optional(),
  appVersion: z.string().optional(),
  release: z.string().optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
});

export const ConsoleLogSchema = z.object({
  level: z.enum(['error', 'warn', 'info', 'log']),
  message: z.string(),
  ts: z.number(),
  stack: z.string().optional(),
});

export const NetworkLogSchema = z.object({
  url: z.string(),
  method: z.string(),
  status: z.number(),
  durationMs: z.number(),
  ts: z.number(),
});

export const FormDataSchema = z.object({
  summary: z.string().min(1, 'Summary is required'),
  steps: z.string().optional(),
  expected: z.string().optional(),
  actual: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  category: z.string().optional(),
});

export const ChatHistoryMessageSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  content: z.string().min(1, 'Message content is required'),
  timestamp: z.number().optional(),
});

export const TriageRequestSchema = z.object({
  messages: z.array(ChatHistoryMessageSchema).min(1),
});

export const TriageFormDataSchema = z.object({
  summary: z.string().min(1).optional(),
  description: z.string().optional(),
  steps: z.string().optional(),
  expected: z.string().optional(),
  actual: z.string().optional(),
  severity: z.string().optional(),
  category: z.string().optional(),
});

export const TriageSuggestedMetaSchema = z.object({
  message_count: z.number().optional(),
  triage_source: z.string().optional(),
  confidence: z.string().optional(),
});

export const TriageResponseSchema = z.object({
  form_data: TriageFormDataSchema,
  suggested_meta: TriageSuggestedMetaSchema.optional(),
});

export const AttachmentSchema = z.object({
  name: z.string(),
  mime: z.string(),
  dataUrl: z.string(),
});

export const IssueReportPayloadSchema = z.object({
  publishableKey: z.string(),
  user: UserSchema.optional(),
  meta: MetaSchema,
  console: z.array(ConsoleLogSchema).optional(),
  network: z.array(NetworkLogSchema).optional(),
  custom: z.record(z.string(), z.unknown()).optional(),
  form: FormDataSchema,
  // Attachments are NOT sent in JSON - they use signed URL uploads
});

export const DiagnosticSchema = z.object({
  headline: z.string(),
  probableCause: z.string().optional(),
  suggestedFix: z.string().optional(),
  relatedIssues: z.array(z.object({
    id: z.string(),
    title: z.string(),
  })).optional(),
  tags: z.array(z.string()).optional(),
});

export const DiagnosticResponseSchema = z.object({
  issueId: z.string(),
  status: z.enum(['pending', 'ready', 'error']),
  diagnostic: DiagnosticSchema.optional(),
  error: z.string().optional(),
});

export const ChatAttachmentSchema = z.object({
  url: z.string(),
  name: z.string(),
  mime: z.string(),
});

export const SupportChatMessageSchema = z.object({
  id: z.string(),
  type: z.enum(['user', 'agent', 'system']),
  content: z.string(),
  timestamp: z.number(),
  attachments: z.array(ChatAttachmentSchema).optional(),
  agentId: z.string().optional(),
  agentName: z.string().optional(),
});

export const ChatSessionSchema = z.object({
  sessionId: z.string(),
  messages: z.array(SupportChatMessageSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const BlarioConfigSchema = z.object({
  publishableKey: z.string(),
  apiBaseUrl: z.string().default('https://api.blar.io'),
  user: UserSchema.optional(),
  locale: z.enum(['en', 'es']).default('en'),
  capture: z.object({
    console: z.boolean().default(true),
    networkSample: z.boolean().default(false),
    maxConsoleLogs: z.number().default(50),
    maxNetworkLogs: z.number().default(20),
  }).optional(),
  theme: z.object({
    mode: z.enum(['light', 'dark']).default('light'),
    position: z.enum(['bottom-right', 'bottom-left', 'top-right', 'top-left']).default('bottom-right'),
    accent: z.string().optional(),
    className: z.string().optional(),
  }).optional(),
  redaction: z.object({
    patterns: z.array(z.instanceof(RegExp)).optional(),
    customRedactor: z.function().args(z.string()).returns(z.string()).optional(),
  }).optional(),
  rateLimit: z.object({
    maxRequests: z.number().default(10),
    windowMs: z.number().default(60000),
  }).optional(),
  onAfterSubmit: z.function().args(z.string()).returns(z.void()).optional(),
  onError: z.function().args(z.instanceof(Error)).returns(z.void()).optional(),
});

export type User = z.infer<typeof UserSchema>;
export type Viewport = z.infer<typeof ViewportSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type ConsoleLog = z.infer<typeof ConsoleLogSchema>;
export type NetworkLog = z.infer<typeof NetworkLogSchema>;
export type FormData = z.infer<typeof FormDataSchema>;
export type ChatHistoryMessage = z.infer<typeof ChatHistoryMessageSchema>;
export type TriageRequest = z.infer<typeof TriageRequestSchema>;
export type TriageFormData = z.infer<typeof TriageFormDataSchema>;
export type TriageSuggestedMeta = z.infer<typeof TriageSuggestedMetaSchema>;
export type TriageResponse = z.infer<typeof TriageResponseSchema>;
export type Attachment = z.infer<typeof AttachmentSchema>;
export type IssueReportPayload = z.infer<typeof IssueReportPayloadSchema>;
export type Diagnostic = z.infer<typeof DiagnosticSchema>;
export type DiagnosticResponse = z.infer<typeof DiagnosticResponseSchema>;
export type BlarioConfig = z.infer<typeof BlarioConfigSchema>;
export type ChatAttachment = z.infer<typeof ChatAttachmentSchema>;
export type SupportChatMessage = z.infer<typeof SupportChatMessageSchema>;
export type ChatSession = z.infer<typeof ChatSessionSchema>;
