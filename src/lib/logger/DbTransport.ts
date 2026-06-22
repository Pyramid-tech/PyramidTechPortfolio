import Transport from 'winston-transport';

import { db } from '@/lib/db';
import { pyramidLog } from '@/lib/db/schema/log';


const RESERVED_KEYS = ['source', 'requestId', 'url', 'method', 'stack'] as const;

export class DbTransport extends Transport {
  log(info: Record<string, unknown>, callback: () => void): void {
    setImmediate(() => this.emit('logged', info));

    const ctx =
      info.context && typeof info.context === 'object'
        ? { ...(info.context as Record<string, unknown>) }
        : {};

    const pickString = (key: string): string | null =>
      typeof ctx[key] === 'string' ? (ctx[key] as string) : null;

    const source = pickString('source');
    const requestId = pickString('requestId');
    const url = pickString('url');
    const method = pickString('method');

    const stack = pickString('stack') ?? (typeof info.stack === 'string' ? info.stack : null);

    for (const key of RESERVED_KEYS) delete ctx[key];

    db.insert(pyramidLog)
      .values({
        level: String(info.level),
        message: String(info.message ?? ''),
        context: Object.keys(ctx).length > 0 ? ctx : null,
        stack,
        source,
        requestId,
        url,
        method,
        environment: process.env.NODE_ENV ?? 'development',
      })
      .catch((err) => console.error('DbTransport: failed to persist log', err));

    callback();
  }
}
