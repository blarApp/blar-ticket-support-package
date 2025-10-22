'use client';

export { BlarioProvider, useBlarioContext } from './provider/BlarioProvider';
export type { BlarioProviderProps, BlarioContextValue, ReporterOptions, ReporterOpenOptions } from './provider/BlarioProvider';

export { useBlario } from './hooks/useBlario';
export type { UseBlarioReturn } from './hooks/useBlario';

export { useBlarioUpload } from './hooks/useBlarioUpload';
export type { UseBlarioUploadReturn, UploadProgress } from './hooks/useBlarioUpload';

export { useSupportChat } from './hooks/useSupportChat';
export type { UseSupportChatReturn, UseSupportChatOptions } from './hooks/useSupportChat';

export { IssueReporterButton } from './ui/IssueReporterButton';
export type { IssueReporterButtonProps } from './ui/IssueReporterButton';

export { IssueReporterModal } from './ui/IssueReporterModal';
export type { IssueReporterModalProps } from './ui/IssueReporterModal';

export { IssueReporterForm } from './ui/IssueReporterForm';
export type { IssueReporterFormProps } from './ui/IssueReporterForm';

export { DiagnosticBanner } from './ui/DiagnosticBanner';
export type { DiagnosticBannerProps } from './ui/DiagnosticBanner';

export { SupportChatButton } from './ui/SupportChatButton';
export type { SupportChatButtonProps } from './ui/SupportChatButton';

export { SupportChatModal } from './ui/SupportChatModal';
export type { SupportChatModalProps } from './ui/SupportChatModal';

export { withBlarioErrorBoundary, BlarioErrorBoundary } from './errors/withBlarioErrorBoundary';
export type { ErrorBoundaryProps, ErrorFallbackProps } from './errors/withBlarioErrorBoundary';

// Tour and Chat exports
export { TourProvider, useTour } from './tour/TourProvider';
export type { TourContextValue, TourProviderProps } from './tour/TourProvider';

export { ChatWidget } from './chat/ChatWidget';
export type { ChatWidgetProps } from './chat/ChatWidget';

export { chatAPI } from './chat/chatAPI';
export type { ChatAPIRequest } from './chat/chatAPI';

export { withTour } from './tour/elementFinder';
export { waitForElement, waitForPageReady, waitForNavigation } from './tour/elementWaiter';

export type {
  Tour,
  TourStep,
  TourTarget,
  TourStepPosition,
  ChatMessage,
  ChatAssistantResponse,
} from './tour/types';

export type {
  User,
  Viewport,
  Meta,
  ConsoleLog,
  NetworkLog,
  FormData,
  ChatHistoryMessage,
  Attachment,
  IssueReportPayload,
  Diagnostic,
  DiagnosticResponse,
  BlarioConfig,
  TriageFormData,
  TriageSuggestedMeta,
  TriageResponse,
  SupportChatMessage,
  ChatAttachment,
  ChatSession,
} from '@blario/core';

export type {
  WebSocketMessage,
  ConnectionState,
  WebSocketManagerConfig,
} from '@blario/core';

// Export utility functions
export { cn } from './lib/cn';
export {
  buttonVariants,
  inputVariants,
  labelVariants,
  cardVariants,
  alertVariants,
  badgeVariants,
} from './lib/variants';
