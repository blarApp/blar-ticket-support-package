'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { BlarioConfig, DiagnosticResponse, User } from '../core/schemas';
import { getCaptureManager, resetCaptureManager } from '../core/capture';
import { getStorageManager, resetStorageManager } from '../core/storage';
import { getApiClient, resetApiClient } from '../core/api';
import { IssueReporterModal } from '../ui/IssueReporterModal';
import { cn } from '../ui/lib/utils';
import '../styles/theme.css';

export interface BlarioContextValue {
  config: BlarioConfig;
  isModalOpen: boolean;
  openReporter: (options?: { category?: string; prefill?: Record<string, any> }) => void;
  closeReporter: () => void;
  reporterOptions?: { category?: string; prefill?: Record<string, any> };
  lastDiagnostic: DiagnosticResponse | null;
  isSubmitting: boolean;
  submitIssue: (formData: any) => Promise<DiagnosticResponse | null>;
  clearDiagnostic: () => void;
  user?: User;
}

const BlarioContext = createContext<BlarioContextValue | null>(null);

export interface BlarioProviderProps {
  projectId: string;
  publishableKey: string;
  apiBaseUrl?: string;
  user?: User;
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
  projectId,
  publishableKey,
  apiBaseUrl = 'https://api.blar.io',
  user,
  capture = {},
  theme = {},
  redaction = {},
  rateLimit = {},
  onAfterSubmit,
  onError,
  children,
}: BlarioProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reporterOptions, setReporterOptions] = useState<{
    category?: string;
    prefill?: Record<string, any>;
  }>({});
  const [lastDiagnostic, setLastDiagnostic] = useState<DiagnosticResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    projectId,
    publishableKey,
  }));

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

  const openReporter = (options: { category?: string; prefill?: Record<string, any> } = {}) => {
    setReporterOptions(options);
    setIsModalOpen(true);
  };

  const closeReporter = () => {
    setIsModalOpen(false);
    setReporterOptions({});
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

      // Remove attachments from formData - they should NOT be sent as base64
      // Attachments should be uploaded separately using signed URLs
      const { attachments, ...formFields } = formData;

      const payload = {
        projectId,
        publishableKey,
        user,
        meta: captureManager.getCaptureMeta(),
        console: capture.console !== false ? captureManager.getConsoleLogs() : undefined,
        network: capture.networkSample ? captureManager.getNetworkLogs() : undefined,
        form: formFields,
        // DO NOT include attachments in JSON payload - use signed URL upload instead
      };

      const { issueId } = await apiClient.submitIssue(payload);

      onAfterSubmit?.(issueId);

      // Diagnostic will be returned from the API directly
      // No need to poll anymore
      return null;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to submit issue');
      onError?.(err);
      throw err;
    } finally {
      setIsSubmitting(false);
      closeReporter();
    }
  };

  const clearDiagnostic = () => {
    setLastDiagnostic(null);
    if (lastDiagnostic?.issueId) {
      storageManagerRef.current.markDiagnosticAsViewed(lastDiagnostic.issueId);
    }
  };

  const config: BlarioConfig = useMemo(
    () => ({
      projectId,
      publishableKey,
      apiBaseUrl,
      user,
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
      projectId,
      publishableKey,
      apiBaseUrl,
      user,
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
    lastDiagnostic,
    isSubmitting,
    submitIssue,
    clearDiagnostic,
    user,
  };

  return (
    <BlarioContext.Provider value={value}>
      <div className={cn("blario-wrapper", theme.mode === "dark" && "dark", theme.className)}>
        {children}
        <IssueReporterModal />
      </div>
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