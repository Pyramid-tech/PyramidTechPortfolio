const MAX_DEPTH = 3;
const MAX_HEADLINE_CHARS = 300;
const ROOT = `${process.cwd()}/`;

export interface ErrorDetails {
  summary: string;
  stack: string | null;
}

export function shortenPaths(stack: string): string {
  return stack.split(ROOT).join('');
}

function plain(value: unknown): string {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

function headline(error: Error): string {
  const code = (error as { code?: unknown }).code;
  const name =
    typeof code === 'string' || typeof code === 'number' ? `${error.name} [${code}]` : error.name;
  const message = error.message.replace(/\s+/g, ' ').trim();
  const text = message ? `${name}: ${message}` : name;
  return text.length <= MAX_HEADLINE_CHARS ? text : `${text.slice(0, MAX_HEADLINE_CHARS - 1)}…`;
}

function frames(error: Error): string[] {
  return (error.stack ?? '').split('\n').filter((line) => /^\s+at /.test(line));
}

export function describeError(value: unknown, depth = 0): ErrorDetails {
  if (!(value instanceof Error)) return { summary: plain(value), stack: null };

  const nested = depth < MAX_DEPTH;
  const inner = (value as { errors?: unknown }).errors;
  const innerDetails =
    nested && Array.isArray(inner) ? inner.map((item) => describeError(item, depth + 1)) : [];
  const causeDetails =
    nested && value.cause !== undefined ? describeError(value.cause, depth + 1) : null;

  let summary = headline(value);
  if (innerDetails.length > 0) {
    summary += ` (${innerDetails.map((item) => item.summary).join('; ')})`;
  }
  if (causeDetails) summary += ` (cause: ${causeDetails.summary})`;

  const stack = [headline(value), ...frames(value).map(shortenPaths)];
  innerDetails.forEach((item, index) => {
    stack.push(`Inner error ${index + 1}: ${item.stack ?? item.summary}`);
  });
  if (causeDetails) stack.push(`Caused by: ${causeDetails.stack ?? causeDetails.summary}`);

  return { summary, stack: stack.join('\n') };
}

export function callSite(): string | null {
  const stack = new Error().stack;
  if (!stack) return null;

  const frames = stack
    .split('\n')
    .slice(1)
    .filter((line) => !line.includes('/lib/logger/') && !line.includes('node_modules/winston'));
  return frames.length > 0 ? `Logged at:\n${shortenPaths(frames.join('\n'))}` : null;
}
