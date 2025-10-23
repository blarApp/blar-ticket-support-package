'use client';

import React, { useEffect, useState } from 'react';
import { useBlarioUpload } from '../hooks/useBlarioUpload';
import { useBlarioContext } from '../provider/BlarioProvider';
import { Button } from './components/button';
import { Input } from './components/input';
import { Label } from './components/label';
import { Textarea } from './components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/select';
import { Paperclip, Loader2, Sparkles, X } from 'lucide-react';
import type { FormData } from '@blario/core';
import { translations } from './translations';

const SEVERITY_OPTIONS = ['low', 'medium', 'high', 'critical'] as const;
type SeverityOption = (typeof SEVERITY_OPTIONS)[number];

export interface IssueReporterFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
  className?: string;
  standalone?: boolean;
  user?: string;
}

export function IssueReporterForm({
  onSuccess,
  onError,
  onCancel,
  showCancelButton = true,
  className,
  standalone = false,
  user,
}: IssueReporterFormProps) {
  const {
    submitIssueWithUploads,
    isUploading,
    uploadError,
    clearUploadError,
    uploadProgress,
  } = useBlarioUpload();

  const {
    isModalOpen,
    reporterOptions,
    triageData,
    locale,
    isGeneratingDescription,
  } = useBlarioContext();
  const t = translations[locale];

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSummaryEdited, setIsSummaryEdited] = useState(false);
  const [steps, setSteps] = useState('');
  const [isStepsEdited, setIsStepsEdited] = useState(false);
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [severity, setSeverity] = useState<SeverityOption | undefined>(undefined);
  const [isSeverityEdited, setIsSeverityEdited] = useState(false);
  const [category, setCategory] = useState('');
  const [isCategoryEdited, setIsCategoryEdited] = useState(false);
  const [userContact, setUserContact] = useState(user || '');
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    const isActive = isModalOpen || standalone;
    if (isActive) {
      setSummary(triageData?.summary ?? '');
      setIsSummaryEdited(false);
      setSteps(triageData?.steps ?? '');
      setIsStepsEdited(false);
      setExpected(triageData?.expected ?? '');
      setActual(triageData?.actual ?? '');
      const nextSeverity = triageData?.severity;
      if (typeof nextSeverity === 'string' && SEVERITY_OPTIONS.includes(nextSeverity as SeverityOption)) {
        setSeverity(nextSeverity as SeverityOption);
      } else {
        setSeverity(undefined);
      }
      setIsSeverityEdited(false);
      setCategory(reporterOptions?.category || triageData?.category || '');
      setIsCategoryEdited(false);
      setUserContact(user || '');
      setAdditionalInfo('');
    } else {
      setSummary('');
      setIsSummaryEdited(false);
      setSteps('');
      setIsStepsEdited(false);
      setExpected('');
      setActual('');
      setSeverity(undefined);
      setIsSeverityEdited(false);
      setCategory('');
      setIsCategoryEdited(false);
      setUserContact(user || '');
      setAdditionalInfo('');
    }
  }, [isModalOpen, standalone, triageData, reporterOptions?.category, user]);

  useEffect(() => {
    const isActive = isModalOpen || standalone;
    if (!isActive) return;
    if (isSummaryEdited) return;

    if (typeof triageData?.summary === 'string') {
      setSummary(triageData.summary);
    }
  }, [triageData?.summary, isModalOpen, standalone, isSummaryEdited]);

  useEffect(() => {
    const isActive = isModalOpen || standalone;
    if (!isActive) return;
    if (!isStepsEdited && typeof triageData?.steps === 'string') {
      setSteps(triageData.steps);
    }

    if (!isSeverityEdited) {
      const nextSeverity = triageData?.severity;
      if (typeof nextSeverity === 'string' && SEVERITY_OPTIONS.includes(nextSeverity as SeverityOption)) {
        setSeverity(nextSeverity as SeverityOption);
      }
    }

    if (!isCategoryEdited) {
      const nextCategory = reporterOptions?.category ?? triageData?.category;
      if (typeof nextCategory === 'string') {
        setCategory(nextCategory);
      }
    }

    if (typeof triageData?.expected === 'string') {
      setExpected(triageData.expected);
    }

    if (typeof triageData?.actual === 'string') {
      setActual(triageData.actual);
    }
  }, [
    isModalOpen,
    standalone,
    isStepsEdited,
    isSeverityEdited,
    isCategoryEdited,
    triageData?.steps,
    triageData?.severity,
    reporterOptions?.category,
    triageData?.category,
    triageData?.expected,
    triageData?.actual,
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const MAX_FILES = 5;
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

    const issueData: FormData = {
      summary,
      steps: steps || undefined,
      expected: expected || undefined,
      actual: actual || undefined,
      severity,
      category: category || undefined,
      user: userContact || undefined,
      additionalInfo: additionalInfo || undefined,
    } as any;

    try {
      await submitIssueWithUploads(issueData, files);

      onSuccess?.();
      setFiles([]);
      setSummary('');
      setIsSummaryEdited(false);
      setSteps('');
      setIsStepsEdited(false);
      setExpected('');
      setActual('');
      setSeverity(undefined);
      setIsSeverityEdited(false);
      setCategory('');
      setIsCategoryEdited(false);
      setUserContact(user || '');
      setAdditionalInfo('');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to submit issue');
      onError?.(err);
      console.error('Failed to submit issue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showGeneratedSummaryHint = Boolean(triageData?.summary) && !isSummaryEdited;

  useEffect(() => {
    const isActive = isModalOpen || standalone;
    if (!isActive || isGeneratingDescription) return;

    const timeoutId = setTimeout(() => {
      const summaryInput = document.getElementById('summary') as HTMLInputElement | null;
      if (summaryInput && document.activeElement !== summaryInput) {
        summaryInput.focus();
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [isModalOpen, standalone, isGeneratingDescription]);

  const formContent = (
    <>
      <div className={`relative ${standalone ? 'flex-1 overflow-y-auto' : 'overflow-y-auto flex-shrink-0'}`}>
        {isGeneratingDescription && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              <p className="text-xs sm:text-sm font-medium text-foreground">{t.prefillingReport}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={className} id="issue-form">
          <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
          <div className="grid gap-3 sm:gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] max-[500px]:grid-cols-1">
            <div className="col-span-full">
              <Label htmlFor="summary" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                {t.summary}
                <span className="text-destructive text-[10px] sm:text-xs">{t.required}</span>
                {showGeneratedSummaryHint && (
                  <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                )}
              </Label>
              <Input
                id="summary"
                name="summary"
                placeholder={t.summaryPlaceholder}
                value={summary}
                onChange={(event) => {
                  setSummary(event.target.value);
                  setIsSummaryEdited(true);
                }}
                required
                disabled={isSubmitting || isUploading || isGeneratingDescription}
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm"
              />
            </div>

            <div className="col-span-full">
              <Label htmlFor="steps" className="text-xs sm:text-sm font-semibold">
                {t.steps}
              </Label>
              <Textarea
                id="steps"
                name="steps"
                placeholder={t.stepsPlaceholder}
                value={steps}
                onChange={(event) => {
                  setSteps(event.target.value);
                  setIsStepsEdited(true);
                }}
                rows={3}
                disabled={isSubmitting || isUploading || isGeneratingDescription}
                data-tour-id="issue-description-input"
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="severity" className="text-xs sm:text-sm font-semibold">
                {t.severity}
              </Label>
              <Select
                name="severity"
                value={severity}
                onValueChange={(value) => {
                  setSeverity(value as FormData['severity']);
                  setIsSeverityEdited(true);
                }}
                disabled={isSubmitting || isUploading || isGeneratingDescription}
              >
                <SelectTrigger id="severity" className="mt-1.5 sm:mt-2 text-xs sm:text-sm">
                  <SelectValue placeholder={t.severityPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low" className="text-xs sm:text-sm">{t.severityLow}</SelectItem>
                  <SelectItem value="medium" className="text-xs sm:text-sm">{t.severityMedium}</SelectItem>
                  <SelectItem value="high" className="text-xs sm:text-sm">{t.severityHigh}</SelectItem>
                  <SelectItem value="critical" className="text-xs sm:text-sm">{t.severityCritical}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category" className="text-xs sm:text-sm font-semibold">
                {t.category}
              </Label>
              <Input
                id="category"
                name="category"
                placeholder={t.categoryPlaceholder}
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setIsCategoryEdited(true);
                }}
                disabled={isSubmitting || isUploading || isGeneratingDescription}
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="expected" className="text-xs sm:text-sm font-semibold">
                {t.expected}
              </Label>
              <Textarea
                id="expected"
                name="expected"
                placeholder={t.expectedPlaceholder}
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                rows={3}
                disabled={isSubmitting || isUploading || isGeneratingDescription}
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm"
              />
            </div>

            <div>
              <Label htmlFor="actual" className="text-xs sm:text-sm font-semibold">
                {t.actual}
              </Label>
              <Textarea
                id="actual"
                name="actual"
                placeholder={t.actualPlaceholder}
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                rows={3}
                disabled={isSubmitting || isUploading || isGeneratingDescription}
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="userContact" className="text-xs sm:text-sm font-semibold">
                {t.userContact}
              </Label>
              <Input
                id="userContact"
                name="userContact"
                placeholder={t.userContactPlaceholder}
                value={userContact}
                onChange={(event) => setUserContact(event.target.value)}
                disabled={isSubmitting || isUploading || isGeneratingDescription}
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="additionalInfo" className="text-xs sm:text-sm font-semibold">
                {t.additionalInfo}
              </Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                placeholder={t.additionalInfoPlaceholder}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={3}
                disabled={isSubmitting || isUploading || isGeneratingDescription}
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm"
              />
            </div>
          </div>

          {uploadError && (
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded text-[10px] sm:text-sm text-red-600">
              {uploadError}
            </div>
          )}
          </div>

          <div className="px-4 sm:px-6 pb-3 sm:pb-4">
        <div className="rounded-lg border p-2 sm:p-3">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs sm:text-sm font-semibold">Attachments</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={files.length >= 5 || isSubmitting || isGeneratingDescription}
              className="h-7 sm:h-8 text-xs"
            >
              <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            </Button>
          </div>

          <Input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />

          {files.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => {
                const isImage = file.type.startsWith('image/');
                const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="relative group"
                  >
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded border bg-muted flex items-center justify-center overflow-hidden">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center py-2">
              No files attached
            </p>
          )}
        </div>
      </div>
        </form>
      </div>

      <div className="flex justify-end gap-2 sm:gap-3 px-4 sm:px-6 pb-4 sm:pb-6 pt-2 flex-shrink-0">
        {showCancelButton && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isUploading || isGeneratingDescription}
            className="text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4"
          >
            {t.cancel}
          </Button>
        )}
        <Button
          type="submit"
          form="issue-form"
          disabled={isSubmitting || isUploading || isGeneratingDescription}
          data-tour-id="issue-submit-button"
          className="text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4"
        >
          {isSubmitting && !isUploading ? t.creatingIssue :
           isUploading ? (
             uploadProgress.some(p => p.status === 'verifying') ? t.verifyingAttachments :
             uploadProgress.some(p => p.status === 'uploading') ? t.uploadingFiles :
             t.preparingUpload
           ) : t.submit}
        </Button>
      </div>
    </>
  );

  if (standalone) {
    return (
      <div className="flex flex-col h-full">
        {formContent}
      </div>
    );
  }

  return formContent;
}