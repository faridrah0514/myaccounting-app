import { createLogger, format, transports } from 'winston'

// Base logger configuration
const logger = (tag: string) => {
  return createLogger({
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss', // Customize the timestamp format
      }),
      format.colorize({ all: false }), // Colorize only the log level
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] [${tag}] ${level}: ${message}`
      })
    ),
    transports: [
      new transports.Console(), // Log to the console
    ],
  })
}

export default logger
