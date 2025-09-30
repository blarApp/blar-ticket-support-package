import type { ConsoleLog, NetworkLog, Meta, Viewport } from './schemas';

interface CaptureConfig {
  maxConsoleLogs: number;
  maxNetworkLogs: number;
  captureConsole: boolean;
  captureNetwork: boolean;
}

class RingBuffer<T> {
  private buffer: T[] = [];
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  push(item: T): void {
    this.buffer.push(item);
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }
  }

  getAll(): T[] {
    return [...this.buffer];
  }

  clear(): void {
    this.buffer = [];
  }
}

export class CaptureManager {
  private consoleLogs: RingBuffer<ConsoleLog>;
  private networkLogs: RingBuffer<NetworkLog>;
  private config: CaptureConfig;
  private originalConsole: Record<string, any> = {};
  private routeHistory: string[] = [];
  private isCapturing = false;

  constructor(config: Partial<CaptureConfig> = {}) {
    this.config = {
      maxConsoleLogs: config.maxConsoleLogs ?? 50,
      maxNetworkLogs: config.maxNetworkLogs ?? 20,
      captureConsole: config.captureConsole ?? true,
      captureNetwork: config.captureNetwork ?? false,
    };

    this.consoleLogs = new RingBuffer(this.config.maxConsoleLogs);
    this.networkLogs = new RingBuffer(this.config.maxNetworkLogs);
  }

  startCapture(): void {
    if (this.isCapturing) return;
    this.isCapturing = true;

    if (this.config.captureConsole) {
      this.captureConsole();
    }

    if (this.config.captureNetwork) {
      this.captureNetworkRequests();
    }
  }

  stopCapture(): void {
    if (!this.isCapturing) return;
    this.isCapturing = false;

    this.restoreConsole();
  }

  private captureConsole(): void {
    if (typeof window === 'undefined') return;

    const levels: Array<'error' | 'warn' | 'info' | 'log'> = ['error', 'warn', 'info', 'log'];

    levels.forEach(level => {
      this.originalConsole[level] = console[level];

      console[level] = (...args: any[]) => {
        const message = args
          .map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          })
          .join(' ');

        const log: ConsoleLog = {
          level,
          message: this.redactSensitiveData(message),
          ts: Date.now(),
        };

        if (level === 'error' && args[0] instanceof Error) {
          log.stack = args[0].stack;
        }

        this.consoleLogs.push(log);
        this.originalConsole[level](...args);
      };
    });
  }

  private restoreConsole(): void {
    Object.keys(this.originalConsole).forEach(level => {
      (console as any)[level] = this.originalConsole[level];
    });
  }

  private captureNetworkRequests(): void {
    if (typeof window === 'undefined' || !window.fetch) return;

    const originalFetch = window.fetch;

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const startTime = Date.now();
      const [input, init] = args;

      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const method = init?.method ?? 'GET';

      try {
        const response = await originalFetch(...args);

        const log: NetworkLog = {
          url: this.redactSensitiveData(url),
          method,
          status: response.status,
          durationMs: Date.now() - startTime,
          ts: startTime,
        };

        this.networkLogs.push(log);
        return response;
      } catch (error) {
        const log: NetworkLog = {
          url: this.redactSensitiveData(url),
          method,
          status: 0,
          durationMs: Date.now() - startTime,
          ts: startTime,
        };

        this.networkLogs.push(log);
        throw error;
      }
    };
  }

  private redactSensitiveData(text: string): string {
    const patterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
      /\b\d{3}-\d{2}-\d{4}\b/g,
      /Bearer\s+[A-Za-z0-9\-._~+\/]+=*/g,
      /api[_-]?key["\']?\s*[:=]\s*["\']?[A-Za-z0-9\-._~+\/]+/gi,
      /password["\']?\s*[:=]\s*["\']?[^\s"']+/gi,
      /secret["\']?\s*[:=]\s*["\']?[^\s"']+/gi,
      /token["\']?\s*[:=]\s*["\']?[A-Za-z0-9\-._~+\/]+/gi,
    ];

    let redacted = text;
    patterns.forEach(pattern => {
      redacted = redacted.replace(pattern, '[REDACTED]');
    });

    return redacted;
  }

  trackRoute(route: string): void {
    this.routeHistory.push(route);
    if (this.routeHistory.length > 10) {
      this.routeHistory.shift();
    }
  }

  getCaptureMeta(): Meta {
    if (typeof window === 'undefined') {
      return {
        url: '',
        route: '',
        ts: Date.now(),
        viewport: { w: 0, h: 0 },
      };
    }

    const viewport: Viewport = {
      w: window.innerWidth ?? 0,
      h: window.innerHeight ?? 0,
    };

    return {
      url: window.location.href,
      route: this.routeHistory[this.routeHistory.length - 1] ?? window.location.pathname,
      ts: Date.now(),
      locale: navigator.language,
      viewport,
      ua: navigator.userAgent,
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
      release: process.env.NEXT_PUBLIC_RELEASE,
    };
  }

  getConsoleLogs(): ConsoleLog[] {
    return this.consoleLogs.getAll();
  }

  getNetworkLogs(): NetworkLog[] {
    return this.networkLogs.getAll();
  }

  getRouteHistory(): string[] {
    return [...this.routeHistory];
  }

  clearAll(): void {
    this.consoleLogs.clear();
    this.networkLogs.clear();
    this.routeHistory = [];
  }
}

let captureManagerInstance: CaptureManager | null = null;

export function getCaptureManager(config?: Partial<CaptureConfig>): CaptureManager {
  if (!captureManagerInstance) {
    captureManagerInstance = new CaptureManager(config);
  }
  return captureManagerInstance;
}

export function resetCaptureManager(): void {
  if (captureManagerInstance) {
    captureManagerInstance.stopCapture();
    captureManagerInstance = null;
  }
}