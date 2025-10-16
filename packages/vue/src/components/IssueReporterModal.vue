<template>
  <div class="blario-wrapper">
    <Dialog :open="isModalOpen" @update:open="(open) => !open && handleCloseModal()">
      <DialogContent class="blario-wrapper max-w-2xl">
        <DialogHeader class="gap-1">
          <DialogTitle>{{ t.title }}</DialogTitle>
          <DialogDescription class="block text-muted-foreground text-sm leading-relaxed">
            {{ t.description }}
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" :class="className">
            <div class="space-y-6">
              <!-- Summary -->
              <div class="space-y-2">
                <label for="summary" class="flex items-center gap-2 text-sm leading-none font-medium text-foreground select-none">
                  {{ t.summary }} <span class="text-destructive">{{ t.required }}</span>
                </label>
                <input
                  id="summary"
                  v-model="formData.summary"
                  type="text"
                  :placeholder="t.summaryPlaceholder"
                  required
                  :disabled="isSubmitting || isUploading"
                  class="text-foreground file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>

              <!-- Steps -->
              <div class="space-y-2">
                <label for="steps" class="flex items-center gap-2 text-sm leading-none font-medium text-foreground select-none">{{ t.steps }}</label>
                <textarea
                  id="steps"
                  v-model="formData.steps"
                  :placeholder="t.stepsPlaceholder"
                  rows="4"
                  :disabled="isSubmitting || isUploading"
                  data-tour-id="issue-description-input"
                  class="text-foreground border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>

              <!-- Expected and Actual -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="expected" class="flex items-center gap-2 text-sm leading-none font-medium text-foreground select-none">{{ t.expected }}</label>
                  <textarea
                    id="expected"
                    v-model="formData.expected"
                    :placeholder="t.expectedPlaceholder"
                    rows="3"
                    :disabled="isSubmitting || isUploading"
                    class="text-foreground border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>

                <div class="space-y-2">
                  <label for="actual" class="flex items-center gap-2 text-sm leading-none font-medium text-foreground select-none">{{ t.actual }}</label>
                  <textarea
                    id="actual"
                    v-model="formData.actual"
                    :placeholder="t.actualPlaceholder"
                    rows="3"
                    :disabled="isSubmitting || isUploading"
                    class="text-foreground border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>
              </div>

              <!-- Severity and Category -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="severity" class="flex items-center gap-2 text-sm leading-none font-medium text-foreground select-none">{{ t.severity }}</label>
                  <select
                    id="severity"
                    v-model="formData.severity"
                    :disabled="isSubmitting || isUploading"
                    class="text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">{{ t.severityPlaceholder }}</option>
                    <option value="low">{{ t.severityLow }}</option>
                    <option value="medium">{{ t.severityMedium }}</option>
                    <option value="high">{{ t.severityHigh }}</option>
                    <option value="critical">{{ t.severityCritical }}</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label for="category" class="flex items-center gap-2 text-sm leading-none font-medium text-foreground select-none">{{ t.category }}</label>
                  <input
                    id="category"
                    v-model="formData.category"
                    type="text"
                    :placeholder="t.categoryPlaceholder"
                    :disabled="isSubmitting || isUploading"
                    class="text-foreground file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>
              </div>

              <!-- File Upload -->
              <div class="space-y-3 rounded-lg border border-muted/40 bg-muted/5 p-4">
                <label class="flex items-center gap-2 text-sm leading-none font-medium text-foreground select-none">{{ t.attachments }}</label>
                <div
                  class="rounded-xl border border-dashed border-muted/40 bg-muted/10 p-6 text-center transition-colors hover:border-muted/60"
                  :class="{ 'border-primary bg-accent': isDragOver }"
                  @dragover.prevent="handleDragOver"
                  @dragenter.prevent="handleDragOver"
                  @dragleave="handleDragLeave"
                  @drop.prevent="handleDrop"
                >
                  <Upload class="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                  <p class="mb-1 text-sm font-medium text-muted-foreground">{{ t.dragDrop }}</p>
                  <p class="mb-4 text-xs text-muted-foreground">{{ t.fileSupport }}</p>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    class="hidden"
                    @change="handleFileChange"
                  />
                  <button
                    type="button"
                    class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 px-3"
                    @click="fileInput?.click()"
                  >
                    {{ t.chooseFiles }}
                  </button>
                </div>

                <!-- File list -->
                <div v-if="files.length > 0" class="space-y-2">
                  <p class="text-sm font-medium text-foreground">{{ t.uploadedFiles }} ({{ files.length }})</p>
                  <div class="space-y-2 rounded-lg border border-muted/40 bg-card p-2">
                    <div
                      v-for="(file, index) in files"
                      :key="`${file.name}-${index}`"
                      class="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                    >
                      <div class="flex min-w-0 flex-1 items-center gap-3">
                        <File class="h-5 w-5 text-muted-foreground" />
                        <div class="min-w-0">
                          <p class="truncate text-sm font-medium text-foreground">{{ file.name }}</p>
                          <p class="text-xs text-muted-foreground">{{ formatFileSize(file.size) }}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-destructive"
                        @click="removeFile(index)"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error -->
              <div v-if="uploadError" class="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {{ uploadError }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-row gap-2 sm:gap-3 pt-4 border-t border-muted justify-end" >
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2"
                :disabled="isSubmitting || isUploading"
                @click="handleCloseModal"
              >
                {{ t.cancel }}
              </button>
              <button
                type="submit"
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
                :disabled="isSubmitting || isUploading"
                data-tour-id="issue-submit-button"
              >
                {{ submitButtonText }}
              </button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue';
import { Upload, File, Trash2 } from 'lucide-vue-next';
import { useBlarioUpload } from '../composables/useBlarioUpload';
import { BlarioKey } from '../plugin/BlarioPlugin';
import type { FormData } from '@blario/core';
import { translations } from './translations';
import type { Translation } from './translations';

const resolveTranslation = (locale?: string): Translation => {
  if (!locale || !(locale in translations)) {
    return translations.en;
  }
  return translations[locale as keyof typeof translations];
};
import Dialog from './ui/Dialog.vue';
import DialogContent from './ui/DialogContent.vue';
import DialogHeader from './ui/DialogHeader.vue';
import DialogTitle from './ui/DialogTitle.vue';
import DialogDescription from './ui/DialogDescription.vue';

export interface IssueReporterModalProps {
  onSuccess?: (issueId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

const props = defineProps<IssueReporterModalProps>();

const blario = inject(BlarioKey);
const { submitIssueWithUploads, isUploading, uploadError, clearUploadError, uploadProgress } = useBlarioUpload();

const t = computed<Translation>(() => resolveTranslation(blario?.state.locale));
const isModalOpen = computed(() => blario?.state.isModalOpen || false);
const reporterOptions = computed(() => blario?.state.reporterOptions || {});

const files = ref<File[]>([]);
const isSubmitting = ref(false);
const fileInput = ref<HTMLInputElement>();
const isDragOver = ref(false);

const formData = ref<{
  summary: string;
  steps?: string;
  expected?: string;
  actual?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
}>({
  summary: '',
  steps: '',
  expected: '',
  actual: '',
  severity: undefined,
  category: '',
});

// Watch for prefill data
watch(() => reporterOptions.value, (options) => {
  if (options.prefill) {
    formData.value = {
      summary: options.prefill.summary || '',
      steps: options.prefill.steps || '',
      expected: options.prefill.expected || '',
      actual: options.prefill.actual || '',
      severity: options.prefill.severity,
      category: options.category || options.prefill.category || '',
    };
  }
  if (options.category) {
    formData.value.category = options.category;
  }
}, { immediate: true });

const submitButtonText = computed(() => {
  const translations = t.value;
  if (isSubmitting.value && !isUploading) return translations.creatingIssue || 'Creating...';
  if (isUploading) {
    const anyVerifying = uploadProgress.some((p: any) => p.status === 'verifying');
    const anyUploading = uploadProgress.some((p: any) => p.status === 'uploading');
    if (anyVerifying) return translations.verifyingAttachments || 'Verifying...';
    if (anyUploading) return translations.uploadingFiles || 'Uploading...';
    return translations.preparingUpload || 'Preparing...';
  }
  return translations.submit || 'Submit';
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = Array.from(target.files || []);
  const MAX_FILES = 3;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

  const validFiles = selectedFiles.filter((file) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) return false;

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    return file.size <= maxSize;
  });

  files.value = [...files.value, ...validFiles].slice(0, MAX_FILES);
  clearUploadError();
  if (target) target.value = '';
};

const validateAndAddFiles = (incomingFiles: File[]) => {
  const MAX_FILES = 3;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

  const validFiles = incomingFiles.filter((file) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) return false;

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    return file.size <= maxSize;
  });

  files.value = [...files.value, ...validFiles].slice(0, MAX_FILES);
  clearUploadError();
};

const handleDragOver = () => {
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  const dropped = Array.from(event.dataTransfer?.files || []);
  if (dropped.length === 0) return;
  validateAndAddFiles(dropped);
};

const removeFile = (index: number) => {
  files.value = files.value.filter((_, i) => i !== index);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const KILOBYTE = 1024;
  const sizeUnits = ['Bytes', 'KB', 'MB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(KILOBYTE)), sizeUnits.length - 1);
  const value = bytes / Math.pow(KILOBYTE, unitIndex);
  return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${sizeUnits[unitIndex]}`;
};

const handleSubmit = async () => {
  isSubmitting.value = true;

  const issueData: FormData = {
    summary: formData.value.summary,
    steps: formData.value.steps || undefined,
    expected: formData.value.expected || undefined,
    actual: formData.value.actual || undefined,
    severity: formData.value.severity || undefined,
    category: formData.value.category || undefined,
  };

  try {
    const result = await submitIssueWithUploads(issueData, files.value);

    if (result?.issueId) {
      props.onSuccess?.(result.issueId);
      // Reset form
      formData.value = {
        summary: '',
        steps: '',
        expected: '',
        actual: '',
        severity: undefined,
        category: '',
      };
      files.value = [];
      blario?.actions.closeReporter();
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to submit issue');
    props.onError?.(err);
    console.error('Failed to submit issue:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCloseModal = () => {
  clearUploadError();
  blario?.actions.closeReporter();
};
</script>
