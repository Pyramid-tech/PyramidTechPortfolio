import { waitUntil } from '@vercel/functions';
import Transport from 'winston-transport';

import { sendEmbed, webhookUrl, type DiscordEmbed, type DiscordEmbedField } from '@/lib/discord/client';

const LEVELS = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'] as const;

const LEVEL_COLORS: Record<string, number> = {
  emergency: 0x7f1d1d,
  alert: 0x991b1b,
  critical: 0xb91c1c,
  error: 0xdc2626,
  warning: 0xf59e0b,
  notice: 0x0891b2,
  info: 0x16a34a,
  debug: 0x64748b,
};

const LEVEL_BADGES: Record<string, string> = {
  emergency: '🚨',
  alert: '🚨',
  critical: '🔴',
  error: '🔴',
  warning: '🟡',
  notice: '🔵',
  info: '🟢',
  debug: '⚪',
};

const RESERVED_KEYS = ['source', 'requestId', 'url', 'method', 'stack'] as const;

const DEDUPE_WINDOW_MS = 60_000;
const RATE_WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 15;
const MAX_MESSAGE_CHARS = 1800;
const MAX_STACK_CHARS = 1200;
const MAX_FIELD_CHARS = 1000;

const lastSentAt = new Map<string, number>();
const suppressedCounts = new Map<string, number>();
let windowStartedAt = 0;
let windowCount = 0;
let mutedUntil = 0;
let queue: Promise<void> = Promise.resolve();

export function alertLevel(): string {
  const configured = process.env.DISCORD_ALERT_LEVEL?.trim();
  return configured && (LEVELS as readonly string[]).includes(configured) ? configured : 'warning';
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

function safeJson(value: unknown): string | null {
  try {
    return JSON.stringify(value, null, 2) ?? null;
  } catch {
    return null;
  }
}

function suppress(key: string): void {
  suppressedCounts.set(key, (suppressedCounts.get(key) ?? 0) + 1);
}

function prune(now: number): void {
  lastSentAt.forEach((at, key) => {
    if (now - at >= DEDUPE_WINDOW_MS) lastSentAt.delete(key);
  });
}

function buildEmbed(
  level: string,
  message: string,
  ctx: Record<string, unknown>,
  stack: string | null,
  repeats: number,
): DiscordEmbed {
  const fields: DiscordEmbedField[] = [];

  const pushField = (name: string, value: unknown, inline = true): void => {
    if (typeof value !== 'string' || value.trim() === '') return;
    fields.push({ name, value: truncate(value, MAX_FIELD_CHARS), inline });
  };

  pushField('Environment', process.env.NODE_ENV ?? 'development');
  pushField('Source', ctx.source);
  pushField('Request', ctx.requestId);

  if (typeof ctx.url === 'string') {
    const method = typeof ctx.method === 'string' ? `${ctx.method} ` : '';
    pushField('URL', `${method}${ctx.url}`, false);
  }

  const rest = { ...ctx };
  for (const key of RESERVED_KEYS) delete rest[key];

  if (Object.keys(rest).length > 0) {
    const json = safeJson(rest);
    if (json) {
      fields.push({
        name: 'Context',
        value: truncate(`\`\`\`json\n${json}\n\`\`\``, MAX_FIELD_CHARS),
        inline: false,
      });
    }
  }

  if (repeats > 0) {
    fields.push({
      name: 'Repeats',
      value: `+${repeats} more in the last minute`,
      inline: false,
    });
  }

  const description = stack
    ? `${truncate(message, MAX_MESSAGE_CHARS)}\n\`\`\`\n${truncate(stack, MAX_STACK_CHARS)}\n\`\`\``
    : truncate(message, MAX_MESSAGE_CHARS);

  return {
    title: `${LEVEL_BADGES[level] ?? '⚪'} ${level.toUpperCase()}`,
    description,
    color: LEVEL_COLORS[level] ?? 0x64748b,
    timestamp: new Date().toISOString(),
    fields: fields.length > 0 ? fields : undefined,
    footer: { text: 'Pyramid' },
  };
}

async function deliver(
  level: string,
  message: string,
  ctx: Record<string, unknown>,
  stack: string | null,
): Promise<void> {
  const key = `${level}|${message}`;
  const now = Date.now();

  if (now < mutedUntil) {
    suppress(key);
    return;
  }

  const previous = lastSentAt.get(key);
  if (previous !== undefined && now - previous < DEDUPE_WINDOW_MS) {
    suppress(key);
    return;
  }

  if (now - windowStartedAt >= RATE_WINDOW_MS) {
    windowStartedAt = now;
    windowCount = 0;
  }

  if (windowCount >= MAX_PER_WINDOW) {
    suppress(key);
    return;
  }

  const repeats = suppressedCounts.get(key) ?? 0;
  suppressedCounts.delete(key);
  lastSentAt.set(key, now);
  windowCount += 1;
  prune(now);

  const result = await sendEmbed(buildEmbed(level, message, ctx, stack, repeats));

  if (!result.ok) {
    lastSentAt.delete(key);
    suppressedCounts.set(key, repeats + 1);
    if (result.retryAfterMs !== null) mutedUntil = Date.now() + result.retryAfterMs;
  }
}

export class DiscordTransport extends Transport {
  log(info: Record<string, unknown>, callback: () => void): void {
    setImmediate(() => this.emit('logged', info));

    if (!webhookUrl()) {
      callback();
      return;
    }

    const level = String(info.level);
    const message = String(info.message ?? '');
    const ctx =
      info.context && typeof info.context === 'object' ? { ...(info.context as Record<string, unknown>) } : {};
    const stack = typeof ctx.stack === 'string' ? ctx.stack : typeof info.stack === 'string' ? info.stack : null;

    queue = queue.then(() =>
      deliver(level, message, ctx, stack).catch((error) => {
        console.error('DiscordTransport: failed to deliver alert', error);
      }),
    );

    waitUntil(queue);
    callback();
  }
}
