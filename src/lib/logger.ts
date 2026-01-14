type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export const logger = {
  log(level: LogLevel, message: string, metadata: Record<string, any> = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...metadata,
    };

    if (level === 'ERROR') {
      console.error(JSON.stringify(logEntry));
    } else if (level === 'WARN') {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  },

  info(message: string, metadata?: Record<string, any>) {
    this.log('INFO', message, metadata);
  },

  warn(message: string, metadata?: Record<string, any>) {
    this.log('WARN', message, metadata);
  },

  error(message: string, metadata?: Record<string, any>) {
    this.log('ERROR', message, metadata);
  },

  payment(message: string, orderId: string, metadata?: Record<string, any>) {
    this.log('INFO', `[PAYMENT] ${message}`, { orderId, ...metadata });
  }
};
