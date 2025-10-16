# @blario/vue

Drop-in issue reporter for Vue 3 applications with AI-powered diagnostics.

## Features

- **Zero Configuration**: Works out of the box with minimal setup
- **Vue 3 Composition API**: Modern Vue patterns with TypeScript support
- **AI-Powered Diagnostics**: Automatic issue categorization and insights
- **Context Capture**: Automatically captures console logs, network requests, and user context
- **File Uploads**: Support for screenshots and videos via signed URLs
- **Customizable UI**: Fully themeable with Tailwind CSS
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Vue Router Integration**: Automatic route tracking
- **Lightweight**: Tree-shakeable with minimal bundle impact

## Installation

```bash
npm install @blario/vue
# or
yarn add @blario/vue
# or
pnpm add @blario/vue
```

### Peer Dependencies

```bash
npm install vue@^3.3.0 vue-router@^4.0.0 tailwindcss@^3.4.0 tailwindcss-animate@^1.0.7
```

## Quick Start

### 1. Install the Plugin

```typescript
// main.ts
import { createApp } from 'vue';
import { BlarioPlugin } from '@blario/vue';
import '@blario/vue/styles.css';
import App from './App.vue';

const app = createApp(App);

app.use(BlarioPlugin, {
  publishableKey: 'your-publishable-key',
  apiBaseUrl: 'https://api.blar.io', // optional
  locale: 'en', // optional: 'en' | 'es'
  theme: {
    mode: 'light', // optional: 'light' | 'dark'
    position: 'bottom-right', // optional
  },
  capture: {
    console: true, // capture console logs
    networkSample: false, // capture network requests
  },
});

app.mount('#app');
```

### 2. Configure Tailwind CSS

Add the Blario preset to your `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  presets: [require('@blario/vue/tailwind-preset')],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // IMPORTANT: Include Blario's dist files for proper styling
    './node_modules/@blario/vue/dist/**/*.{js,mjs,cjs}',
  ],
  plugins: [require('tailwindcss-animate')],
  // ... your other config
};
```

**Important**: Make sure to include the Blario dist files in your Tailwind content paths. This ensures all Tailwind utility classes used by Blario components are included in your build.

### 3. Add the Components

Add both the button and modal to your app (typically in App.vue):

```vue
<template>
  <div>
    <!-- Your app content -->

    <!-- Blario Components -->
    <IssueReporterButton />
    <IssueReporterModal />
  </div>
</template>

<script setup lang="ts">
import { IssueReporterButton, IssueReporterModal } from '@blario/vue';
</script>
```

The modal is controlled by the plugin state - the button triggers it to open/close.

## Advanced Usage

### Using Composables

```vue
<template>
  <div>
    <button @click="handleReportIssue">Report Issue</button>
    <div v-if="lastDiagnostic">
      <p>{{ lastDiagnostic.diagnostic?.headline }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBlario } from '@blario/vue';

const {
  openReporter,
  closeReporter,
  reportIssue,
  lastDiagnostic,
  clearDiagnostic,
  isModalOpen,
  isSubmitting,
} = useBlario();

const handleReportIssue = () => {
  openReporter({
    category: 'bug',
    prefill: {
      summary: 'Issue with login',
      severity: 'high',
    },
  });
};
</script>
```

### File Uploads with Progress Tracking

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useBlarioUpload } from '@blario/vue';
import type { FormData } from '@blario/vue';

const { submitIssueWithUploads, isUploading, uploadProgress, uploadError } = useBlarioUpload();

const files = ref<File[]>([]);

const handleSubmit = async () => {
  const formData: FormData = {
    summary: 'Bug report with attachments',
    steps: 'Steps to reproduce...',
    severity: 'high',
  };

  try {
    const result = await submitIssueWithUploads(formData, files.value);
    console.log('Issue created:', result?.issueId);
  } catch (error) {
    console.error('Failed to submit:', error);
  }
};
</script>
```

### Custom User Context

```typescript
app.use(BlarioPlugin, {
  publishableKey: 'your-key',
  user: {
    id: 'user-123',
    email: 'user@example.com',
    name: 'John Doe',
  },
});
```

### Vue Router Integration

The plugin automatically integrates with Vue Router if detected:

```typescript
import { createRouter } from 'vue-router';

const router = createRouter({
  // your router config
});

app.use(router);
app.use(BlarioPlugin, {
  publishableKey: 'your-key',
});
```

Routes are automatically tracked in issue reports.

## Configuration Options

### BlarioPluginOptions

```typescript
interface BlarioPluginOptions {
  // Required
  publishableKey: string;

  // Optional
  apiBaseUrl?: string; // default: 'https://api.blar.io'
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
  locale?: 'en' | 'es'; // default: 'en'

  capture?: {
    console?: boolean; // default: true
    networkSample?: boolean; // default: false
    maxConsoleLogs?: number; // default: 50
    maxNetworkLogs?: number; // default: 20
  };

  theme?: {
    mode?: 'light' | 'dark'; // default: 'light'
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    accent?: string; // custom accent color
    className?: string; // additional CSS classes
  };

  redaction?: {
    patterns?: RegExp[]; // custom patterns to redact
    customRedactor?: (text: string) => string;
  };

  rateLimit?: {
    maxRequests?: number; // default: 10
    windowMs?: number; // default: 60000 (1 minute)
  };

  // Callbacks
  onAfterSubmit?: (issueId: string) => void;
  onError?: (error: Error) => void;
}
```

## Components

### IssueReporterButton

```vue
<IssueReporterButton
  variant="floating" <!-- 'floating' | 'inline' -->
  position="bottom-right" <!-- 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' -->
  category="bug"
  :prefill="{ summary: 'Issue title', severity: 'high' }"
  :unstyled="false"
  class-name="custom-class"
  :hide-icon="false"
  :hide-text="false"
  aria-label="Report an issue"
>
  Custom Button Text
</IssueReporterButton>
```

### IssueReporterModal

The modal is automatically included and controlled via the plugin state. You can also use it standalone:

```vue
<template>
  <IssueReporterModal
    @success="handleSuccess"
    @error="handleError"
    class-name="custom-modal-class"
  />
</template>

<script setup lang="ts">
const handleSuccess = (issueId: string) => {
  console.log('Issue created:', issueId);
};

const handleError = (error: Error) => {
  console.error('Error:', error);
};
</script>
```

## Composables

### useBlario()

```typescript
const {
  openReporter,      // (options?: { category?: string; prefill?: Record<string, any> }) => void
  closeReporter,     // () => void
  reportIssue,       // (formData: FormData, attachments?: File[]) => Promise<DiagnosticResponse | null>
  lastDiagnostic,    // DiagnosticResponse | null
  clearDiagnostic,   // () => void
  isModalOpen,       // boolean
  isSubmitting,      // boolean
} = useBlario();
```

### useBlarioUpload()

```typescript
const {
  uploadFiles,              // (files: File[]) => Promise<string[]>
  submitIssueWithUploads,   // (formData: FormData, files: File[]) => Promise<DiagnosticResponse | null>
  uploadProgress,           // UploadProgress[]
  isUploading,              // boolean
  uploadError,              // string | null
  clearUploadError,         // () => void
} = useBlarioUpload();
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  BlarioPluginOptions,
  BlarioConfig,
  User,
  FormData,
  DiagnosticResponse,
  UseBlarioReturn,
  UseBlarioUploadReturn,
} from '@blario/vue';
```

## Styling

### Using the Tailwind Preset

The package includes a Tailwind preset with all necessary theme variables:

```javascript
// tailwind.config.js
module.exports = {
  presets: [require('@blario/vue/tailwind-preset')],
  // ...
};
```

### Custom Styling

Override theme variables in your CSS:

```css
:root {
  --blario-primary: 220 90% 56%;
  --blario-background: 0 0% 100%;
  --blario-foreground: 222.2 47.4% 11.2%;
  /* ... other variables */
}

.dark {
  --blario-background: 222.2 84% 4.9%;
  --blario-foreground: 210 40% 98%;
  /* ... other variables */
}
```

## Best Practices

1. **Initialize Early**: Install the plugin as early as possible in your app lifecycle
2. **User Context**: Provide user information for better issue tracking
3. **Error Boundaries**: Use with Vue error handling for automatic error capture
4. **Rate Limiting**: Configure appropriate rate limits for your use case
5. **Redaction**: Configure sensitive data redaction patterns

## Examples

### Complete App Setup

```typescript
// main.ts
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { BlarioPlugin } from '@blario/vue';
import '@blario/vue/styles.css';
import App from './App.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [/* your routes */],
});

const app = createApp(App);

app.use(router);

app.use(BlarioPlugin, {
  publishableKey: import.meta.env.VITE_BLARIO_KEY,
  user: {
    id: 'user-123',
    email: 'user@example.com',
  },
  locale: 'en',
  theme: {
    mode: 'light',
    position: 'bottom-right',
  },
  capture: {
    console: true,
    networkSample: true,
  },
  onAfterSubmit: (issueId) => {
    console.log('Issue submitted:', issueId);
    // Track analytics, show toast, etc.
  },
  onError: (error) => {
    console.error('Blario error:', error);
  },
});

app.mount('#app');
```

### Error Boundary Integration

```vue
<script setup lang="ts">
import { onErrorCaptured } from 'vue';
import { useBlario } from '@blario/vue';

const { openReporter } = useBlario();

onErrorCaptured((error, instance, info) => {
  // Automatically open reporter on errors
  openReporter({
    prefill: {
      summary: error.message,
      actual: error.stack,
      severity: 'high',
    },
  });

  return false; // prevent error propagation
});
</script>
```

## License

MIT © Blario

## Support

- GitHub Issues: https://github.com/blarApp/blar-ticket-support-package/issues
- Documentation: https://docs.blar.io
- Email: support@blar.io
