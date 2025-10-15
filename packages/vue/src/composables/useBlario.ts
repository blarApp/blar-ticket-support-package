import { inject } from 'vue';
import { BlarioKey } from '../plugin/BlarioPlugin';
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
  const blario = inject(BlarioKey);

  if (!blario) {
    throw new Error('useBlario must be used within a Vue app that has installed BlarioPlugin');
  }

  const { state, actions } = blario;

  const reportIssue = async (
    formData: FormData,
    attachments?: File[]
  ): Promise<DiagnosticResponse | null> => {
    // Note: This composable maintains backward compatibility with base64 uploads
    // For signed URL uploads, use useBlarioUpload composable instead

    // For now, just submit without attachments in the JSON
    // Attachments should be uploaded separately via signed URLs
    if (attachments && attachments.length > 0) {
      console.warn(
        'Attachments detected but not uploaded. Use useBlarioUpload() composable for file uploads via signed URLs.'
      );
    }

    return actions.submitIssue(formData);
  };

  return {
    openReporter: actions.openReporter,
    closeReporter: actions.closeReporter,
    reportIssue,
    get lastDiagnostic() {
      return state.lastDiagnostic;
    },
    clearDiagnostic: actions.clearDiagnostic,
    get isModalOpen() {
      return state.isModalOpen;
    },
    get isSubmitting() {
      return state.isSubmitting;
    },
  };
}
