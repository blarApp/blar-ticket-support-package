'use client';

import React, { useState } from 'react';
import { useBlarioUpload } from '../hooks/useBlarioUpload';
import { useBlarioContext } from '../provider/BlarioProvider';
import { Button } from './components/button';
import { Input } from './components/input';
import { Label } from './components/label';
import { Textarea } from './components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/select';
import { Upload, File, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './components/dialog';
import type { FormData } from '../core/schemas';

export interface IssueReporterModalProps {
  onSuccess?: (issueId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * Issue reporter component with signed URL file upload support
 */
export function IssueReporterModal({
  onSuccess,
  onError,
  className,
}: IssueReporterModalProps) {
  const {
    submitIssueWithUploads,
    isUploading,
    uploadError,
    clearUploadError,
    uploadProgress,
  } = useBlarioUpload();

  const { isModalOpen, closeReporter, reporterOptions } = useBlarioContext();

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const MAX_FILES = 3;
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      if (!isImage && !isVideo) {
        return false;
      }

      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      if (file.size > maxSize) {
        return false;
      }

      return true;
    });

    setFiles((prev) => [...prev, ...validFiles].slice(0, MAX_FILES));
    clearUploadError();
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const issueData: FormData = {
      summary: formData.get('summary') as string,
      steps: formData.get('steps') as string || undefined,
      expected: formData.get('expected') as string || undefined,
      actual: formData.get('actual') as string || undefined,
      severity: (formData.get('severity') as 'low' | 'medium' | 'high' | 'critical') || undefined,
      category: formData.get('category') as string || undefined,
    };

    try {
      // submitIssueWithUploads now properly waits for the entire upload process
      const result = await submitIssueWithUploads(issueData, files);

      if (result?.issueId) {
        onSuccess?.(result.issueId);
        form.reset();
        setFiles([]);
        // Close modal after successful submission and upload
        closeReporter();
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to submit issue');
      onError?.(err);
      console.error('Failed to submit issue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const KILOBYTE = 1024;
    const sizeUnits = ['Bytes', 'KB', 'MB'];
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(KILOBYTE)), sizeUnits.length - 1);
    const value = bytes / Math.pow(KILOBYTE, unitIndex);
    return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${sizeUnits[unitIndex]}`;
  };

  return (
    <div className="blario-wrapper">
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeReporter()}>
        <DialogContent className="blario-wrapper max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription>
              Help us improve by reporting any issues you encounter
            </DialogDescription>
          </DialogHeader>

        <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summary">
            Summary <span className="text-destructive">*</span>
          </Label>
          <Input
            id="summary"
            name="summary"
            placeholder="Brief description of the issue"
            defaultValue={reporterOptions?.prefill?.summary}
            required
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="steps">Steps to Reproduce</Label>
          <Textarea
            id="steps"
            name="steps"
            placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
            defaultValue={reporterOptions?.prefill?.steps}
            rows={4}
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expected">Expected Behavior</Label>
            <Textarea
              id="expected"
              name="expected"
              placeholder="What should happen?"
              defaultValue={reporterOptions?.prefill?.expected}
              rows={3}
              disabled={isSubmitting || isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actual">Actual Behavior</Label>
            <Textarea
              id="actual"
              name="actual"
              placeholder="What actually happened?"
              defaultValue={reporterOptions?.prefill?.actual}
              rows={3}
              disabled={isSubmitting || isUploading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select name="severity" defaultValue={reporterOptions?.prefill?.severity} disabled={isSubmitting || isUploading}>
              <SelectTrigger id="severity">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              placeholder="e.g., UI, Performance, API"
              defaultValue={reporterOptions?.category || reporterOptions?.prefill?.category}
              disabled={isSubmitting || isUploading}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Attachments</Label>
          <div className="rounded-xl border border-dashed border-muted/40 bg-muted/10 p-6 text-center transition-colors hover:border-muted/60">
            <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Drag and drop files here, or click to browse
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              Supports images and videos up to 5MB/50MB • Max 3 files
            </p>
            <Input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mx-auto inline-flex items-center gap-2"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Choose Files
            </Button>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Uploaded files ({files.length})
              </p>
              <div className="space-y-2 rounded-lg border border-muted/40 bg-card p-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                          {uploadProgress.find(p => p.fileName === file.name)?.status === 'verifying' &&
                            ' • Verifying...'}
                          {uploadProgress.find(p => p.fileName === file.name)?.status === 'completed' &&
                            ' • ✓ Verified'}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFile(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {uploadError}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFiles([]);
              clearUploadError();
              closeReporter();
            }}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting && !isUploading ? 'Creating Issue...' :
             isUploading ? (
               uploadProgress.some(p => p.status === 'verifying') ? 'Verifying Attachments...' :
               uploadProgress.some(p => p.status === 'uploading') ? 'Uploading Files...' :
               'Preparing Upload...'
             ) : 'Submit Issue'}
          </Button>
        </div>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  );
}