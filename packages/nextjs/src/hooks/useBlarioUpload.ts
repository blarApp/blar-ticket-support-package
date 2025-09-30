'use client';

import { useState, useCallback } from 'react';
import { useBlarioContext } from '../provider/BlarioProvider';
import { getUploadManager } from '../core/upload';
import { getApiClient } from '../core/api';
import type { DiagnosticResponse, FormData } from '../core/schemas';

export interface UploadProgress {
  fileName: string;
  percent: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
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

  const uploadFiles = useCallback(async (files: File[]): Promise<string[]> => {
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

      // Update progress to uploading
      setUploadProgress(prev => prev.map(p => ({
        ...p,
        status: 'uploading' as const,
      })));

      // Upload files
      const uploadTokens = await uploadManager.uploadFiles(files);

      // Update progress to completed
      setUploadProgress(prev => prev.map(p => ({
        ...p,
        percent: 100,
        status: 'completed' as const,
      })));

      return uploadTokens;
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
    try {
      // Upload files first if any
      let uploadTokens: string[] = [];
      if (files && files.length > 0) {
        uploadTokens = await uploadFiles(files);
      }

      // Submit the issue
      const result = await context.submitIssue(formData);

      // Verify attachments if we have tokens
      if (result?.issueId && uploadTokens.length > 0) {
        const apiClient = getApiClient(context.config);
        const uploadManager = getUploadManager(apiClient);
        await uploadManager.verifyAttachments(result.issueId, uploadTokens);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit issue';
      setUploadError(errorMessage);
      throw error;
    }
  }, [context, uploadFiles]);

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