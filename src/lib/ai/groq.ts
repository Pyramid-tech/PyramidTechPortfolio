/**
 * Minimal Groq chat-completions client (OpenAI-compatible). Uses native `fetch`
 * with an AbortController timeout — no SDK dependency.
 *
 * Multi-model routing lives here: {@link modelForMessages} selects the vision
 * model when any message carries an image part, otherwise the text model.
 */
import { groqConfig } from './config';

export class GroqError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GroqError';
  }
}

interface TextPart {
  type: 'text';
  text: string;
}
interface ImagePart {
  type: 'image_url';
  image_url: { url: string };
}
export type ContentPart = TextPart | ImagePart;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentPart[];
}

interface ChatOptions {
  messages: ChatMessage[];
  /** Defaults to {@link modelForMessages} (vision vs text routing). */
  model?: string;
  /** Request `response_format: { type: 'json_object' }`. */
  jsonObject?: boolean;
  temperature?: number;
}

/** True when any message includes an image content part. */
export function messagesHaveImage(messages: ChatMessage[]): boolean {
  return messages.some(
    (m) => Array.isArray(m.content) && m.content.some((p) => p.type === 'image_url'),
  );
}

/** Pick the configured vision or text model based on the message content. */
export function modelForMessages(messages: ChatMessage[]): string {
  return messagesHaveImage(messages) ? groqConfig.visionModel : groqConfig.textModel;
}

/** Run a chat completion. Throws {@link GroqError} on any failure or timeout. */
export async function chatCompletion(
  opts: ChatOptions,
): Promise<{ content: string; model: string }> {
  if (!groqConfig.apiKey) throw new GroqError('GROQ_API_KEY is not set');

  const model = opts.model ?? modelForMessages(opts.messages);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), groqConfig.timeoutMs);

  try {
    const res = await fetch(`${groqConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqConfig.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: opts.messages,
        temperature: opts.temperature ?? 0,
        ...(opts.jsonObject ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new GroqError(`Groq request failed (${res.status}): ${detail.slice(0, 300)}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || content.trim().length === 0) {
      throw new GroqError('Groq returned an empty completion');
    }
    return { content, model };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new GroqError(`Groq request timed out after ${groqConfig.timeoutMs}ms`);
    }
    throw err instanceof GroqError ? err : new GroqError(`Groq request error: ${String(err)}`);
  } finally {
    clearTimeout(timer);
  }
}
