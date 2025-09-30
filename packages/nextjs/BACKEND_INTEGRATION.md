# Backend Integration Guide for Blario

This guide explains how to implement the backend API endpoints to receive issue reports from the Blario Next.js SDK.

## Overview

The Blario SDK sends issue reports to your backend API, which should then forward them to Blario's API for AI-powered diagnostics. This architecture allows you to:

- Validate publishable keys
- Implement domain restrictions
- Add custom authentication
- Control rate limiting
- Filter/enrich data before sending to Blario

## API Endpoints Required

### 1. Issue Submission Endpoint

**Endpoint:** `POST /support/issue`

This endpoint receives issue reports from the client SDK.

#### Request Headers

```http
Content-Type: application/json
X-Project-Id: <project_id>
X-Publishable-Key: <publishable_key>
Origin: https://yourapp.com
```

#### Request Payload

```typescript
interface IssueReportPayload {
  projectId: string;
  publishableKey: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
  meta: {
    url: string;
    route: string;
    ts: number;
    locale?: string;
    viewport: {
      w: number;
      h: number;
    };
    ua?: string;
    appVersion?: string;
    release?: string;
    featureFlags?: Record<string, boolean>;
  };
  console?: Array<{
    level: 'error' | 'warn' | 'info' | 'log';
    message: string;
    ts: number;
    stack?: string;
  }>;
  network?: Array<{
    url: string;
    method: string;
    status: number;
    durationMs: number;
    ts: number;
  }>;
  form: {
    summary: string;
    steps?: string;
    expected?: string;
    actual?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    category?: string;
  };
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
    content: string; // base64 encoded
  }>;
}
```

#### Response

```typescript
interface IssueSubmitResponse {
  issueId: string;
}
```

**Status Codes:**
- `200 OK` - Issue submitted successfully
- `400 Bad Request` - Invalid payload
- `403 Forbidden` - Invalid publishable key or domain
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error


## Implementation Example (Node.js/Express)

```javascript
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();

// Configuration
const BLARIO_API_KEY = process.env.BLARIO_API_KEY; // Your secret API key
const BLARIO_API_URL = 'https://api.blar.io';
const ALLOWED_DOMAINS = ['https://yourapp.com', 'https://*.yourapp.com'];

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: ALLOWED_DOMAINS,
  credentials: true
}));

// Rate limiting per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many requests'
});

// Validate publishable key
async function validatePublishableKey(projectId, publishableKey) {
  // Check against your database
  const project = await db.projects.findOne({
    id: projectId,
    publishableKey: publishableKey
  });
  return !!project;
}

// Validate request origin
function validateOrigin(origin) {
  return ALLOWED_DOMAINS.some(domain => {
    if (domain.includes('*')) {
      const regex = new RegExp(domain.replace('*', '.*'));
      return regex.test(origin);
    }
    return domain === origin;
  });
}

// Issue submission endpoint
app.post('/support/issue', limiter, async (req, res) => {
  try {
    // 1. Validate headers
    const projectId = req.headers['x-project-id'];
    const publishableKey = req.headers['x-publishable-key'];
    const origin = req.headers.origin || req.headers.referer;

    if (!projectId || !publishableKey) {
      return res.status(400).json({
        error: 'Missing required headers'
      });
    }

    // 2. Validate publishable key
    const isValidKey = await validatePublishableKey(projectId, publishableKey);
    if (!isValidKey) {
      return res.status(403).json({
        error: 'Invalid publishable key'
      });
    }

    // 3. Validate origin (domain restriction)
    if (!validateOrigin(origin)) {
      return res.status(403).json({
        error: 'Domain not allowed'
      });
    }

    // 4. Validate payload
    const { form, user, meta, console, network } = req.body;

    if (!form?.summary) {
      return res.status(400).json({
        error: 'Issue summary is required'
      });
    }

    // 5. Optional: Enrich with server-side data
    const enrichedPayload = {
      ...req.body,
      serverMeta: {
        receivedAt: new Date().toISOString(),
        userIp: req.ip,
        serverVersion: process.env.APP_VERSION
      }
    };

    // 6. Forward to Blario API
    const blarioResponse = await fetch(`${BLARIO_API_URL}/api/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BLARIO_API_KEY}`,
        'X-Project-Id': projectId
      },
      body: JSON.stringify(enrichedPayload)
    });

    if (!blarioResponse.ok) {
      throw new Error(`Blario API error: ${blarioResponse.status}`);
    }

    const { issueId } = await blarioResponse.json();

    // 7. Optional: Store issue reference in your database
    await db.issues.create({
      issueId,
      projectId,
      userId: user?.id,
      createdAt: new Date()
    });

    // 8. Return issue ID to client
    res.json({ issueId });

  } catch (error) {
    console.error('Issue submission error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});


app.listen(3000, () => {
  console.log('Blario backend running on port 3000');
});
```

## Security Best Practices

### 1. Publishable Key Validation

```javascript
// Store publishable keys in your database
const projectSchema = {
  id: String,
  name: String,
  publishableKey: String, // pk_live_xxx or pk_test_xxx
  secretKey: String,     // sk_live_xxx (never expose to client)
  allowedDomains: [String],
  createdAt: Date
};
```

### 2. Domain Whitelisting

```javascript
function validateDomain(origin, allowedDomains) {
  // Check exact match and wildcards
  return allowedDomains.some(domain => {
    if (domain.startsWith('*.')) {
      const baseDomain = domain.slice(2);
      return origin.endsWith(baseDomain);
    }
    return origin === domain;
  });
}
```

### 3. Rate Limiting Strategies

```javascript
// Per user rate limiting
const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body.user?.id || req.ip,
  skip: (req) => !req.body.user?.id
});

// Per project rate limiting
const projectLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.headers['x-project-id']
});
```

### 4. Data Sanitization

```javascript
function sanitizePayload(payload) {
  // Remove sensitive patterns
  const sensitivePatterns = [
    /api[_-]?key/gi,
    /password/gi,
    /token/gi,
    /secret/gi,
    /credit[_-]?card/gi,
    /ssn/gi
  ];

  const sanitize = (text) => {
    if (typeof text !== 'string') return text;

    let sanitized = text;
    sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    return sanitized;
  };

  // Recursively sanitize all strings
  const deepSanitize = (obj) => {
    if (typeof obj === 'string') return sanitize(obj);
    if (Array.isArray(obj)) return obj.map(deepSanitize);
    if (typeof obj === 'object' && obj !== null) {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = deepSanitize(value);
      }
      return result;
    }
    return obj;
  };

  return deepSanitize(payload);
}
```

## Environment Variables

```bash
# .env
BLARIO_API_KEY=sk_live_xxx        # Your secret API key from Blario
BLARIO_API_URL=https://api.blar.io
ALLOWED_DOMAINS=https://yourapp.com,https://staging.yourapp.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

## Database Schema

```sql
-- Projects table
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  publishable_key VARCHAR(255) UNIQUE NOT NULL,
  secret_key VARCHAR(255) NOT NULL,
  allowed_domains TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issues table
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  issue_id VARCHAR(255) UNIQUE NOT NULL,
  project_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255),
  summary TEXT,
  severity VARCHAR(50),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Rate limiting table (optional)
CREATE TABLE rate_limits (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  request_count INT DEFAULT 1,
  window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_identifier_window (identifier, window_start)
);
```

## Testing Your Implementation

### 1. Test Publishable Key Validation

```bash
# Should fail with 403
curl -X POST https://your-api.com/support/issue \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: test-project" \
  -H "X-Publishable-Key: invalid-key" \
  -d '{"form": {"summary": "Test issue"}}'
```

### 2. Test Domain Restriction

```bash
# Should fail with 403 from unauthorized domain
curl -X POST https://your-api.com/support/issue \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil-site.com" \
  -H "X-Project-Id: test-project" \
  -H "X-Publishable-Key: pk_test_xxx" \
  -d '{"form": {"summary": "Test issue"}}'
```

### 3. Test Rate Limiting

```bash
# Run this 11 times quickly, 11th should fail with 429
for i in {1..11}; do
  curl -X POST https://your-api.com/support/issue \
    -H "Content-Type: application/json" \
    -H "X-Project-Id: test-project" \
    -H "X-Publishable-Key: pk_test_xxx" \
    -d '{"form": {"summary": "Test issue"}}'
done
```

## Monitoring & Alerts

Set up monitoring for:

1. **Rate Limit Violations**
   - Alert when specific IPs or users exceed limits
   - Track patterns of abuse

2. **Invalid Key Attempts**
   - Monitor failed authentication attempts
   - Detect potential attacks

3. **Error Rates**
   - Track 5xx errors
   - Monitor Blario API connectivity

4. **Performance Metrics**
   - Response times
   - Payload sizes
   - Queue lengths

## Support

For questions about the Blario API or to obtain API keys, contact:
- Email: support@blar.io
- Documentation: https://docs.blar.io
- API Status: https://status.blar.io