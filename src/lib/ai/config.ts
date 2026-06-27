/**
 * Groq AI service configuration.
 *
 * Model IDs are read from env (never hardcoded at call sites) so they can be
 * swapped without a code change when Groq deprecates a model — e.g. the Llama-4
 * Scout vision model was deprecated 2026-06-17. Defaults below are sensible
 * free-tier choices as of mid-2026; override via env to change them.
 */

function intFromEnv(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export const groqConfig = {
  apiKey: process.env.GROQ_API_KEY ?? '',
  baseUrl: process.env.GROQ_BASE_URL ?? 'https://api.groq.com/openai/v1',
  /** Used when the input is text-only. */
  textModel: process.env.GROQ_TEXT_MODEL ?? 'llama-3.3-70b-versatile',
  /** Used when a member photo is included (multimodal). */
  visionModel: process.env.GROQ_VISION_MODEL ?? 'qwen/qwen3.6-27b',
  /** Score (inclusive) at or above which a member is auto-published. */
  confidenceThreshold: intFromEnv(process.env.GROQ_CONFIDENCE_THRESHOLD, 50),
  /** Hard timeout for a single Groq call; on timeout the member is held for approval. */
  timeoutMs: intFromEnv(process.env.GROQ_TIMEOUT_MS, 12000),
} as const;
