/**
 * Simple logger utility for BriefButler connector
 */

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const LOG_LEVEL = process.env.LOG_LEVEL 
  ? (process.env.LOG_LEVEL.toUpperCase() as keyof typeof LogLevel) 
  : 'INFO';

const CURRENT_LEVEL = LogLevel[LOG_LEVEL] !== undefined 
  ? LogLevel[LOG_LEVEL] 
  : LogLevel.INFO;

/**
 * Formats a log message with a timestamp
 * @param level Log level
 * @param message Message to log
 * @param args Additional arguments
 * @returns Formatted log message
 */
const formatLog = (level: string, message: string, ...args: any[]) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  return `${timestamp} ${level}: ${message} ${args.length ? JSON.stringify(args) : ''}`;
};

/**
 * Logger utility
 */
export const logger = {
  /**
   * Log a debug message
   * @param message Message to log
   * @param args Additional arguments
   */
  debug: (message: string, ...args: any[]) => {
    if (CURRENT_LEVEL <= LogLevel.DEBUG) {
      console.debug(formatLog('debug', message, ...args));
    }
  },

  /**
   * Log an info message
   * @param message Message to log
   * @param args Additional arguments
   */
  info: (message: string, ...args: any[]) => {
    if (CURRENT_LEVEL <= LogLevel.INFO) {
      console.info(formatLog('info', message, ...args));
    }
  },

  /**
   * Log a warning message
   * @param message Message to log
   * @param args Additional arguments
   */
  warn: (message: string, ...args: any[]) => {
    if (CURRENT_LEVEL <= LogLevel.WARN) {
      console.warn(formatLog('warn', message, ...args));
    }
  },

  /**
   * Log an error message
   * @param message Message to log
   * @param args Additional arguments
   */
  error: (message: string, ...args: any[]) => {
    if (CURRENT_LEVEL <= LogLevel.ERROR) {
      console.error(formatLog('error', message, ...args));
    }
  }
};