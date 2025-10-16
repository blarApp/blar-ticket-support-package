import type { App, Plugin, InjectionKey } from 'vue';
import type { Router } from 'vue-router';
import { reactive, readonly } from 'vue';
import type { BlarioConfig, DiagnosticResponse, User } from '@blario/core';
import {
  getCaptureManager,
  resetCaptureManager,
  getStorageManager,
  resetStorageManager,
  getApiClient,
  resetApiClient,
} from '@blario/core';

export interface BlarioPluginOptions {
  publishableKey: string;
  apiBaseUrl?: string;
  user?: User;
  locale?: 'en' | 'es';
  capture?: {
    console?: boolean;
    networkSample?: boolean;
    maxConsoleLogs?: number;
    maxNetworkLogs?: number;
  };
  theme?: {
    mode?: 'light' | 'dark';
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    accent?: string;
    className?: string;
  };
  redaction?: {
    patterns?: RegExp[];
    customRedactor?: (text: string) => string;
  };
  rateLimit?: {
    maxRequests?: number;
    windowMs?: number;
  };
  onAfterSubmit?: (issueId: string) => void;
  onError?: (error: Error) => void;
}

export interface BlarioState {
  config: BlarioConfig;
  isModalOpen: boolean;
  reporterOptions: { category?: string; prefill?: Record<string, any> };
  lastDiagnostic: DiagnosticResponse | null;
  isSubmitting: boolean;
  user?: User;
  locale: 'en' | 'es';
}

export interface BlarioActions {
  openReporter: (options?: { category?: string; prefill?: Record<string, any> }) => void;
  closeReporter: () => void;
  submitIssue: (formData: any) => Promise<DiagnosticResponse | null>;
  clearDiagnostic: () => void;
}

export type BlarioContext = {
  state: Readonly<BlarioState>;
  actions: BlarioActions;
};

export const BlarioKey: InjectionKey<BlarioContext> = Symbol('blario');

export const BlarioPlugin: Plugin<BlarioPluginOptions> = {
  install(app: App, options: BlarioPluginOptions) {
    const {
      publishableKey,
      apiBaseUrl = 'https://api.blar.io',
      user,
      locale = 'en',
      capture = {},
      theme = {},
      redaction = {},
      rateLimit = {},
      onAfterSubmit,
      onError,
    } = options;

    // Initialize managers
    const captureManager = getCaptureManager(
      {
        maxConsoleLogs: capture.maxConsoleLogs ?? 50,
        maxNetworkLogs: capture.maxNetworkLogs ?? 20,
        captureConsole: capture.console ?? true,
        captureNetwork: capture.networkSample ?? false,
      },
      {
        getAppVersion: () => import.meta.env.VITE_APP_VERSION,
        getRelease: () => import.meta.env.VITE_RELEASE,
      }
    );

    const storageManager = getStorageManager();
    const apiClient = getApiClient({
      apiBaseUrl,
      publishableKey,
    });

    const rateLimitState = {
      requests: [] as number[],
      maxRequests: rateLimit.maxRequests ?? 10,
      windowMs: rateLimit.windowMs ?? 60000,
    };

    // Reactive state
    const state = reactive<BlarioState>({
      config: {
        publishableKey,
        apiBaseUrl,
        user,
        locale,
        capture: {
          console: capture.console ?? true,
          networkSample: capture.networkSample ?? false,
          maxConsoleLogs: capture.maxConsoleLogs ?? 50,
          maxNetworkLogs: capture.maxNetworkLogs ?? 20,
        },
        theme: {
          mode: theme.mode ?? 'light',
          position: theme.position ?? 'bottom-right',
          accent: theme.accent,
          className: theme.className,
        },
        redaction,
        rateLimit: {
          maxRequests: rateLimit.maxRequests ?? 10,
          windowMs: rateLimit.windowMs ?? 60000,
        },
        onAfterSubmit,
        onError,
      },
      isModalOpen: false,
      reporterOptions: {},
      lastDiagnostic: null,
      isSubmitting: false,
      user,
      locale,
    });

    // Start capture
    captureManager.startCapture();

    // Load latest diagnostic from storage
    const latestDiagnostic = storageManager.getLatestDiagnostic();
    if (latestDiagnostic && !latestDiagnostic.viewed) {
      state.lastDiagnostic = latestDiagnostic;
    }

    // Apply dark mode
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (theme.mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    const checkRateLimit = (): boolean => {
      const now = Date.now();
      const { requests, maxRequests, windowMs } = rateLimitState;

      const validRequests = requests.filter(time => now - time < windowMs);
      rateLimitState.requests = validRequests;

      if (validRequests.length >= maxRequests) {
        return false;
      }

      rateLimitState.requests.push(now);
      return true;
    };

    // Actions
    const actions: BlarioActions = {
      openReporter(opts = {}) {
        state.reporterOptions = opts;
        state.isModalOpen = true;
      },

      closeReporter() {
        state.isModalOpen = false;
        state.reporterOptions = {};
      },

      async submitIssue(formData: any): Promise<DiagnosticResponse | null> {
        if (!checkRateLimit()) {
          const error = new Error('Rate limit exceeded. Please try again later.');
          onError?.(error);
          throw error;
        }

        state.isSubmitting = true;

        try {
          const { attachments, ...formFields } = formData;

          const payload = {
            publishableKey,
            user,
            meta: captureManager.getCaptureMeta(),
            console: capture.console !== false ? captureManager.getConsoleLogs() : undefined,
            network: capture.networkSample ? captureManager.getNetworkLogs() : undefined,
            form: formFields,
          };

          const { issueId } = await apiClient.submitIssue(payload);

          onAfterSubmit?.(issueId);

          return { issueId, status: 'pending' as const, diagnostic: undefined };
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to submit issue');
          onError?.(err);
          throw err;
        } finally {
          state.isSubmitting = false;
        }
      },

      clearDiagnostic() {
        if (state.lastDiagnostic?.issueId) {
          storageManager.markDiagnosticAsViewed(state.lastDiagnostic.issueId);
        }
        state.lastDiagnostic = null;
      },
    };

    // Provide context
    const context: BlarioContext = {
      state: readonly(state) as Readonly<BlarioState>,
      actions,
    };

    app.provide(BlarioKey, context);

    // Cleanup on unmount
    app.config.globalProperties.$blario = context;

    // Optional: Integrate with Vue Router for route tracking
    const router = app.config.globalProperties.$router as Router | undefined;
    if (router) {
      router.afterEach((to) => {
        captureManager.trackRoute(to.fullPath);
      });
    }

    // Cleanup function (called when app is unmounted)
    const cleanup = () => {
      captureManager.stopCapture();
      resetCaptureManager();
      resetStorageManager();
      resetApiClient();
    };

    // Store cleanup for potential use
    (app.config.globalProperties as any).__blarioCleanup = cleanup;
  },
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $blario: BlarioContext;
  }
}
