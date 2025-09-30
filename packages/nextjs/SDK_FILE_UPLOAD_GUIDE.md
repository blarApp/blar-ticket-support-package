# Blario SDK - File Upload Implementation Guide

## Overview

This guide explains how to implement file uploads in your Blario SDK. The system uses Google Cloud Storage (GCS) with signed URLs, allowing users to attach images and videos to their bug reports securely and efficiently.

## Quick Start

### Basic Flow

1. **Prepare** - Get signed upload URLs from backend
2. **Upload** - Send files directly to GCS
3. **Submit** - Create issue with attachment references

## SDK Implementation Examples

### JavaScript/TypeScript SDK

```javascript
class BlarioSDK {
  constructor(config) {
    this.projectId = config.projectId;
    this.publishableKey = config.publishableKey;
    this.apiUrl = config.apiUrl || 'https://api.yourserver.com/api/blario/v1';
  }

  /**
   * Submit an issue with file attachments
   * @param {Object} issueData - The issue data (summary, steps, etc.)
   * @param {File[]} files - Array of File objects to upload
   */
  async submitIssueWithAttachments(issueData, files = []) {
    try {
      let attachmentTokens = [];

      // Step 1: Upload attachments if any
      if (files && files.length > 0) {
        attachmentTokens = await this.uploadAttachments(files);
      }

      // Step 2: Submit the issue
      const issue = await this.submitIssue(issueData);

      // Step 3: Link attachments to issue if any were uploaded
      if (attachmentTokens.length > 0) {
        await this.verifyAttachments(issue.issueId, attachmentTokens);
      }

      return issue;
    } catch (error) {
      console.error('Failed to submit issue:', error);
      throw error;
    }
  }

  /**
   * Upload files and get upload tokens
   */
  async uploadAttachments(files) {
    // Validate files before upload
    this.validateFiles(files);

    // Step 1: Prepare uploads - get signed URLs
    const prepareResponse = await fetch(`${this.apiUrl}/attachments/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Project-Id': this.projectId,
        'X-Publishable-Key': this.publishableKey,
      },
      body: JSON.stringify({
        files: files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
        })),
      }),
    });

    if (!prepareResponse.ok) {
      const error = await prepareResponse.json();
      throw new Error(error.message || 'Failed to prepare upload');
    }

    const { uploads } = await prepareResponse.json();

    // Step 2: Upload each file directly to GCS
    const uploadPromises = uploads.map(async (config, index) => {
      const file = files[index];

      console.log(`Uploading ${file.name}...`);

      const uploadResponse = await fetch(config.upload_url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      console.log(`Successfully uploaded ${file.name}`);
      return config.upload_token;
    });

    // Wait for all uploads to complete
    const tokens = await Promise.all(uploadPromises);
    return tokens;
  }

  /**
   * Submit issue data
   */
  async submitIssue(issueData) {
    const response = await fetch(`${this.apiUrl}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Project-Id': this.projectId,
        'X-Publishable-Key': this.publishableKey,
      },
      body: JSON.stringify({
        projectId: this.projectId,
        ...issueData,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit issue');
    }

    return await response.json();
  }

  /**
   * Verify that attachments were uploaded and link them to the issue
   */
  async verifyAttachments(issueId, uploadTokens) {
    const response = await fetch(`${this.apiUrl}/attachments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Project-Id': this.projectId,
        'X-Publishable-Key': this.publishableKey,
      },
      body: JSON.stringify({
        issue_id: issueId,
        upload_tokens: uploadTokens,
      }),
    });

    if (!response.ok) {
      console.warn('Failed to verify some attachments');
    }

    return await response.json();
  }

  /**
   * Validate files before upload
   */
  validateFiles(files) {
    const MAX_FILES = 5;
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

    const ALLOWED_IMAGE_TYPES = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp'
    ];

    const ALLOWED_VIDEO_TYPES = [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv'
    ];

    if (files.length > MAX_FILES) {
      throw new Error(`Maximum ${MAX_FILES} files allowed`);
    }

    files.forEach(file => {
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        throw new Error(`File type ${file.type} is not allowed`);
      }

      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      const maxSizeLabel = isVideo ? '50MB' : '5MB';

      if (file.size > maxSize) {
        throw new Error(`File ${file.name} exceeds ${maxSizeLabel} limit`);
      }
    });
  }
}
```

### React Component Example

```jsx
import React, { useState } from 'react';
import { BlarioSDK } from '@blario/sdk';

const BugReportForm = () => {
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const blario = new BlarioSDK({
    projectId: 'your-project-id',
    publishableKey: 'pk_live_xxxxx',
    apiUrl: 'https://api.yourserver.com/api/blario/v1'
  });

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validate files
    try {
      blario.validateFiles(selectedFiles);
      setFiles(selectedFiles);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress('Preparing upload...');

    try {
      const formData = new FormData(e.target);

      const issueData = {
        form: {
          summary: formData.get('summary'),
          steps: formData.get('steps'),
          expected: formData.get('expected'),
          actual: formData.get('actual'),
          severity: formData.get('severity'),
        },
        user: {
          email: formData.get('email'),
        },
        meta: {
          url: window.location.href,
          viewport: {
            w: window.innerWidth,
            h: window.innerHeight,
          },
          ua: navigator.userAgent,
          ts: Date.now(),
        }
      };

      // Submit with attachments
      if (files.length > 0) {
        setUploadProgress(`Uploading ${files.length} file(s)...`);
      }

      const result = await blario.submitIssueWithAttachments(issueData, files);

      setUploadProgress('');
      alert(`Issue submitted successfully! ID: ${result.issueId}`);

      // Reset form
      e.target.reset();
      setFiles([]);

    } catch (error) {
      console.error('Submission failed:', error);
      alert(`Failed to submit: ${error.message}`);
    } finally {
      setSubmitting(false);
      setUploadProgress('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Report a Bug</h2>

      <div>
        <label>Summary *</label>
        <input name="summary" required />
      </div>

      <div>
        <label>Steps to Reproduce</label>
        <textarea name="steps" />
      </div>

      <div>
        <label>Expected Behavior</label>
        <textarea name="expected" />
      </div>

      <div>
        <label>Actual Behavior</label>
        <textarea name="actual" />
      </div>

      <div>
        <label>Severity</label>
        <select name="severity">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div>
        <label>Your Email</label>
        <input type="email" name="email" />
      </div>

      <div>
        <label>Attachments (Images or Videos)</label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          max="5"
        />
        <small>Max 5 files. Images: 5MB, Videos: 50MB</small>
        {files.length > 0 && (
          <ul>
            {files.map((file, i) => (
              <li key={i}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)</li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? uploadProgress || 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
};

export default BugReportForm;
```

### Vue.js Example

```javascript
// blario-upload.js
export class BlarioUploader {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async uploadWithProgress(files, onProgress) {
    const prepareResponse = await fetch(`${this.sdk.apiUrl}/attachments/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Project-Id': this.sdk.projectId,
        'X-Publishable-Key': this.sdk.publishableKey,
      },
      body: JSON.stringify({
        files: files.map(f => ({
          name: f.name,
          type: f.type,
          size: f.size,
        })),
      }),
    });

    const { uploads } = await prepareResponse.json();
    const tokens = [];

    for (let i = 0; i < uploads.length; i++) {
      const config = uploads[i];
      const file = files[i];

      onProgress(i + 1, files.length, file.name);

      const response = await fetch(config.upload_url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      tokens.push(config.upload_token);
    }

    return tokens;
  }
}

// BugReport.vue
<template>
  <div class="bug-report">
    <form @submit.prevent="submitReport">
      <!-- Form fields -->

      <div class="file-upload">
        <label>Attach Screenshots or Videos</label>
        <input
          type="file"
          ref="fileInput"
          @change="handleFiles"
          multiple
          accept="image/*,video/*"
        />

        <div v-if="selectedFiles.length" class="file-list">
          <div v-for="file in selectedFiles" :key="file.name">
            {{ file.name }} ({{ formatSize(file.size) }})
          </div>
        </div>

        <div v-if="uploadProgress" class="progress">
          {{ uploadProgress }}
        </div>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
      </button>
    </form>
  </div>
</template>

<script>
import { BlarioSDK, BlarioUploader } from '@blario/sdk';

export default {
  data() {
    return {
      selectedFiles: [],
      isSubmitting: false,
      uploadProgress: '',
      sdk: null,
      uploader: null,
    };
  },

  mounted() {
    this.sdk = new BlarioSDK({
      projectId: process.env.VUE_APP_BLARIO_PROJECT_ID,
      publishableKey: process.env.VUE_APP_BLARIO_KEY,
    });
    this.uploader = new BlarioUploader(this.sdk);
  },

  methods: {
    handleFiles(e) {
      this.selectedFiles = Array.from(e.target.files);

      try {
        this.sdk.validateFiles(this.selectedFiles);
      } catch (error) {
        alert(error.message);
        this.selectedFiles = [];
        this.$refs.fileInput.value = '';
      }
    },

    async submitReport() {
      this.isSubmitting = true;

      try {
        let tokens = [];

        if (this.selectedFiles.length > 0) {
          tokens = await this.uploader.uploadWithProgress(
            this.selectedFiles,
            (current, total, fileName) => {
              this.uploadProgress = `Uploading ${current}/${total}: ${fileName}`;
            }
          );
        }

        // Submit issue...
        const issue = await this.sdk.submitIssue(this.formData);

        if (tokens.length > 0) {
          await this.sdk.verifyAttachments(issue.issueId, tokens);
        }

        this.$emit('submitted', issue);
        this.resetForm();

      } catch (error) {
        console.error('Failed to submit:', error);
        alert(error.message);
      } finally {
        this.isSubmitting = false;
        this.uploadProgress = '';
      }
    },

    formatSize(bytes) {
      const mb = bytes / 1024 / 1024;
      return `${mb.toFixed(2)}MB`;
    },

    resetForm() {
      this.selectedFiles = [];
      this.$refs.fileInput.value = '';
    }
  }
};
</script>
```

## API Reference

### 1. Prepare Upload Endpoint

**Request:**
```http
POST /api/blario/v1/attachments/prepare
Headers:
  X-Project-Id: your-project-id
  X-Publishable-Key: pk_live_xxxxx
  Content-Type: application/json

Body:
{
  "files": [
    {
      "name": "screenshot.png",
      "type": "image/png",
      "size": 1048576
    },
    {
      "name": "bug-video.mp4",
      "type": "video/mp4",
      "size": 10485760
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "uploads": [
    {
      "upload_url": "https://storage.googleapis.com/bucket/path?signature=xxx",
      "upload_token": "unique_token_abc123",
      "gcs_path": "support-agent/projects/xxx/images/20240315/file.png",
      "expires_in": 900,
      "max_size": 5242880,
      "file_type": "image"
    },
    {
      "upload_url": "https://storage.googleapis.com/bucket/path?signature=yyy",
      "upload_token": "unique_token_def456",
      "gcs_path": "support-agent/projects/xxx/videos/20240315/file.mp4",
      "expires_in": 900,
      "max_size": 52428800,
      "file_type": "video"
    }
  ]
}
```

**Error Responses:**
```json
// 400 Bad Request - Invalid file type
{
  "error": "VALIDATION_ERROR",
  "message": "File type application/pdf not allowed"
}

// 400 Bad Request - File too large
{
  "error": "VALIDATION_ERROR",
  "message": "File exceeds maximum size of 5MB"
}

// 429 Too Many Requests
{
  "error": "RATE_LIMIT",
  "message": "Too many upload requests"
}
```

### 2. Upload to GCS (Direct)

**Request:**
```http
PUT <upload_url_from_prepare_response>
Headers:
  Content-Type: image/png

Body: <binary file data>
```

**Response:**
- 200 OK - Upload successful
- 403 Forbidden - Signed URL expired or invalid
- 413 Payload Too Large - File exceeds size limit

### 3. Verify Attachments

**Request:**
```http
POST /api/blario/v1/attachments/verify
Headers:
  X-Project-Id: your-project-id
  X-Publishable-Key: pk_live_xxxxx
  Content-Type: application/json

Body:
{
  "issue_id": "issue_abc123",
  "upload_tokens": [
    "unique_token_abc123",
    "unique_token_def456"
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "attachments": [
    {
      "id": 1,
      "name": "screenshot.png",
      "size": 1048576,
      "type": "image/png",
      "url": "https://storage.googleapis.com/..."
    },
    {
      "id": 2,
      "name": "bug-video.mp4",
      "size": 10485760,
      "type": "video/mp4",
      "url": "https://storage.googleapis.com/..."
    }
  ]
}
```

## File Type and Size Limits

### Allowed File Types

| Type | MIME Types | Extensions | Max Size |
|------|------------|------------|----------|
| **Images** | image/png | .png | 5MB |
| | image/jpeg | .jpg, .jpeg | 5MB |
| | image/gif | .gif | 5MB |
| | image/webp | .webp | 5MB |
| **Videos** | video/mp4 | .mp4 | 50MB |
| | video/webm | .webm | 50MB |
| | video/quicktime | .mov, .qt | 50MB |
| | video/x-msvideo | .avi | 50MB |
| | video/x-ms-wmv | .wmv | 50MB |

### Limits
- **Max files per issue**: 5
- **Max total size**: 100MB
- **Upload URL expiry**: 15 minutes
- **Download URL expiry**: 1 hour

## Error Handling

### Common Errors and Solutions

```javascript
class BlarioSDK {
  async handleUploadError(error, file) {
    if (error.message.includes('exceeds') && error.message.includes('limit')) {
      // File too large
      const isVideo = file.type.startsWith('video/');
      const limit = isVideo ? '50MB' : '5MB';
      throw new Error(`${file.name} exceeds the ${limit} limit`);
    }

    if (error.message.includes('not allowed')) {
      // Invalid file type
      throw new Error(`${file.name} is not a supported file type. Please use images (PNG, JPEG, GIF, WebP) or videos (MP4, WebM, MOV, AVI, WMV)`);
    }

    if (error.status === 429) {
      // Rate limited
      throw new Error('Too many upload attempts. Please wait a moment and try again.');
    }

    if (error.status === 403) {
      // Expired or invalid URL
      throw new Error('Upload link expired. Please try again.');
    }

    // Generic error
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  }
}
```

## Best Practices

### 1. Progressive Enhancement
```javascript
// Check if file upload is supported
if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
  // Hide file upload UI
  document.querySelector('.file-upload').style.display = 'none';
}
```

### 2. Client-Side Validation
```javascript
// Validate before sending to server
function validateFile(file) {
  // Check file size
  const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' };
  }

  // Check file type
  const allowedTypes = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'
  ];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }

  return { valid: true };
}
```

### 3. Show Upload Progress
```javascript
async uploadWithXHR(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));

    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
```

### 4. Retry Logic
```javascript
async uploadWithRetry(url, file, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (response.ok) return response;

      if (response.status === 403 || response.status === 401) {
        // Don't retry auth errors
        throw new Error('Upload authorization failed');
      }

    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

## Testing Your Implementation

### Test Upload Flow
```javascript
// test-upload.js
async function testUpload() {
  const sdk = new BlarioSDK({
    projectId: 'test-project',
    publishableKey: 'pk_test_xxxxx',
    apiUrl: 'http://localhost:8000/api/blario/v1'
  });

  // Create test file
  const blob = new Blob(['test content'], { type: 'text/plain' });
  const file = new File([blob], 'test.txt', { type: 'text/plain' });

  try {
    // This should fail with "File type not allowed"
    await sdk.uploadAttachments([file]);
  } catch (error) {
    console.log('Expected error:', error.message);
  }

  // Create valid test image
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);

  canvas.toBlob(async (blob) => {
    const file = new File([blob], 'test.png', { type: 'image/png' });

    try {
      const tokens = await sdk.uploadAttachments([file]);
      console.log('Upload successful, tokens:', tokens);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, 'image/png');
}
```

## Security Notes

1. **Never expose secret keys** - Only use publishable keys in client-side code
2. **Validate on server** - Client-side validation is for UX, server validates for security
3. **Use HTTPS** - Always use HTTPS in production
4. **Domain restrictions** - Configure allowed domains in your project settings

## Support

For issues or questions about the file upload implementation:
- Check the [Backend Security Guide](./BACKEND_SECURITY_GCS.md)
- Review [Backend Integration Guide](./BACKEND_INTEGRATION.md)
- Contact support with your project ID and issue details