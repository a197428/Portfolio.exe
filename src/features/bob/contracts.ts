import { z } from 'zod';

export const chatModeSchema = z.enum(['qa', 'vacancy']);
export const chatLocaleSchema = z.enum(['ru', 'en']);
export const chatRoleSchema = z.enum(['ai', 'frontend']);

export const chatHistoryItemSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(4_000),
});

export const chatRequestSchema = z
  .object({
    mode: chatModeSchema,
    message: z.string().trim().min(2),
    history: z.array(chatHistoryItemSchema).max(8).default([]),
    locale: chatLocaleSchema,
    role: chatRoleSchema,
    turnstileToken: z.string().max(2_048).optional(),
  })
  .superRefine(({ mode, message }, context) => {
    const limit = mode === 'vacancy' ? 12_000 : 2_000;
    if (message.length > limit) {
      context.addIssue({
        code: 'too_big',
        maximum: limit,
        origin: 'string',
        inclusive: true,
        path: ['message'],
        message: `Message must contain at most ${limit} characters`,
      });
    }
  });

export const citationSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['profile', 'project', 'resume', 'fact']),
  href: z.string(),
});

export const chatErrorCodeSchema = z.enum([
  'validation',
  'no_evidence',
  'rate_limit',
  'challenge_required',
  'provider_auth',
  'provider_unavailable',
  'stream_interrupted',
]);

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatMode = z.infer<typeof chatModeSchema>;
export type Citation = z.infer<typeof citationSchema>;
export type ChatErrorCode = z.infer<typeof chatErrorCodeSchema>;

export type ChatStreamEvent =
  | { type: 'sources'; sources: Citation[] }
  | { type: 'delta'; text: string }
  | { type: 'done'; requestId: string; usage?: { prompt: number; completion: number } }
  | { type: 'error'; code: ChatErrorCode; message: string };
