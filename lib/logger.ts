// Sistema de logging para producción
// En desarrollo muestra logs, en producción solo errores críticos

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Errores siempre se muestran
    console.error(...args);
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

// Logger del lado del cliente (para componentes React)
// En producción, los errores se muestran pero los logs no
export const clientLogger = {
  log: (...args: unknown[]) => {
    if (isDevelopment && typeof window !== "undefined") {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment && typeof window !== "undefined") {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Errores siempre se muestran en el cliente
    if (typeof window !== "undefined") {
      console.error(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (isDevelopment && typeof window !== "undefined") {
      console.info(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (isDevelopment && typeof window !== "undefined") {
      console.debug(...args);
    }
  },
};

