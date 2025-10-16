'use client';

import { useBlarioContext } from '../provider/BlarioProvider';
import type { DiagnosticResponse, FormData } from '@blario/core';

export interface UseBlarioReturn {
  openReporter: (options?: { category?: string; prefill?: Record<string, any> }) => void;
  closeReporter: () => void;
  reportIssue: (formData: FormData, attachments?: File[]) => Promise<DiagnosticResponse | null>;
  lastDiagnostic: DiagnosticResponse | null;
  clearDiagnostic: () => void;
  isModalOpen: boolean;
  isSubmitting: boolean;
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
  };
}