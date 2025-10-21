<template>
  <div class="blario-provider">
    <slot />
    <IssueReporterModal />
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, readonly, watch, onUnmounted } from 'vue';
import type { DiagnosticResponse, User } from '@blario/core';
import {
  getCaptureManager,
  resetCaptureManager,
  getStorageManager,
  resetStorageManager,
  getApiClient,
  resetApiClient,
} from '@blario/core';
import IssueReporterModal from './IssueReporterModal.vue';
import type { BlarioState, BlarioActions, BlarioContext } from '../plugin/BlarioPlugin';
import { BlarioKey } from '../plugin/BlarioPlugin';

export interface BlarioProviderProps {
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
}

const props = withDefaults(defineProps<BlarioProviderProps>(), {
  apiBaseUrl: 'https://api.blar.io',
  locale: 'en',
  capture: () => ({}),
  theme: () => ({}),
  redaction: () => ({}),
  rateLimit: () => ({}),
});

const emit = defineEmits<{
  afterSubmit: [issueId: string];
  error: [error: Error];
}>();

// Initialize managers
const captureManager = getCaptureManager(
  {
    maxConsoleLogs: props.capture?.maxConsoleLogs ?? 50,
    maxNetworkLogs: props.capture?.maxNetworkLogs ?? 20,
    captureConsole: props.capture?.console ?? true,
    captureNetwork: props.capture?.networkSample ?? false,
  },
  {
    getAppVersion: () => import.meta.env.VITE_APP_VERSION,
    getRelease: () => import.meta.env.VITE_RELEASE,
  }
);

const storageManager = getStorageManager();
const apiClient = getApiClient({
  apiBaseUrl: props.apiBaseUrl,
  publishableKey: props.publishableKey,
});

const rateLimitState = {
  requests: [] as number[],
  maxRequests: props.rateLimit?.maxRequests ?? 10,
  windowMs: props.rateLimit?.windowMs ?? 60000,
};

// Reactive state
const state = reactive<BlarioState>({
  config: {
    publishableKey: props.publishableKey,
    apiBaseUrl: props.apiBaseUrl,
    user: props.user,
    locale: props.locale,
    capture: {
      console: props.capture?.console ?? true,
      networkSample: props.capture?.networkSample ?? false,
      maxConsoleLogs: props.capture?.maxConsoleLogs ?? 50,
      maxNetworkLogs: props.capture?.maxNetworkLogs ?? 20,
    },
    theme: {
      mode: props.theme?.mode ?? 'light',
      position: props.theme?.position ?? 'bottom-right',
      accent: props.theme?.accent,
      className: props.theme?.className,
    },
    redaction: props.redaction,
    rateLimit: {
      maxRequests: props.rateLimit?.maxRequests ?? 10,
      windowMs: props.rateLimit?.windowMs ?? 60000,
    },
    onAfterSubmit: (issueId: string) => emit('afterSubmit', issueId),
    onError: (error: Error) => emit('error', error),
  },
  isModalOpen: false,
  reporterOptions: {},
  lastDiagnostic: null,
  isSubmitting: false,
  user: props.user,
  locale: props.locale,
});

// Start capture
captureManager.startCapture();

// Load latest diagnostic from storage
const latestDiagnostic = storageManager.getLatestDiagnostic();
if (latestDiagnostic && !latestDiagnostic.viewed) {
  state.lastDiagnostic = latestDiagnostic;
}

// Watch for theme changes
watch(() => props.theme?.mode, (mode) => {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}, { immediate: true });

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
      emit('error', error);
      throw error;
    }

    state.isSubmitting = true;

    try {
      const { attachments, ...formFields } = formData;

      const payload = {
        publishableKey: props.publishableKey,
        user: props.user,
        meta: captureManager.getCaptureMeta(),
        console: props.capture?.console !== false ? captureManager.getConsoleLogs() : undefined,
        network: props.capture?.networkSample ? captureManager.getNetworkLogs() : undefined,
        form: formFields,
      };

      const { issueId } = await apiClient.submitIssue(payload);

      emit('afterSubmit', issueId);

      return { issueId, status: 'pending' as const, diagnostic: undefined };
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to submit issue');
      emit('error', err);
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

provide(BlarioKey, context);

// Cleanup on unmount
onUnmounted(() => {
  captureManager.stopCapture();
  resetCaptureManager();
  resetStorageManager();
  resetApiClient();
});
</script>
