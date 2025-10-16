'use client';

export { BlarioProvider } from './provider/BlarioProvider';
export type { BlarioProviderProps } from './provider/BlarioProvider';

export { useBlario } from './hooks/useBlario';
export type { UseBlarioReturn } from './hooks/useBlario';

export { useBlarioUpload } from './hooks/useBlarioUpload';
export type { UseBlarioUploadReturn, UploadProgress } from './hooks/useBlarioUpload';

export { IssueReporterButton } from './ui/IssueReporterButton';
export type { IssueReporterButtonProps } from './ui/IssueReporterButton';

export { IssueReporterModal } from './ui/IssueReporterModal';
export type { IssueReporterModalProps } from './ui/IssueReporterModal';

export { DiagnosticBanner } from './ui/DiagnosticBanner';
export type { DiagnosticBannerProps } from './ui/DiagnosticBanner';

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