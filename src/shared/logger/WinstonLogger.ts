import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import type { ILogger } from './interfaces/ILogger';

// Laravel PSR-3 levels mapped to syslog severity numbers
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

const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const rotatingTransport = new DailyRotateFile({
  dirname: 'logs',
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d',
  zippedArchive: true,
  format: jsonFormat,
});

const instance = winston.createLogger({
  levels: LEVELS,
  level: 'debug',
  transports: [
    rotatingTransport,
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
          }),
        ]
      : []),
  ],
});

export class WinstonLogger implements ILogger {
  private log(level: keyof typeof LEVELS, message: string, context?: Record<string, unknown>) {
    instance.log(level, message, context ? { context } : {});
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
