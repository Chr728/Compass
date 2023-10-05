import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Check if the application is running in a testing environment
const isTesting = process.env.NODE_ENV === 'test';

// Logger for general server logs
export const Logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss TZ',
    }),
    format.json(),
    format.errors({ stack: true })
  ),
  transports: [
    new transports.Console({
      format: format.printf((log) => log.message),
      silent: isTesting, // Silence console output during tests
    }),
    new DailyRotateFile({
      level: 'info',
      dirname: './logs',
      filename: 'info_log-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '7d',
      silent: isTesting, // Don't write log files during tests
    }),
    new DailyRotateFile({
      level: 'error',
      dirname: './logs',
      filename: 'error_log-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '7d',
      silent: isTesting, // Don't write log files during tests
    }),
  ],
});

// Logger for HTTP requests
export const RequestLogger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss TZ',
    }),
    format.json(),
    format.errors({ stack: true })
  ),
  transports: [
    new transports.Console({
      level: 'http',
      format: format.printf(
        (log) =>
          `${log.method} - ${log.status} - ${log.url} - ${log.response_time}ms`
      ),
      silent: isTesting, // Silence console output during tests
    }),
    new DailyRotateFile({
      level: 'http',
      dirname: './logs',
      filename: 'http_log-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '7d',
      silent: isTesting, // Don't write log files during tests
    }),
  ],
});
