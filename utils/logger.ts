import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    // Write all logs with `error` level to `logs/error.log`
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with `info` level and below to `logs/combined.log`
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// In development, also log to the console with colorized output
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    })
  );
}

export default logger;
