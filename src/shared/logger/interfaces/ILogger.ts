export interface ILogger {
  emergency(message: string, context?: Record<string, unknown>): void;
  alert(message: string, context?: Record<string, unknown>): void;
  critical(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  warning(message: string, context?: Record<string, unknown>): void;
  notice(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}
