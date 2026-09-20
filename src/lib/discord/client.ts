const TIMEOUT_MS = 8000;
const DEFAULT_RETRY_MS = 5000;
const DEFAULT_USERNAME = 'Pyramid Portfolio Alerts';

export type DiscordEmbedField = {
  name: string;
  value: string;
  inline?: boolean;
};

export type DiscordEmbed = {
  title: string;
  description: string;
  color: number;
  timestamp: string;
  fields?: DiscordEmbedField[];
  footer?: { text: string };
};

export type DiscordSendResult = { ok: true } | { ok: false; retryAfterMs: number | null };

function username(): string {
  return process.env.DISCORD_ALERT_USERNAME?.trim() || DEFAULT_USERNAME;
}

export function webhookUrl(): string | null {
  const raw = process.env.DISCORD_WEBHOOK_URL;
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed === '' ? null : trimmed;
}

async function retryAfterMsFrom(res: Response): Promise<number> {
  const header = Number(res.headers.get('retry-after'));
  if (Number.isFinite(header) && header > 0) return header * 1000;

  try {
    const body = (await res.json()) as { retry_after?: unknown };
    if (typeof body.retry_after === 'number' && body.retry_after > 0) {
      return body.retry_after * 1000;
    }
  } catch {
    return DEFAULT_RETRY_MS;
  }

  return DEFAULT_RETRY_MS;
}

export async function sendEmbed(embed: DiscordEmbed): Promise<DiscordSendResult> {
  const url = webhookUrl();
  if (!url) return { ok: false, retryAfterMs: null };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username(), embeds: [embed] }),
      signal: controller.signal,
    });

    if (res.ok) return { ok: true };

    if (res.status === 429) {
      return { ok: false, retryAfterMs: await retryAfterMsFrom(res) };
    }

    console.error(`discord: webhook responded ${res.status}`);
    return { ok: false, retryAfterMs: null };
  } catch (error) {
    console.error('discord: webhook request failed', error);
    return { ok: false, retryAfterMs: null };
  } finally {
    clearTimeout(timer);
  }
}
