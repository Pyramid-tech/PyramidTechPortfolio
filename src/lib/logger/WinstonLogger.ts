import winston from 'winston';

import { DbTransport } from './DbTransport';
import { callSite, describeError } from './describe-error';
import { alertLevel, DiscordTransport } from './DiscordTransport';
import type { ILogger } from './interfaces/ILogger';

const LEVELS = {
  emergency: 0,
  alert: 1,
  critical: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
};

winston.addColors({
  emergency: 'red',
  alert: 'red',
  critical: 'red',
  error: 'red',
  warning: 'yellow',
  notice: 'cyan',
  info: 'green',
  debug: 'blue',
});

const consoleLine = winston.format.printf((info) => {
  const context =
    info.context && typeof info.context === 'object'
      ? { ...(info.context as Record<string, unknown>) }
      : {};
  const stack = typeof context.stack === 'string' ? context.stack : null;
  delete context.stack;

  let details = '';
  if (Object.keys(context).length > 0) {
    try {
      details = ` ${JSON.stringify(context)}`;
    } catch {
      details = ' [context could not be serialised]';
    }
  }

  const trace = stack
    ? `\n${stack
        .split('\n')
        .map((line) => `    ${line.trim()}`)
        .join('\n')}`
    : '';

  return `${String(info.timestamp)} ${info.level}: ${String(info.message)}${details}${trace}`;
});

function withTrace(
  level: keyof typeof LEVELS,
  context?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  const traced = LEVELS[level] <= LEVELS.error;
  if (!context && !traced) return undefined;

  const ctx: Record<string, unknown> = { ...context };
  let stack = typeof ctx.stack === 'string' ? ctx.stack : null;

  for (const [key, value] of Object.entries(ctx)) {
    if (!(value instanceof Error)) continue;
    const details = describeError(value);
    ctx[key] = details.summary;
    stack ??= details.stack;
  }

  if (!stack && traced) stack = callSite();
  if (stack) ctx.stack = stack;
  return ctx;
}

const instance = winston.createLogger({
  levels: LEVELS,
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
  ),
  transports: [
    new DbTransport({ level: 'warning' }),
    new DiscordTransport({ level: alertLevel() }),
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), consoleLine),
          }),
        ]
      : []),
  ],
});

export class WinstonLogger implements ILogger {
  private log(level: keyof typeof LEVELS, message: string, context?: Record<string, unknown>) {
    const traced = withTrace(level, context);
    instance.log(level, message, traced ? { context: traced } : {});
  }

  emergency(message: string, context?: Record<string, unknown>) {
    this.log('emergency', message, context);
  }
  alert(message: string, context?: Record<string, unknown>) {
    this.log('alert', message, context);
  }
  critical(message: string, context?: Record<string, unknown>) {
    this.log('critical', message, context);
  }
  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  }
  warning(message: string, context?: Record<string, unknown>) {
    this.log('warning', message, context);
  }
  notice(message: string, context?: Record<string, unknown>) {
    this.log('notice', message, context);
  }
  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }
  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }
}
