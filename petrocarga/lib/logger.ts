const isDev =
  typeof window !== 'undefined' && process.env.NODE_ENV !== 'production';

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (isDev) console.debug(`[Notification] ${message}`, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    if (isDev) console.info(`[Notification] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[Notification] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[Notification] ${message}`, ...args);
  },

  // Aceita objetos/erros primeiro
  errorObj: (error: Error | unknown, context?: Record<string, unknown>) => {
    if (error instanceof Error) {
      console.error('[Notification]', error.message, error.stack, context);
    } else {
      console.error('[Notification]', error, context);
    }
  },
};
