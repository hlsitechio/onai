/**
 * Logger Utility for OneAI
 * 
 * This file provides a centralized logging system with different log levels,
 * formatting, and the ability to enable/disable logging based on environment.
 */

// Log levels with color codes for console
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

// Log level colors
const LOG_COLORS = {
  [LogLevel.DEBUG]: '#6c757d', // gray
  [LogLevel.INFO]: '#0d6efd',  // blue
  [LogLevel.WARN]: '#ffc107',  // yellow
  [LogLevel.ERROR]: '#dc3545', // red
};

// Logger configuration
export interface LoggerConfig {
  minLevel: LogLevel;
  enabledInProduction: boolean;
  includeTimestamp: boolean;
  logToConsole: boolean;
  consoleColors: boolean;
}

// Default logger configuration
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: LogLevel.INFO,
  enabledInProduction: false,
  includeTimestamp: true,
  logToConsole: true,
  consoleColors: true,
};

// Current configuration (can be modified at runtime)
let currentConfig: LoggerConfig = { ...DEFAULT_CONFIG };

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Log entry with metadata
 */
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  source: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Logger instance for a specific source
 */
export interface Logger {
  debug: (message: string, data?: Record<string, any>) => void;
  info: (message: string, data?: Record<string, any>) => void;
  warn: (message: string, data?: Record<string, any>) => void;
  error: (message: string, data?: Record<string, any>) => void;
}

/**
 * In-memory log storage (limited size)
 */
const logBuffer: LogEntry[] = [];
const MAX_LOG_BUFFER_SIZE = 1000;

/**
 * Log an entry to console and memory buffer
 */
function logEntry(entry: LogEntry): void {
  // Skip logging if disabled in production
  if (isProduction && !currentConfig.enabledInProduction) {
    return;
  }
  
  // Skip if below minimum level
  if (getLevelValue(entry.level) < getLevelValue(currentConfig.minLevel)) {
    return;
  }
  
  // Add to memory buffer
  logBuffer.push(entry);
  
  // Trim buffer if it exceeds max size
  if (logBuffer.length > MAX_LOG_BUFFER_SIZE) {
    logBuffer.shift();
  }
  
  // Log to console if enabled
  if (currentConfig.logToConsole) {
    logToConsole(entry);
  }
}

/**
 * Log to console with formatting
 */
function logToConsole(entry: LogEntry): void {
  const timestamp = currentConfig.includeTimestamp
    ? `[${entry.timestamp.toISOString()}]`
    : '';
  
  const source = entry.source ? `[${entry.source}]` : '';
  
  const prefix = `${timestamp} ${entry.level} ${source}`;
  
  if (currentConfig.consoleColors) {
    const color = LOG_COLORS[entry.level] || '#000000';
    console.log(
      `%c${prefix}%c ${entry.message}`,
      `color: ${color}; font-weight: bold;`,
      'color: inherit;',
      entry.data || ''
    );
  } else {
    console.log(prefix, entry.message, entry.data || '');
  }
}

/**
 * Get numeric value for log level (for comparisons)
 */
function getLevelValue(level: LogLevel): number {
  switch (level) {
    case LogLevel.DEBUG: return 0;
    case LogLevel.INFO: return 1;
    case LogLevel.WARN: return 2;
    case LogLevel.ERROR: return 3;
    default: return 1;
  }
}

/**
 * Create a logger for a specific source
 */
export function createLogger(source: string): Logger {
  return {
    debug: (message: string, data?: Record<string, any>) => {
      logEntry({
        timestamp: new Date(),
        level: LogLevel.DEBUG,
        source,
        message,
        data,
      });
    },
    
    info: (message: string, data?: Record<string, any>) => {
      logEntry({
        timestamp: new Date(),
        level: LogLevel.INFO,
        source,
        message,
        data,
      });
    },
    
    warn: (message: string, data?: Record<string, any>) => {
      logEntry({
        timestamp: new Date(),
        level: LogLevel.WARN,
        source,
        message,
        data,
      });
    },
    
    error: (message: string, data?: Record<string, any>) => {
      logEntry({
        timestamp: new Date(),
        level: LogLevel.ERROR,
        source,
        message,
        data,
      });
    },
  };
}

/**
 * Configure the logger
 */
export function configureLogger(config: Partial<LoggerConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Get all logs in the buffer
 */
export function getLogs(): LogEntry[] {
  return [...logBuffer];
}

/**
 * Clear the log buffer
 */
export function clearLogs(): void {
  logBuffer.length = 0;
}

// Create a default logger for general use
export const logger = createLogger('App');

export default {
  createLogger,
  configureLogger,
  getLogs,
  clearLogs,
  LogLevel,
  logger,
};
