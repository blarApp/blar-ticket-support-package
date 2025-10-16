'use client';

import { useState, useCallback } from 'react';
import { useBlarioContext } from '../provider/BlarioProvider';
import { getUploadManager, getApiClient } from '@blario/core';
import type { DiagnosticResponse, FormData } from '@blario/core';

export interface UploadProgress {
  fileName: string;
  percent: number;
  status: 'pending' | 'uploading' | 'verifying' | 'completed' | 'error';
}

export interface UseBlarioUploadReturn {
  uploadFiles: (files: File[]) => Promise<string[]>;
  submitIssueWithUploads: (formData: FormData, files: File[]) => Promise<DiagnosticResponse | null>;
  uploadProgress: UploadProgress[];
  isUploading: boolean;
  uploadError: string | null;
  clearUploadError: () => void;
}

/**
 * Hook for advanced file upload functionality using signed URLs
 */
export function useBlarioUpload(): UseBlarioUploadReturn {
  const context = useBlarioContext();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // This method is kept for standalone uploads but is not used in the normal flow
  const uploadFiles = useCallback(async (files: File[]): Promise<string[]> => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(files.map(f => ({
      fileName: f.name,
      percent: 0,
      status: 'pending' as const,
    })));

    try {
      // Validate files first
      const MAX_FILES = 5;
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
      const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

      if (files.length > MAX_FILES) {
        throw new Error(`Maximum ${MAX_FILES} files allowed`);
      }

      for (const file of files) {
        const isVideo = file.type.startsWith('video/');
        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
        const sizeLabel = isVideo ? '50MB' : '5MB';

        if (file.size > maxSize) {
          throw new Error(`File "${file.name}" exceeds the ${sizeLabel} limit`);
        }
      }

      // Note: This uses the deprecated method without issue ID
      // For proper upload with verification, use submitIssueWithUploads
      throw new Error('Direct upload without issue ID is not supported. Please use submitIssueWithUploads.');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);

      // Update progress to error
      setUploadProgress(prev => prev.map(p => ({
        ...p,
        status: 'error' as const,
      })));

      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [context.config]);

  const submitIssueWithUploads = useCallback(async (
    formData: FormData,
    files: File[]
  ): Promise<DiagnosticResponse | null> => {
    let result: DiagnosticResponse | null = null;

    try {
      // Step 1: Create the issue first
      result = await context.submitIssue(formData);
      console.log('Issue created:', result);

      // Steps 2-4: Upload and verify attachments if we have files and issue ID
      if (result?.issueId && files && files.length > 0) {
        console.log('Starting file upload for issue:', result.issueId, 'Files:', files.length);
        setIsUploading(true);
        setUploadError(null);
        setUploadProgress(files.map(f => ({
          fileName: f.name,
          percent: 0,
          status: 'pending' as const,
        })));

        try {
          const apiClient = getApiClient(context.config);
          const uploadManager = getUploadManager(apiClient);

          // Upload files with complete 3-step process (prepare, upload, verify)
          // This will wait for the entire upload process to complete
          await uploadManager.uploadFilesForIssue(files, result.issueId, (step, percent) => {
            let status: UploadProgress['status'] = 'pending';
            let progressPercent = 0;

            switch (step) {
              case 'preparing':
                status = 'uploading';
                progressPercent = 10;
                break;
              case 'uploading':
                status = 'uploading';
                progressPercent = percent ? 10 + (percent * 0.7) : 10; // 10-80%
                break;
              case 'verifying':
                status = 'verifying';
                progressPercent = 90;
                break;
              case 'complete':
                status = 'completed';
                progressPercent = 100;
                break;
            }

            setUploadProgress(prev => prev.map(p => ({
              ...p,
              status,
              percent: progressPercent,
            })));
          });

          // Upload completed successfully
        } catch (uploadError) {
          // Issue was created but uploads failed
          console.error('Failed to upload attachments:', uploadError);
          setUploadError(uploadError instanceof Error ? uploadError.message : 'Failed to upload files');
          // Still return the result since issue was created
        } finally {
          setIsUploading(false);
        }
      }

      return result;
    } catch (error) {
      // Issue creation failed
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit issue';
      setUploadError(errorMessage);
      setIsUploading(false);
      throw error;
    }
  }, [context]);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  return {
    uploadFiles,
    submitIssueWithUploads,
    uploadProgress,
    isUploading,
    uploadError,
    clearUploadError,
  };
}