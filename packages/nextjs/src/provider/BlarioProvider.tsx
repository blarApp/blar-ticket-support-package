'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { getApiClient, resetApiClient } from '@blario/core';
import { getCaptureManager, resetCaptureManager } from '@blario/core';
import type {
  BlarioConfig,
  ChatHistoryMessage,
  DiagnosticResponse,
  TriageResponse,
  TriageSuggestedMeta,
} from '@blario/core';
import { getStorageManager, resetStorageManager } from '@blario/core';
import '../styles/theme.css';
import { IssueReporterModal } from '@/ui/IssueReporterModal';

export interface ReporterOptions {
  category?: string;
  chatHistory?: ChatHistoryMessage[];
}

export type ReporterOpenOptions = ReporterOptions;

export interface TriageData {
  summary?: string;
  steps?: string;
  expected?: string;
  actual?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  meta?: TriageSuggestedMeta;
}

export interface BlarioContextValue {
  config: BlarioConfig;
  isModalOpen: boolean;
  openReporter: (options?: ReporterOpenOptions) => void;
  closeReporter: () => void;
  reporterOptions?: ReporterOptions;
  triageData?: TriageData;
  lastDiagnostic: DiagnosticResponse | null;
  isSubmitting: boolean;
  submitIssue: (formData: any) => Promise<DiagnosticResponse | null>;
  clearDiagnostic: () => void;
  reportBy?: string;
  locale: 'en' | 'es';
  isGeneratingDescription: boolean;
  generatePrefillFromMessages: (messages: ChatHistoryMessage[]) => void;
  isSupportChatOpen: boolean;
  openSupportChat: () => void;
  closeSupportChat: () => void;
}

const BlarioContext = createContext<BlarioContextValue | null>(null);

export interface BlarioProviderProps {
  publishableKey: string;
  apiBaseUrl?: string;
  reportBy?: string;
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
  children: ReactNode;
}

export function BlarioProvider({
  publishableKey,
  apiBaseUrl = 'https://api.blar.io',
  reportBy,
  locale = 'en',
  capture = {},
  theme = {},
  redaction = {},
  rateLimit = {},
  onAfterSubmit,
  onError,
  children,
}: BlarioProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reporterOptions, setReporterOptions] = useState<ReporterOptions>({});
  const [triageData, setTriageData] = useState<TriageData | undefined>(undefined);
  const [lastDiagnostic, setLastDiagnostic] = useState<DiagnosticResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const captureManagerRef = useRef(getCaptureManager({
    maxConsoleLogs: capture.maxConsoleLogs ?? 50,
    maxNetworkLogs: capture.maxNetworkLogs ?? 20,
    captureConsole: capture.console ?? true,
    captureNetwork: capture.networkSample ?? false,
  }));

  const storageManagerRef = useRef(getStorageManager());
  const apiClientRef = useRef(getApiClient({
    apiBaseUrl,
    publishableKey,
  }));
  const generationRequestIdRef = useRef(0);

  const rateLimitRef = useRef({
    requests: [] as number[],
    maxRequests: rateLimit.maxRequests ?? 10,
    windowMs: rateLimit.windowMs ?? 60000,
  });

  useEffect(() => {
    const captureManager = captureManagerRef.current;
    captureManager.startCapture();

    if (typeof window !== 'undefined') {
      const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      captureManager.trackRoute(currentUrl);
    }

    return () => {
      captureManager.stopCapture();
    };
  }, [pathname, searchParams]);

  // Apply dark mode class to document root for better compatibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (theme.mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme.mode]);

  useEffect(() => {
    const storageManager = storageManagerRef.current;
    const latestDiagnostic = storageManager.getLatestDiagnostic();

    if (latestDiagnostic && !latestDiagnostic.viewed) {
      setLastDiagnostic(latestDiagnostic);
    }
  }, []);

  useEffect(() => {
    return () => {
      resetCaptureManager();
      resetStorageManager();
      resetApiClient();
    };
  }, []);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const { requests, maxRequests, windowMs } = rateLimitRef.current;

    const validRequests = requests.filter(time => now - time < windowMs);
    rateLimitRef.current.requests = validRequests;

    if (validRequests.length >= maxRequests) {
      return false;
    }

    rateLimitRef.current.requests.push(now);
    return true;
  };

  const applyTriageResponse = useCallback((response: TriageResponse) => {
    const { form_data: formData, suggested_meta: suggestedMeta } = response;
    const normalizedSeverity =
      typeof formData.severity === 'string' &&
      ['low', 'medium', 'high', 'critical'].includes(formData.severity as string)
        ? (formData.severity as 'low' | 'medium' | 'high' | 'critical')
        : undefined;

    setTriageData({
      summary: formData.summary,
      steps: formData.steps ?? formData.description,
      severity: normalizedSeverity,
      category: formData.category,
      expected: formData.expected,
      actual: formData.actual,
      meta: suggestedMeta,
    });
  }, []);

  const generatePrefillFromMessages = useCallback(
    (messages: ChatHistoryMessage[]) => {
      if (!messages || messages.length === 0) {
        return;
      }

      const apiClient = apiClientRef.current;
      const requestId = ++generationRequestIdRef.current;
      setIsGeneratingDescription(true);

      apiClient
        .generateIssuePrefill(messages)
        .then(response => {
          if (generationRequestIdRef.current !== requestId) {
            return;
          }

          applyTriageResponse(response);
        })
        .catch(error => {
          const err = error instanceof Error ? error : new Error('Failed to generate issue prefill');
          console.error('Issue prefill generation failed:', error);
          onError?.(err);
        })
        .finally(() => {
          if (generationRequestIdRef.current === requestId) {
            setIsGeneratingDescription(false);
          }
        });
    },
    [applyTriageResponse, onError]
  );

  const openReporter = (options: ReporterOpenOptions = {}) => {
    const normalizedOptions: ReporterOptions = {
      category: options.category,
      chatHistory: options.chatHistory,
    };

    setReporterOptions(normalizedOptions);
    setIsModalOpen(true);

    if (options.chatHistory && options.chatHistory.length > 0) {
      generatePrefillFromMessages(options.chatHistory);
    } else {
      generationRequestIdRef.current += 1;
      setIsGeneratingDescription(false);
    }
  };

  const closeReporter = () => {
    setIsModalOpen(false);
    generationRequestIdRef.current += 1;
    setReporterOptions({});
    setTriageData(undefined);
    setIsGeneratingDescription(false);
  };

  const submitIssue = async (formData: any): Promise<DiagnosticResponse | null> => {
    if (!checkRateLimit()) {
      const error = new Error('Rate limit exceeded. Please try again later.');
      onError?.(error);
      throw error;
    }

    setIsSubmitting(true);

    try {
      const captureManager = captureManagerRef.current;
      const apiClient = apiClientRef.current;

      const { attachments, user, ...formFields } = formData;

      const cleanedFormFields = Object.fromEntries(
        Object.entries(formFields).filter(([_, value]) => value !== undefined)
      );

      const payload: any = {
        publishableKey,
        meta: captureManager.getCaptureMeta(),
        form: cleanedFormFields,
      };

      if (user) payload.user = user;
      if (reportBy) payload.reportBy = reportBy;
      if (capture.console !== false) {
        const consoleLogs = captureManager.getConsoleLogs();
        if (consoleLogs && consoleLogs.length > 0) payload.console = consoleLogs;
      }
      if (capture.networkSample) {
        const networkLogs = captureManager.getNetworkLogs();
        if (networkLogs && networkLogs.length > 0) payload.network = networkLogs;
      }

      const { issueId } = await apiClient.submitIssue(payload);

      onAfterSubmit?.(issueId);

      return { issueId, status: 'pending' as const, diagnostic: undefined };
    } catch (error) {
      console.error('Issue submission failed:', error);
      if (error && typeof error === 'object' && 'data' in error) {
        console.error('Validation errors:', JSON.stringify((error as any).data, null, 2));
      }
      const err = error instanceof Error ? error : new Error('Failed to submit issue');
      onError?.(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearDiagnostic = () => {
    setLastDiagnostic(null);
    if (lastDiagnostic?.issueId) {
      storageManagerRef.current.markDiagnosticAsViewed(lastDiagnostic.issueId);
    }
  };

  const openSupportChat = () => {
    setIsSupportChatOpen(true);
  };

  const closeSupportChat = () => {
    setIsSupportChatOpen(false);
  };

  const config: BlarioConfig = useMemo(
    () => ({
      publishableKey,
      apiBaseUrl,
      reportBy,
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
    }),
    [
      publishableKey,
      apiBaseUrl,
      reportBy,
      locale,
      capture,
      theme,
      redaction,
      rateLimit,
      onAfterSubmit,
      onError,
    ]
  );

  const value: BlarioContextValue = {
    config,
    isModalOpen,
    openReporter,
    closeReporter,
    reporterOptions,
    triageData,
    lastDiagnostic,
    isSubmitting,
    submitIssue,
    clearDiagnostic,
    reportBy,
    locale,
    isGeneratingDescription,
    generatePrefillFromMessages,
    isSupportChatOpen,
    openSupportChat,
    closeSupportChat,
  };

  return (
    <BlarioContext.Provider value={value}>
      {children}
      <IssueReporterModal />
    </BlarioContext.Provider>
  );
}

export function useBlarioContext(): BlarioContextValue {
  const context = useContext(BlarioContext);
  if (!context) {
    throw new Error('useBlarioContext must be used within a BlarioProvider');
  }
  return context;
}
