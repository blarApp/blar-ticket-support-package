# @blario/vue

Drop-in issue reporter for Vue 3 applications with AI-powered diagnostics.

[![npm version](https://img.shields.io/npm/v/@blario/vue.svg)](https://www.npmjs.com/package/@blario/vue)
[![npm downloads](https://img.shields.io/npm/dm/@blario/vue.svg)](https://www.npmjs.com/package/@blario/vue)
[![license](https://img.shields.io/npm/l/@blario/vue.svg)](https://github.com/blario/support-js/blob/main/LICENSE)

## Features

✨ **Drop-in Components** - Pre-built UI components with radix-vue
🎯 **AI Diagnostics** - Instant AI-powered issue analysis
📊 **Auto Context Capture** - Automatically collects browser, route, and console data
🛡️ **Privacy-First** - Built-in PII redaction and consent controls
📱 **Responsive Design** - Works on all screen sizes
🎨 **Fully Customizable** - Complete control over styling and behavior
♿ **Accessible** - WCAG 2.1 AA compliant
🚀 **Performant** - < 25KB gzipped, tree-shakeable
⚡ **Vue 3 Ready** - Built with Composition API and `<script setup>`

## Installation

```bash
npm install @blario/vue@alpha
# or
yarn add @blario/vue@alpha
# or
pnpm add @blario/vue@alpha
```

### Peer Dependencies

```bash
npm install vue@^3.3.0 vue-router@^4.0.0 tailwindcss@^3.4.0 tailwindcss-animate@^1.0.7
```

## Quick Start (3 minutes)

### 1. Configure Tailwind CSS

Add the Blario preset to your `tailwind.config.js`:

```js
// tailwind.config.js
import blarioPreset from '@blario/vue/tailwind-preset';

export default {
  presets: [blarioPreset],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // IMPORTANT: Include Blario components in Tailwind scan
    './node_modules/@blario/vue/dist/**/*.{js,mjs,vue}',
  ],
  plugins: [],
};
```

### 2. Import Blario Styles

```ts
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import '@blario/vue/styles.css'; // Import Blario styles

const app = createApp(App);
app.mount('#app');
```

Or import in your main CSS file:

```css
/* src/style.css */
@import '@blario/vue/theme.css';
@import '@blario/vue/styles.css';
```

### 3. Wrap Your App with BlarioProvider

```vue
<!-- src/App.vue -->
<template>
  <BlarioProvider
    :publishable-key="publishableKey"
    locale="en"
    :user="user"
    :capture="captureConfig"
    @after-submit="handleAfterSubmit"
    @error="handleError"
  >
    <router-view />
  </BlarioProvider>
</template>

<script setup lang="ts">
import { BlarioProvider } from '@blario/vue';

const publishableKey = import.meta.env.VITE_BLARIO_PUBLISHABLE_KEY;

const user = {
  id: 'user-123',
  email: 'user@example.com',
  name: 'John Doe'
};

const captureConfig = {
  console: true,
  networkSample: false,
  maxConsoleLogs: 50,
  maxNetworkLogs: 20,
};

const handleAfterSubmit = (issueId: string) => {
  console.log('Issue submitted:', issueId);
};

const handleError = (error: Error) => {
  console.error('Blario error:', error);
};
</script>
```

### 4. Add the Reporter Button

```vue
<template>
  <div class="app">
    <!-- Optional: Show diagnostic banner -->
    <DiagnosticBanner />

    <!-- Your app content -->
    <main>
      <h1>Welcome to your app</h1>
    </main>

    <!-- Floating button (default) -->
    <IssueReporterButton />
  </div>
</template>

<script setup lang="ts">
import { IssueReporterButton, DiagnosticBanner } from '@blario/vue';
</script>
```

That's it! The issue reporter is now available in your Vue app.

## Core Components

### BlarioProvider

The main provider component that wraps your application and provides Blario context.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `publishableKey` | `string` | ✅ | - | Your Blario publishable key |
| `apiBaseUrl` | `string` | ❌ | `'https://api.blar.io'` | API base URL |
| `user` | `User` | ❌ | `undefined` | Current user information |
| `locale` | `'en' \| 'es'` | ❌ | `'en'` | UI language |
| `capture` | `CaptureConfig` | ❌ | `{}` | Data capture configuration |
| `theme` | `ThemeConfig` | ❌ | `{}` | Theme configuration |
| `redaction` | `RedactionConfig` | ❌ | `{}` | PII redaction settings |
| `rateLimit` | `RateLimitConfig` | ❌ | `{}` | Rate limiting settings |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `@after-submit` | `issueId: string` | Emitted after successful issue submission |
| `@error` | `error: Error` | Emitted when an error occurs |

**Example:**

```vue
<template>
  <BlarioProvider
    publishable-key="pk_live_xxx"
    api-base-url="https://api.blar.io"
    locale="es"
    :user="currentUser"
    :capture="{ console: true, networkSample: true }"
    :theme="{ mode: 'dark', position: 'bottom-left' }"
    @after-submit="onIssueSubmitted"
    @error="onError"
  >
    <router-view />
  </BlarioProvider>
</template>

<script setup lang="ts">
import { BlarioProvider } from '@blario/vue';
import { computed } from 'vue';
import { useAuth } from './composables/useAuth';

const { user } = useAuth();

const currentUser = computed(() => ({
  id: user.value?.id,
  email: user.value?.email,
  name: user.value?.name,
}));

const onIssueSubmitted = (issueId: string) => {
  console.log('Issue submitted successfully:', issueId);
};

const onError = (error: Error) => {
  console.error('Failed to submit issue:', error);
};
</script>
```

### IssueReporterButton

Button component to trigger the issue reporter modal.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'floating' \| 'inline'` | ❌ | `'floating'` | Button variant |
| `category` | `string` | ❌ | `undefined` | Pre-fill category |
| `prefill` | `PrefillData` | ❌ | `undefined` | Pre-fill form data |
| `position` | `Position` | ❌ | `'bottom-right'` | Position for floating button |
| `class` | `string` | ❌ | `undefined` | Custom CSS classes |

**Examples:**

```vue
<template>
  <!-- Floating button (default) -->
  <IssueReporterButton />

  <!-- Inline button -->
  <IssueReporterButton variant="inline">
    Report an Issue
  </IssueReporterButton>

  <!-- With category and prefill -->
  <IssueReporterButton
    variant="inline"
    category="billing"
    :prefill="{
      summary: 'Billing issue',
      severity: 'high',
    }"
    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
  >
    Report Billing Issue
  </IssueReporterButton>

  <!-- Custom position -->
  <IssueReporterButton position="top-left" />
</template>

<script setup lang="ts">
import { IssueReporterButton } from '@blario/vue';
</script>
```

### DiagnosticBanner

Banner component to display issue submission status and diagnostics.

```vue
<template>
  <DiagnosticBanner />
</template>

<script setup lang="ts">
import { DiagnosticBanner } from '@blario/vue';
</script>
```

The banner automatically shows when an issue is submitted and can be dismissed by the user.

### TourProvider & ChatWidget

Placeholder components for future tour and chat functionality:

```vue
<template>
  <BlarioProvider>
    <TourProvider>
      <ChatWidget />
      <router-view />
    </TourProvider>
  </BlarioProvider>
</template>

<script setup lang="ts">
import { BlarioProvider, TourProvider, ChatWidget } from '@blario/vue';
</script>
```

## Composables

### useBlario

Access Blario context and methods programmatically.

**Returns:**

```ts
interface UseBlarioReturn {
  openReporter: (options?: {
    category?: string;
    prefill?: Record<string, any>;
  }) => void;
  reportIssue: (data: FormData) => Promise<DiagnosticResponse | null>;
  lastDiagnostic: Ref<DiagnosticResponse | null>;
  isSubmitting: Ref<boolean>;
  clearDiagnostic: () => void;
}
```

**Example:**

```vue
<template>
  <div>
    <button @click="handleFeedback">Give Feedback</button>
    <button @click="handleError" :disabled="isSubmitting">
      {{ isSubmitting ? 'Reporting...' : 'Report Error' }}
    </button>

    <div v-if="lastDiagnostic">
      <p>Last issue: {{ lastDiagnostic.issueId }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBlario } from '@blario/vue';

const {
  openReporter,
  reportIssue,
  lastDiagnostic,
  isSubmitting,
  clearDiagnostic
} = useBlario();

const handleFeedback = () => {
  openReporter({
    category: 'feedback',
    prefill: {
      summary: 'General feedback',
    }
  });
};

const handleError = async () => {
  try {
    const result = await reportIssue({
      summary: 'Something went wrong',
      steps: 'Error occurred while processing data',
      severity: 'high',
      category: 'error',
    });

    if (result) {
      console.log('Issue reported:', result.issueId);
    }
  } catch (error) {
    console.error('Failed to report:', error);
  }
};
</script>
```

### useBlarioUpload

Handle file uploads for issue attachments.

**Returns:**

```ts
interface UseBlarioUploadReturn {
  submitIssueWithUploads: (
    formData: FormData,
    files: File[]
  ) => Promise<DiagnosticResponse | null>;
  isUploading: Ref<boolean>;
  uploadError: Ref<string | null>;
  uploadProgress: Ref<UploadProgress[]>;
  clearUploadError: () => void;
}
```

**Example:**

```vue
<template>
  <div>
    <input
      type="file"
      multiple
      accept="image/*,video/*"
      @change="handleFileSelect"
    />

    <button
      @click="submitWithFiles"
      :disabled="isUploading"
    >
      {{ isUploading ? 'Uploading...' : 'Submit' }}
    </button>

    <div v-if="uploadError" class="text-red-600">
      {{ uploadError }}
    </div>

    <div v-if="isUploading">
      <div v-for="progress in uploadProgress" :key="progress.fileId">
        {{ progress.fileName }}: {{ progress.progress }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBlarioUpload } from '@blario/vue';

const { submitIssueWithUploads, isUploading, uploadError, uploadProgress } = useBlarioUpload();
const selectedFiles = ref<File[]>([]);

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFiles.value = Array.from(target.files || []);
};

const submitWithFiles = async () => {
  try {
    const result = await submitIssueWithUploads(
      {
        summary: 'Issue with screenshots',
        severity: 'medium',
      },
      selectedFiles.value
    );

    if (result) {
      console.log('Issue submitted with files:', result.issueId);
      selectedFiles.value = [];
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
</script>
```

## Programmatic Usage

Report issues without UI components using the `useBlario` composable:

```vue
<script setup lang="ts">
import { useBlario } from '@blario/vue';
import { onErrorCaptured } from 'vue';

const { reportIssue } = useBlario();

// Capture Vue errors
onErrorCaptured((error, instance, info) => {
  reportIssue({
    summary: `Vue Error: ${error.message}`,
    steps: `Component: ${instance?.$options.name}\nInfo: ${info}`,
    severity: 'high',
    category: 'vue-error',
    actual: error.stack,
  });

  return false; // Don't propagate error
});

// Custom error handler
const handleApiError = async (error: Error) => {
  await reportIssue({
    summary: `API Error: ${error.message}`,
    category: 'api',
    severity: 'medium',
  });
};
</script>
```

## Vue Router Integration

Blario automatically integrates with Vue Router when available:

```ts
// src/main.ts
import { createApp } from 'vue';
import { createRouter } from 'vue-router';
import App from './App.vue';

const router = createRouter({
  // ... router config
});

const app = createApp(App);
app.use(router); // Blario will automatically track routes
app.mount('#app');
```

Route changes are automatically captured in issue context.

## Styling & Customization

### Using Tailwind Preset

The Blario preset includes all necessary styles and theme variables:

```js
// tailwind.config.js
import blarioPreset from '@blario/vue/tailwind-preset';

export default {
  presets: [blarioPreset],
  content: [
    './src/**/*.{vue,js,ts}',
    './node_modules/@blario/vue/dist/**/*.{js,mjs,vue}',
  ],
};
```

### Custom Button Styles

```vue
<template>
  <!-- Custom inline button -->
  <IssueReporterButton
    variant="inline"
    class="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all hover:scale-105"
  >
    Report Issue
  </IssueReporterButton>

  <!-- Link style -->
  <IssueReporterButton
    variant="inline"
    class="text-blue-600 hover:text-blue-800 underline font-medium"
  >
    Contact Support
  </IssueReporterButton>

  <!-- Minimal style -->
  <IssueReporterButton
    variant="inline"
    class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
  >
    Report a Problem
  </IssueReporterButton>
</template>
```

### Theme Configuration

```vue
<template>
  <BlarioProvider
    :theme="{
      mode: isDark ? 'dark' : 'light',
      position: 'bottom-left',
      accent: '#10b981',
      className: 'my-custom-reporter',
    }"
  >
    <App />
  </BlarioProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BlarioProvider } from '@blario/vue';

const isDark = ref(false);
</script>
```

### CSS Variables

Customize using CSS variables in your main CSS file:

```css
:root {
  --blario-primary: #6366f1;
  --blario-primary-foreground: #ffffff;
  --blario-background: #ffffff;
  --blario-foreground: #0f172a;
  --blario-border: #e2e8f0;
  --blario-input: #f1f5f9;
  --blario-ring: #6366f1;
}

.dark {
  --blario-background: #0f172a;
  --blario-foreground: #f1f5f9;
  --blario-border: #334155;
  --blario-input: #1e293b;
}
```

## Advanced Configuration

### Custom PII Redaction

```vue
<template>
  <BlarioProvider
    :redaction="{
      patterns: [
        /api[_-]?key/gi,
        /password/gi,
        /secret/gi,
        /\b\d{16}\b/g, // Credit card numbers
      ],
      customRedactor: (text) => {
        return text.replace(/user_\d+/g, '[USER_ID]');
      },
    }"
  >
    <App />
  </BlarioProvider>
</template>
```

### Rate Limiting

```vue
<template>
  <BlarioProvider
    :rate-limit="{
      maxRequests: 5,
      windowMs: 300000, // 5 minutes
    }"
  >
    <App />
  </BlarioProvider>
</template>
```

### Custom API Endpoint

```vue
<template>
  <BlarioProvider
    api-base-url="https://your-api.example.com"
    :publishable-key="apiKey"
  >
    <App />
  </BlarioProvider>
</template>
```

## TypeScript Support

All components and composables are fully typed. Import types as needed:

```ts
import type {
  BlarioConfig,
  DiagnosticResponse,
  FormData,
  User,
  BlarioProviderProps,
  UseBlarioReturn,
  UseBlarioUploadReturn,
} from '@blario/vue';

// Type-safe usage
const config: BlarioConfig = {
  publishableKey: 'pk_xxx',
  user: {
    id: 'user-123',
    email: 'user@example.com',
  },
};
```

## Vite Configuration

For optimal performance with Vite:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['@blario/vue'],
  },
});
```

## Environment Variables

Create a `.env.local` file:

```env
VITE_BLARIO_PUBLISHABLE_KEY=pk_live_your_key_here
```

Access in your app:

```ts
const publishableKey = import.meta.env.VITE_BLARIO_PUBLISHABLE_KEY;
```

## Privacy & Security

- **Publishable Key**: Safe to expose in client-side code
- **Domain Validation**: Requests validated server-side
- **Consent Controls**: Users control what data is shared
- **PII Redaction**: Automatic redaction of sensitive data
- **Local Storage**: Diagnostics cached locally only
- **Secure Transport**: HTTPS-only API communication
- **No Tracking**: No analytics or tracking cookies
- **Rate Limiting**: Built-in protection against abuse

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Bundle Size

- **Core**: ~15KB gzipped
- **With UI**: ~25KB gzipped
- **Tree-shakeable**: Import only what you need

## Examples

Check out the [examples directory](../../examples/vue-demo) for a complete working demo with:

- Basic setup
- Authentication integration
- Error handling
- Custom styling
- Programmatic usage
- File uploads
- Dashboard integration

Run the demo:

```bash
cd examples/vue-demo
npm install
npm run dev
```

## Troubleshooting

### Styles not applying

Make sure you've:
1. Added the Tailwind preset to `tailwind.config.js`
2. Included Blario dist files in Tailwind content array
3. Imported `@blario/vue/styles.css` in your main file

### TypeScript errors with import.meta.env

Add Vite types to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

Create `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BLARIO_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Provider not found error

Make sure `BlarioProvider` wraps your entire app and is at the root level of your component tree.

### Modal not opening

Verify that:
1. `BlarioProvider` is properly set up
2. You've imported the styles
3. The button has access to the Blario context (is inside `BlarioProvider`)

## Migration from Plugin to Provider

If you were using the `BlarioPlugin` approach, migrate to `BlarioProvider`:

**Before:**
```ts
// main.ts
import { BlarioPlugin } from '@blario/vue';
app.use(BlarioPlugin, { publishableKey: 'pk_xxx' });
```

**After:**
```vue
<!-- App.vue -->
<template>
  <BlarioProvider publishable-key="pk_xxx">
    <router-view />
  </BlarioProvider>
</template>
```

## Contributing

See [CONTRIBUTING.md](https://github.com/blario/support-js/blob/main/CONTRIBUTING.md)

## License

MIT © [Blario](https://blar.io)

## Support

- 📧 Email: support@blar.io
- 💬 Discord: [discord.gg/blario](https://discord.gg/blario)
- 📚 Documentation: [docs.blar.io](https://docs.blar.io)
- 🐛 Issues: [GitHub Issues](https://github.com/blario/support-js/issues)
