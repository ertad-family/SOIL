"use client";

type LogLevel = "log" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

const MAX_LOG_ENTRIES = 50;
const logBuffer: LogEntry[] = [];
let isInitialized = false;

/**
 * Formats a log entry for display
 */
function formatLogEntry(entry: LogEntry): string {
  const levelPrefix = {
    log: "[LOG]",
    info: "[INFO]",
    warn: "[WARN]",
    error: "[ERROR]",
  };
  return `${entry.timestamp} ${levelPrefix[entry.level]} ${entry.message}`;
}

/**
 * Safely stringify any value for logging
 */
function stringifyArg(arg: unknown): string {
  if (arg === undefined) return "undefined";
  if (arg === null) return "null";
  if (typeof arg === "string") return arg;
  if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

/**
 * Creates a wrapped console method that captures logs
 */
function createLogWrapper(
  originalMethod: (...args: unknown[]) => void,
  level: LogLevel
): (...args: unknown[]) => void {
  return (...args: unknown[]) => {
    // Call original method first
    originalMethod.apply(console, args);

    // Capture the log
    const message = args.map(stringifyArg).join(" ");
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    logBuffer.push(entry);

    // Keep buffer at max size
    if (logBuffer.length > MAX_LOG_ENTRIES) {
      logBuffer.shift();
    }
  };
}

/**
 * Initialize console capture - call once at app startup
 * Safe to call multiple times (will only initialize once)
 */
export function initConsoleCapture(): void {
  if (isInitialized || typeof window === "undefined") return;

  const originalConsole = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };

  console.log = createLogWrapper(originalConsole.log, "log");
  console.info = createLogWrapper(originalConsole.info, "info");
  console.warn = createLogWrapper(originalConsole.warn, "warn");
  console.error = createLogWrapper(originalConsole.error, "error");

  isInitialized = true;
}

/**
 * Get captured console logs as formatted strings
 */
export function getConsoleLogs(): string[] {
  return logBuffer.map(formatLogEntry);
}

/**
 * Clear captured logs
 */
export function clearConsoleLogs(): void {
  logBuffer.length = 0;
}
