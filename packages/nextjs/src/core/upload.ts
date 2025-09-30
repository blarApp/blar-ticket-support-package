import type { ApiClient } from './api';

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
}

export interface UploadConfig {
  upload_url: string;
  upload_token: string;
  gcs_path: string;
  expires_in: number;
  max_size: number;
  file_type: 'image' | 'video';
  headers?: Record<string, string>; // Additional headers required by the signed URL
}

export interface PrepareUploadsResponse {
  uploads: UploadConfig[];
}

export interface VerifyAttachmentsResponse {
  success: boolean;
  attachments: Array<{
    id: number;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
}

export class UploadManager {
  private apiClient: ApiClient;

  // File validation constants
  private readonly MAX_FILES = 5;
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

  private readonly ALLOWED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp'
  ];

  private readonly ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv'
  ];

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Upload files to GCS using signed URLs
   */
  async uploadFiles(files: File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    // Validate files
    this.validateFiles(files);

    // Step 1: Get signed URLs from backend
    const uploadConfigs = await this.prepareUploads(files);

    // Step 2: Upload each file directly to GCS
    const uploadTokens = await this.performUploads(files, uploadConfigs);

    return uploadTokens;
  }

  /**
   * Prepare uploads by getting signed URLs from backend
   */
  private async prepareUploads(files: File[]): Promise<UploadConfig[]> {
    const fileMetadata: FileMetadata[] = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    const config = this.apiClient.getConfig();

    const response = await fetch(
      `${config.apiBaseUrl}/api/support/attachments/prepare`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Project-Id': config.projectId,
          'X-Publishable-Key': config.publishableKey,
        },
        body: JSON.stringify({ files: fileMetadata }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to prepare uploads' }));
      throw new Error(error.message || `Failed to prepare uploads: ${response.status}`);
    }

    const data: PrepareUploadsResponse = await response.json();
    return data.uploads;
  }

  /**
   * Upload files directly to GCS using signed URLs
   */
  private async performUploads(
    files: File[],
    uploadConfigs: UploadConfig[]
  ): Promise<string[]> {
    const uploadPromises = uploadConfigs.map(async (config, index) => {
      const file = files[index];

      if (!file) {
        throw new Error(`File at index ${index} is missing`);
      }

      try {
        // Build additional headers based on config
        const additionalHeaders: Record<string, string> = {};

        // Add x-goog-content-length-range header if max_size is provided
        if (config.max_size) {
          additionalHeaders['x-goog-content-length-range'] = `0,${config.max_size}`;
        }

        // Merge with any headers from backend
        if (config.headers) {
          Object.assign(additionalHeaders, config.headers);
        }

        const response = await this.uploadToGCS(config.upload_url, file, additionalHeaders);

        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }

        return config.upload_token;
      } catch (error) {
        throw new Error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Upload a single file to GCS
   */
  private async uploadToGCS(uploadUrl: string, file: File, additionalHeaders?: Record<string, string>): Promise<Response> {
    // For GCS signed URLs, typically only Content-Type is needed
    // Default to 'application/octet-stream' if file type is not available
    const headers: Record<string, string> = {
      'Content-Type': file.type || 'application/octet-stream',
    };

    // Only spread additional headers if they exist
    if (additionalHeaders) {
      Object.assign(headers, additionalHeaders);
    }

    return fetch(uploadUrl, {
      method: 'PUT',
      headers,
      body: file,
    });
  }

  /**
   * Upload with progress tracking using XMLHttpRequest
   */
  async uploadWithProgress(
    uploadUrl: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was cancelled'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  /**
   * Verify that attachments were uploaded successfully
   */
  async verifyAttachments(issueId: string, uploadTokens: string[]): Promise<VerifyAttachmentsResponse> {
    const config = this.apiClient.getConfig();

    const response = await fetch(
      `${config.apiBaseUrl}/api/support/attachments/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Project-Id': config.projectId,
          'X-Publishable-Key': config.publishableKey,
        },
        body: JSON.stringify({
          issue_id: issueId,
          upload_tokens: uploadTokens,
        }),
      }
    );

    if (!response.ok) {
      console.warn('Failed to verify some attachments');
      // Don't throw here - attachments are optional
      return { success: false, attachments: [] };
    }

    return response.json();
  }

  /**
   * Validate files before upload
   */
  private validateFiles(files: File[]): void {
    if (files.length > this.MAX_FILES) {
      throw new Error(`Maximum ${this.MAX_FILES} files allowed`);
    }

    for (const file of files) {
      const isImage = this.ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = this.ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        throw new Error(
          `File type ${file.type} is not allowed. Supported types: images (PNG, JPEG, GIF, WebP) and videos (MP4, WebM, MOV, AVI, WMV)`
        );
      }

      const maxSize = isVideo ? this.MAX_VIDEO_SIZE : this.MAX_IMAGE_SIZE;
      const maxSizeLabel = isVideo ? '50MB' : '5MB';

      if (file.size > maxSize) {
        throw new Error(`File "${file.name}" exceeds the ${maxSizeLabel} limit`);
      }
    }
  }

  /**
   * Upload with retry logic
   */
  async uploadWithRetry(
    uploadUrl: string,
    file: File,
    maxRetries: number = 3,
    additionalHeaders?: Record<string, string>
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await this.uploadToGCS(uploadUrl, file, additionalHeaders);

        if (response.ok) {
          return response;
        }

        // Don't retry on auth errors
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Upload authorization failed: ${response.status}`);
        }

        lastError = new Error(`Upload failed with status ${response.status}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Upload failed');

        // Don't retry on auth errors
        if (lastError.message.includes('authorization')) {
          throw lastError;
        }
      }

      // Wait before retry with exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Upload failed after retries');
  }
}

// Singleton instance management
let uploadManagerInstance: UploadManager | null = null;

export function getUploadManager(apiClient: ApiClient): UploadManager {
  if (!uploadManagerInstance) {
    uploadManagerInstance = new UploadManager(apiClient);
  }
  return uploadManagerInstance;
}

export function resetUploadManager(): void {
  uploadManagerInstance = null;
}