'use client';

import { useBlarioContext, type ReporterOpenOptions } from '../provider/BlarioProvider';
import type { ChatHistoryMessage, DiagnosticResponse, FormData } from '../core/schemas';

export interface UseBlarioReturn {
  openReporter: (options?: ReporterOpenOptions) => void;
  closeReporter: () => void;
  reportIssue: (formData: FormData, attachments?: File[]) => Promise<DiagnosticResponse | null>;
  lastDiagnostic: DiagnosticResponse | null;
  clearDiagnostic: () => void;
  isModalOpen: boolean;
  isSubmitting: boolean;
  isGeneratingDescription: boolean;
  generatePrefillFromMessages: (messages: ChatHistoryMessage[]) => void;
}

export function useBlario(): UseBlarioReturn {
  const context = useBlarioContext();

  const reportIssue = async (
    formData: FormData,
    attachments?: File[]
  ): Promise<DiagnosticResponse | null> => {
    // Note: This hook maintains backward compatibility with base64 uploads
    // For signed URL uploads, use useBlarioUpload hook instead

    // For now, just submit without attachments in the JSON
    // Attachments should be uploaded separately via signed URLs
    if (attachments && attachments.length > 0) {
      console.warn(
        'Attachments detected but not uploaded. Use useBlarioUpload() hook for file uploads via signed URLs.'
      );
    }

    return context.submitIssue(formData);
  };

  return {
    openReporter: context.openReporter,
    closeReporter: context.closeReporter,
    reportIssue,
    lastDiagnostic: context.lastDiagnostic,
    clearDiagnostic: context.clearDiagnostic,
    isModalOpen: context.isModalOpen,
    isSubmitting: context.isSubmitting,
    isGeneratingDescription: context.isGeneratingDescription,
    generatePrefillFromMessages: context.generatePrefillFromMessages,
  };
}
