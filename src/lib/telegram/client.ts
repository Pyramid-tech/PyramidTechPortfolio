import { logger } from '@/lib/logger';

const API_BASE = 'https://api.telegram.org';
const TIMEOUT_MS = 12000;

function credentials(): { token: string; chatId: string } | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    logger.error('telegram: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set');
    return null;
  }
  return { token, chatId };
}

async function call(token: string, method: string, body: object): Promise<unknown | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = (await res.json()) as { ok: boolean; result?: unknown; description?: string };
    if (!data.ok) {
      logger.error(`telegram: ${method} failed`, { context: { description: data.description } });
      return null;
    }
    return data.result ?? null;
  } catch (error) {
    logger.error(`telegram: ${method} error`, { context: { error: String(error) } });
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function sendMessage(text: string): Promise<number | null> {
  const creds = credentials();
  if (!creds) return null;
  const result = (await call(creds.token, 'sendMessage', {
    chat_id: creds.chatId,
    text,
    disable_web_page_preview: true,
  })) as { message_id?: number } | null;
  return result?.message_id ?? null;
}

export async function editMessageText(messageId: number, text: string): Promise<boolean> {
  const creds = credentials();
  if (!creds) return false;
  const result = await call(creds.token, 'editMessageText', {
    chat_id: creds.chatId,
    message_id: messageId,
    text,
    disable_web_page_preview: true,
  });
  return result !== null;
}

export function chatId(): string | undefined {
  return process.env.TELEGRAM_CHAT_ID;
}
