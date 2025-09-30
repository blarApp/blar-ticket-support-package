# Secure Attachment Handling with Google Cloud Storage (GCS)

This guide covers implementing secure attachment uploads for the Blario SDK using Google Cloud Storage, with emphasis on security best practices.

## Architecture Overview

```
Client SDK → Your Backend → GCS
     ↓            ↓         ↓
  Metadata    Validation  Storage
```

## Implementation Options

### Option 1: Signed URLs (Recommended) ⭐

This approach allows clients to upload directly to GCS without sending files through your backend.

#### Flow:

1. Client requests upload URLs from backend
2. Backend generates signed URLs with restrictions
3. Client uploads directly to GCS
4. Client sends issue with attachment metadata
5. Backend validates and processes

#### Backend Implementation:

```javascript
const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');
const storage = new Storage();
const bucket = storage.bucket('your-bucket-name');

// Endpoint 1: Generate signed upload URLs
app.post('/api/support/attachments/prepare', async (req, res) => {
  try {
    // 1. Validate request
    const { projectId, publishableKey } = req.headers;
    if (!validatePublishableKey(projectId, publishableKey)) {
      return res.status(403).json({ error: 'Invalid credentials' });
    }

    const { files } = req.body; // [{ name, type, size }]

    // 2. Security validations
    const MAX_FILES = 3;
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB for videos
    const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];

    if (files.length > MAX_FILES) {
      return res.status(400).json({ error: `Maximum ${MAX_FILES} files allowed` });
    }

    const uploadConfigs = [];

    for (const file of files) {
      // Validate file type and size
      const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isImage && !isVideo) {
        return res.status(400).json({
          error: `File type ${file.type} not allowed`
        });
      }

      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      const maxSizeLabel = isVideo ? '50MB' : '5MB';

      if (file.size > maxSize) {
        return res.status(400).json({
          error: `File ${file.name} exceeds maximum size of ${maxSizeLabel}`
        });
      }

      // 3. Generate secure filename
      const fileId = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const extension = sanitizedName.split('.').pop();

      // Structure: projects/{projectId}/issues/{timestamp}/{fileId}.{ext}
      const gcsPath = `projects/${projectId}/issues/${timestamp}/${fileId}.${extension}`;

      // 4. Generate signed URL with restrictions
      const [signedUrl] = await bucket.file(gcsPath).getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: file.type,

        // Security constraints
        extensionHeaders: {
          'x-goog-content-length-range': `0,${maxSize}`,
          'x-goog-meta-project-id': projectId,
          'x-goog-meta-original-name': sanitizedName,
          'x-goog-meta-file-type': isVideo ? 'video' : 'image',
        },

        // Prevent overwrites
        conditions: [
          ['eq', '$x-goog-meta-project-id', projectId],
          ['content-length-range', 0, maxSize],
        ],
      });

      uploadConfigs.push({
        uploadUrl: signedUrl,
        fileId,
        gcsPath,
        originalName: file.name,
      });
    }

    // 5. Store upload intent (for validation later)
    await storeUploadIntent({
      projectId,
      uploadConfigs,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    res.json({ uploads: uploadConfigs });

  } catch (error) {
    console.error('Error generating signed URLs:', error);
    res.status(500).json({ error: 'Failed to prepare upload' });
  }
});

// Endpoint 2: Submit issue with attachment references
app.post('/api/support/issue', async (req, res) => {
  try {
    const { attachments, ...issueData } = req.body;

    if (attachments && attachments.length > 0) {
      // Validate attachments were uploaded
      for (const attachment of attachments) {
        const file = bucket.file(attachment.gcsPath);
        const [exists] = await file.exists();

        if (!exists) {
          return res.status(400).json({
            error: `Attachment ${attachment.fileId} not found`
          });
        }

        // Optional: Verify file metadata
        const [metadata] = await file.getMetadata();
        if (metadata.size > 5 * 1024 * 1024) {
          // Delete oversized file
          await file.delete();
          return res.status(400).json({
            error: 'File exceeds size limit'
          });
        }

        // Generate secure public URL (if needed)
        attachment.url = `https://storage.googleapis.com/${bucket.name}/${attachment.gcsPath}`;
      }
    }

    // Process issue with validated attachments
    const issueId = await createIssue({
      ...issueData,
      attachments,
    });

    res.json({ issueId });

  } catch (error) {
    console.error('Error submitting issue:', error);
    res.status(500).json({ error: 'Failed to submit issue' });
  }
});
```

#### Client SDK Usage:

```javascript
// 1. Prepare upload
const { uploads } = await fetch('/api/support/attachments/prepare', {
  method: 'POST',
  headers: {
    'X-Project-Id': projectId,
    'X-Publishable-Key': publishableKey,
  },
  body: JSON.stringify({
    files: attachments.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size,
    })),
  }),
}).then(r => r.json());

// 2. Upload files directly to GCS
const uploadedFiles = await Promise.all(
  uploads.map(async (config, index) => {
    const file = attachments[index];
    const response = await fetch(config.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) throw new Error('Upload failed');

    return {
      fileId: config.fileId,
      gcsPath: config.gcsPath,
      originalName: config.originalName,
    };
  })
);

// 3. Submit issue with attachment references
await fetch('/api/support/issue', {
  method: 'POST',
  body: JSON.stringify({
    ...issueData,
    attachments: uploadedFiles,
  }),
});
```

### Option 2: Base64 JSON (Current Implementation)

If keeping the current base64 approach, here's how to handle it securely:

```javascript
app.post('/api/support/issue', async (req, res) => {
  try {
    const { attachments, ...issueData } = req.body;

    if (attachments && attachments.length > 0) {
      const processedAttachments = [];

      for (const attachment of attachments) {
        // 1. Validate base64 data
        const base64Regex = /^data:(image|video)\/(png|jpeg|jpg|gif|webp|mp4|webm|quicktime|x-msvideo|x-ms-wmv);base64,/;
        if (!base64Regex.test(attachment.dataUrl)) {
          return res.status(400).json({
            error: 'Invalid attachment format'
          });
        }

        // 2. Extract and validate size
        const base64Data = attachment.dataUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        const mimeType = attachment.mime || attachment.dataUrl.match(/^data:([^;]+);/)?.[1];
        const isVideo = mimeType?.startsWith('video/');
        const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
        const sizeLabel = isVideo ? '50MB' : '5MB';

        if (buffer.length > maxSize) {
          return res.status(400).json({
            error: `Attachment exceeds ${sizeLabel} limit`
          });
        }

        // 3. Scan for malware (optional but recommended)
        // const isSafe = await scanBuffer(buffer);
        // if (!isSafe) {
        //   return res.status(400).json({ error: 'Malicious file detected' });
        // }

        // 4. Upload to GCS
        const fileId = crypto.randomBytes(16).toString('hex');
        const gcsPath = `projects/${projectId}/issues/${Date.now()}/${fileId}.${attachment.mime.split('/')[1]}`;

        const file = bucket.file(gcsPath);
        await file.save(buffer, {
          metadata: {
            contentType: attachment.mime,
            metadata: {
              originalName: attachment.name,
              projectId,
              uploadedAt: new Date().toISOString(),
            },
          },
        });

        processedAttachments.push({
          fileId,
          gcsPath,
          originalName: attachment.name,
          url: `https://storage.googleapis.com/${bucket.name}/${gcsPath}`,
        });
      }

      // Save issue with attachment references
      const issueId = await createIssue({
        ...issueData,
        attachments: processedAttachments,
      });

      res.json({ issueId });
    }

  } catch (error) {
    console.error('Error processing issue:', error);
    res.status(500).json({ error: 'Failed to submit issue' });
  }
});
```

## GCS Security Configuration

### 1. Bucket Configuration

```javascript
// Set bucket to private
await bucket.setMetadata({
  iamConfiguration: {
    uniformBucketLevelAccess: {
      enabled: true,
    },
  },
});

// Set lifecycle rules to auto-delete old files
await bucket.addLifecycleRule({
  action: { type: 'Delete' },
  condition: { age: 90 }, // Delete files older than 90 days
});
```

### 2. IAM Permissions

```yaml
# Service account permissions (principle of least privilege)
roles:
  - roles/storage.objectCreator  # Can create but not delete
  - roles/storage.objectViewer   # Can read objects

# Bucket-level IAM
bindings:
  - role: roles/storage.objectViewer
    members:
      - serviceAccount:blario-backend@project.iam.gserviceaccount.com
```

### 3. CORS Configuration (for direct uploads)

```json
[
  {
    "origin": ["https://yourapp.com"],
    "method": ["PUT", "POST"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

Apply CORS:
```bash
gsutil cors set cors-config.json gs://your-bucket-name
```

## Security Best Practices

### 1. Input Validation

```javascript
const validateFile = (file) => {
  const errors = [];

  // Size validation
  const mimeType = file.type || file.mime;
  const isVideo = mimeType?.startsWith('video/');
  const MAX_SIZE = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
  const sizeLabel = isVideo ? '50MB' : '5MB';

  if (file.size > MAX_SIZE) {
    errors.push(`File exceeds ${sizeLabel} limit`);
  }

  // Type validation (check MIME and extension)
  const ALLOWED_TYPES = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'video/mp4': ['.mp4'],
    'video/webm': ['.webm'],
    'video/quicktime': ['.mov'],
    'video/x-msvideo': ['.avi'],
    'video/x-ms-wmv': ['.wmv'],
  };

  const mimeType = file.type || file.mime;
  if (!ALLOWED_TYPES[mimeType]) {
    errors.push(`File type ${mimeType} not allowed`);
  }

  // Extension validation
  const fileName = file.name || file.originalName;
  const extension = '.' + fileName.split('.').pop().toLowerCase();
  const allowedExtensions = ALLOWED_TYPES[mimeType] || [];

  if (!allowedExtensions.includes(extension)) {
    errors.push(`File extension ${extension} doesn't match type ${mimeType}`);
  }

  // Filename sanitization
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  if (sanitizedName !== fileName) {
    console.warn(`Filename sanitized: ${fileName} -> ${sanitizedName}`);
  }

  return { valid: errors.length === 0, errors };
};
```

### 2. Rate Limiting

```javascript
// Per-user upload limits
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  keyGenerator: (req) => req.body.user?.id || req.ip,
  message: 'Too many uploads, please try again later',
});

app.post('/api/support/attachments/prepare', uploadLimiter, async (req, res) => {
  // ... handle upload
});
```

### 3. Virus Scanning

```javascript
const { CloudFunctionsServiceClient } = require('@google-cloud/functions');
const crypto = require('crypto');

// Trigger Cloud Function for virus scanning
const scanFile = async (bucketName, fileName) => {
  // Use Google Cloud Security Command Center or ClamAV
  const scanResult = await triggerVirusScan(bucketName, fileName);

  if (scanResult.infected) {
    // Delete infected file immediately
    await bucket.file(fileName).delete();

    // Log security incident
    await logSecurityIncident({
      type: 'MALWARE_DETECTED',
      file: fileName,
      threat: scanResult.threat,
    });

    throw new Error('Malicious file detected');
  }
};
```

### 4. Access Control

```javascript
// Generate time-limited public URLs for viewing
const generateViewUrl = async (gcsPath, expiresIn = 3600) => {
  const file = bucket.file(gcsPath);

  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresIn * 1000,
  });

  return signedUrl;
};

// Never expose permanent public URLs
// Always use signed URLs with expiration
```

### 5. Storage Organization

```
bucket/
├── projects/
│   ├── {projectId}/
│   │   ├── issues/
│   │   │   ├── {timestamp}/
│   │   │   │   ├── {fileId}.{ext}  # Actual files
│   │   │   │   └── metadata.json   # File metadata
│   │   └── quarantine/              # Suspicious files
│   │       └── {fileId}.{ext}
```

### 6. Monitoring & Alerts

```javascript
// Log all file operations
const logFileOperation = async (operation, details) => {
  await logger.info({
    type: 'FILE_OPERATION',
    operation,
    projectId: details.projectId,
    fileId: details.fileId,
    size: details.size,
    mime: details.mime,
    user: details.user,
    ip: details.ip,
    timestamp: new Date().toISOString(),
  });
};

// Set up alerts for suspicious activity
const detectAnomalies = async (userId) => {
  const recentUploads = await getRecentUploads(userId, '1h');

  if (recentUploads.length > 10) {
    await alertAdmin({
      type: 'UNUSUAL_UPLOAD_ACTIVITY',
      userId,
      uploadCount: recentUploads.length,
    });
  }
};
```

### 7. Data Privacy

```javascript
// Auto-delete files after processing
const scheduleFileDeletion = async (gcsPath, deleteAfterDays = 90) => {
  const file = bucket.file(gcsPath);

  await file.setMetadata({
    metadata: {
      deleteAfter: new Date(Date.now() + deleteAfterDays * 24 * 60 * 60 * 1000).toISOString(),
    },
  });
};

// GDPR compliance - user data deletion
const deleteUserData = async (userId) => {
  const [files] = await bucket.getFiles({
    prefix: `users/${userId}/`,
  });

  await Promise.all(files.map(file => file.delete()));
};
```

## Environment Variables

```bash
# Google Cloud Storage
GCS_BUCKET_NAME=blario-attachments
GCS_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Security
MAX_IMAGE_SIZE_MB=5
MAX_VIDEO_SIZE_MB=50
MAX_FILES_PER_ISSUE=3
ALLOWED_IMAGE_TYPES=image/png,image/jpeg,image/jpg,image/gif,image/webp
ALLOWED_VIDEO_TYPES=video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-ms-wmv
SIGNED_URL_EXPIRY_MINUTES=15

# Rate Limiting
UPLOAD_RATE_LIMIT_PER_HOUR=20
UPLOAD_RATE_LIMIT_PER_DAY=100

# Storage Retention
FILE_RETENTION_DAYS=90
QUARANTINE_RETENTION_DAYS=7
```

## Testing Security

```bash
# Test file size limits
curl -X POST https://api.yoursite.com/support/attachments/prepare \
  -H "X-Project-Id: test" \
  -H "X-Publishable-Key: pk_test" \
  -d '{"files": [{"name": "large.png", "type": "image/png", "size": 10000000}]}'
# Should return 400 error

# Test file type validation
curl -X POST https://api.yoursite.com/support/attachments/prepare \
  -H "X-Project-Id: test" \
  -H "X-Publishable-Key: pk_test" \
  -d '{"files": [{"name": "script.js", "type": "application/javascript", "size": 1000}]}'
# Should return 400 error

# Test rate limiting
for i in {1..25}; do
  curl -X POST https://api.yoursite.com/support/attachments/prepare \
    -H "X-Project-Id: test" \
    -H "X-Publishable-Key: pk_test" \
    -d '{"files": [{"name": "test.png", "type": "image/png", "size": 1000}]}'
done
# Should get rate limited after 20 requests
```

## Monitoring Checklist

- [ ] File upload success/failure rates
- [ ] Average file sizes
- [ ] Upload frequency by project
- [ ] Signed URL expiration tracking
- [ ] Storage usage and costs
- [ ] Virus scan results
- [ ] Rate limit violations
- [ ] Unauthorized access attempts
- [ ] File type distribution
- [ ] Cleanup job success

## Security Incident Response

1. **Malware Detection**
   - Immediately quarantine file
   - Delete from main storage
   - Alert security team
   - Block user if repeated

2. **Unauthorized Access**
   - Revoke all signed URLs
   - Rotate service account keys
   - Audit recent access logs
   - Update security rules

3. **Data Breach**
   - Enable bucket lockdown
   - Audit all recent downloads
   - Notify affected users
   - File incident report

## Cost Optimization

- Use Standard storage class for recent files
- Move to Coldline after 30 days
- Delete after 90 days
- Enable request batching
- Use regional buckets (not multi-regional)
- Monitor egress costs