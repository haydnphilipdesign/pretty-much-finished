/**
 * Logging utility for better diagnostics
 * Provides enhanced logging with context and severity levels
 */

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

// Log entry interface
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: any;
}

// Global configuration
let config = {
  enableConsole: true,
  minLevel: LogLevel.DEBUG,
  enableStorage: true,
  maxStoredLogs: 100,
  enableServerLogging: false,
  serverLogEndpoint: '/api/log'
};

// Storage for logs
const logStorage: LogEntry[] = [];

/**
 * Configure the logger
 * @param options Configuration options
 */
export function configureLogger(options: Partial<typeof config>) {
  config = { ...config, ...options };
}

/**
 * Format a log entry for display
 * @param entry The log entry to format
 * @returns Formatted log entry string
 */
function formatLogEntry(entry: LogEntry): string {
  return `[${entry.timestamp}] [${entry.level}] [${entry.context}] ${entry.message}`;
}

/**
 * Create a log entry
 * @param level Log level
 * @param context Context or component name
 * @param message Log message
 * @param data Optional data object
 */
function createLogEntry(level: LogLevel, context: string, message: string, data?: any): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    context,
    message,
    data
  };

  // Store in memory if enabled
  if (config.enableStorage) {
    logStorage.push(entry);
    while (logStorage.length > config.maxStoredLogs) {
      logStorage.shift();
    }
  }

  // Output to console if enabled and level is sufficient
  if (config.enableConsole && isLevelEnabled(level)) {
    const formattedEntry = formatLogEntry(entry);
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedEntry, data);
        break;
      case LogLevel.INFO:
        console.info(formattedEntry, data);
        break;
      case LogLevel.WARN:
        console.warn(formattedEntry, data);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedEntry, data);
        break;
    }
  }

  // Send to server if enabled
  if (config.enableServerLogging && isLevelEnabled(level)) {
    sendToServer(entry).catch(err => {
      console.error('Failed to send log to server:', err);
    });
  }

  return entry;
}

/**
 * Check if a log level is enabled based on configuration
 * @param level The log level to check
 * @returns True if the level is enabled
 */
function isLevelEnabled(level: LogLevel): boolean {
  const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL];
  const configLevelIndex = levels.indexOf(config.minLevel);
  const levelIndex = levels.indexOf(level);
  return levelIndex >= configLevelIndex;
}

/**
 * Send a log entry to the server
 * @param entry The log entry to send
 */
async function sendToServer(entry: LogEntry): Promise<void> {
  try {
    await fetch(config.serverLogEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    });
  } catch (error) {
    console.error('Error sending log to server:', error);
  }
}

/**
 * Get all stored logs
 * @returns Array of stored log entries
 */
export function getStoredLogs(): LogEntry[] {
  return [...logStorage];
}

/**
 * Clear all stored logs
 */
export function clearStoredLogs(): void {
  logStorage.length = 0;
}

/**
 * Export logs as JSON
 * @returns JSON string of logs
 */
export function exportLogs(): string {
  return JSON.stringify(logStorage, null, 2);
}

/**
 * Download logs as a file
 */
export function downloadLogs(): void {
  const json = exportLogs();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `logs-${new Date().toISOString().replace(/:/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Debug level log
 * @param context Context or component name
 * @param message Log message
 * @param data Optional data object
 */
export function debug(context: string, message: string, data?: any): void {
  createLogEntry(LogLevel.DEBUG, context, message, data);
}

/**
 * Info level log
 * @param context Context or component name
 * @param message Log message
 * @param data Optional data object
 */
export function info(context: string, message: string, data?: any): void {
  createLogEntry(LogLevel.INFO, context, message, data);
}

/**
 * Warning level log
 * @param context Context or component name
 * @param message Log message
 * @param data Optional data object
 */
export function warn(context: string, message: string, data?: any): void {
  createLogEntry(LogLevel.WARN, context, message, data);
}

/**
 * Error level log
 * @param context Context or component name
 * @param message Log message
 * @param data Optional data object
 */
export function error(context: string, message: string, data?: any): void {
  createLogEntry(LogLevel.ERROR, context, message, data);
}

/**
 * Fatal error log
 * @param context Context or component name
 * @param message Log message
 * @param data Optional data object
 */
export function fatal(context: string, message: string, data?: any): void {
  createLogEntry(LogLevel.FATAL, context, message, data);
}

/**
 * Create a logger instance for a specific context
 * @param contextName The context name
 * @returns Logger object
 */
export function createLogger(contextName: string) {
  return {
    debug: (message: string, data?: any) => debug(contextName, message, data),
    info: (message: string, data?: any) => info(contextName, message, data),
    warn: (message: string, data?: any) => warn(contextName, message, data),
    error: (message: string, data?: any) => error(contextName, message, data),
    fatal: (message: string, data?: any) => fatal(contextName, message, data)
  };
}

// Default export
export default {
  debug,
  info,
  warn,
  error,
  fatal,
  createLogger,
  getStoredLogs,
  clearStoredLogs,
  exportLogs,
  downloadLogs,
  configureLogger,
  LogLevel
};