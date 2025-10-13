# @blario/nextjs

Drop-in issue reporter for Next.js applications with AI-powered diagnostics.

[![npm version](https://img.shields.io/npm/v/@blario/nextjs.svg)](https://www.npmjs.com/package/@blario/nextjs)
[![npm downloads](https://img.shields.io/npm/dm/@blario/nextjs.svg)](https://www.npmjs.com/package/@blario/nextjs)
[![license](https://img.shields.io/npm/l/@blario/nextjs.svg)](https://github.com/blario/support-js/blob/main/LICENSE)

## 📚 Documentation

- **[Styling Guide](./docs/styling.md)** - Complete customization and theming options
- **[API Reference](./docs/api-reference.md)** - Detailed component and hook documentation
- **[Examples](./docs/examples.md)** - Real-world integration patterns and use cases

## Features

✨ **Drop-in Components** - Pre-built UI components with shadcn/ui
🎯 **AI Diagnostics** - Instant AI-powered issue analysis
📊 **Auto Context Capture** - Automatically collects browser, route, and console data
🛡️ **Privacy-First** - Built-in PII redaction and consent controls
📱 **Responsive Design** - Works on all screen sizes
🎨 **Fully Customizable** - Complete control over styling and behavior
♿ **Accessible** - WCAG 2.1 AA compliant
🚀 **Performant** - < 25KB gzipped, tree-shakeable

## Installation

```bash
npm install @blario/nextjs@alpha
# or
yarn add @blario/nextjs@alpha
# or
pnpm add @blario/nextjs@alpha
```

## Quick Start (2 minutes)

### 1. Import the Blario styles

```css
/* app/globals.css */
@import '@blario/nextjs/styles.css';
```

Or import directly in your layout:

```tsx
// app/layout.tsx
import '@blario/nextjs/styles.css';
```

### 2. Wrap your app with the provider

```tsx
// app/layout.tsx
import { BlarioProvider } from '@blario/nextjs';
import '@blario/nextjs/styles.css'; // Import styles here if not in globals.css

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BlarioProvider
          publishableKey={process.env.NEXT_PUBLIC_BLARIO_PUBLISHABLE_KEY!}
        >
          {children}
        </BlarioProvider>
      </body>
    </html>
  );
}
```

### 3. Add the reporter button

```tsx
// app/page.tsx
import { IssueReporterButton, DiagnosticBanner } from '@blario/nextjs';

export default function Page() {
  return (
    <>
      <DiagnosticBanner />
      <IssueReporterButton />
      {/* Your app content */}
    </>
  );
}
```

That's it! The issue reporter is now available in your app. No Tailwind configuration needed!

## Core Components

### BlarioProvider

The main provider that wraps your application.

```tsx
<BlarioProvider
  publishableKey="your-publishable-key"
  apiBaseUrl="https://api.blar.io" // optional, defaults to production
  user={{
    id: user.id,
    email: user.email,
    name: user.name,
  }}
  capture={{
    console: true,      // capture console logs
    networkSample: false, // capture network requests
    maxConsoleLogs: 50,
    maxNetworkLogs: 20,
  }}
  theme={{
    position: 'bottom-right',
    accent: '#6366f1',
  }}
  onAfterSubmit={(issueId) => {
    console.log('Issue submitted:', issueId);
  }}
>
  {children}
</BlarioProvider>
```

### IssueReporterButton

Floating or inline button to open the issue reporter.

```tsx
// Floating button (default)
<IssueReporterButton />

// Inline button
<IssueReporterButton variant="inline">
  Report a Problem
</IssueReporterButton>

// With category and prefill
<IssueReporterButton
  category="billing"
  prefill={{
    summary: 'Billing issue with subscription',
    severity: 'high',
  }}
/>

// Custom position
<IssueReporterButton position="top-left" />
```

### IssueReporterModal

The issue reporter modal (automatically managed by the button).

```tsx
<IssueReporterModal
  onSuccess={(issueId) => {
    toast.success('Issue reported successfully!');
  }}
/>
```

### DiagnosticBanner

Displays AI diagnostics after issue submission.

```tsx
<DiagnosticBanner
  position="top"           // or "bottom"
  autoHide={true}          // auto-hide after delay
  autoHideDelay={10000}    // milliseconds
  onDismiss={() => {
    console.log('Banner dismissed');
  }}
/>
```

## Hooks

### useBlario

Access the Blario context and methods programmatically.

```tsx
import { useBlario } from '@blario/nextjs';

function MyComponent() {
  const {
    openReporter,
    reportIssue,
    lastDiagnostic,
    isSubmitting
  } = useBlario();

  const handleError = async (error: Error) => {
    const result = await reportIssue({
      summary: error.message,
      steps: 'Error occurred during normal usage',
      severity: 'high',
      category: 'error',
    });

    if (result?.status === 'ready') {
      console.log('Diagnostic:', result.diagnostic);
    }
  };

  return (
    <button onClick={() => openReporter({ category: 'feedback' })}>
      Give Feedback
    </button>
  );
}
```

## Error Boundary

Automatically capture and report React errors.

```tsx
import { withBlarioErrorBoundary } from '@blario/nextjs';

// HOC approach
export default withBlarioErrorBoundary(MyComponent, {
  showReportButton: true,
  onError: (error, errorInfo) => {
    console.error('Component error:', error);
  },
});

// Component approach
import { BlarioErrorBoundary } from '@blario/nextjs';

<BlarioErrorBoundary
  fallback={CustomErrorFallback}
  showReportButton={true}
>
  <MyComponent />
</BlarioErrorBoundary>
```

## Programmatic Usage

Report issues without UI components.

```tsx
import { useBlario } from '@blario/nextjs';

function useErrorHandler() {
  const { reportIssue } = useBlario();

  return async (error: Error) => {
    try {
      const result = await reportIssue({
        summary: `Error: ${error.message}`,
        steps: error.stack,
        severity: 'high',
        category: 'runtime-error',
      });

      if (result?.diagnostic) {
        // Show diagnostic to user
        notify(result.diagnostic.headline);
      }
    } catch (err) {
      console.error('Failed to report error:', err);
    }
  };
}
```

## Styling & Customization

### Complete Control with Unstyled Mode

Remove all default styles for complete control:

```tsx
<IssueReporterButton
  variant="inline"
  unstyled
  className="your-custom-classes"
  icon={<YourIcon />}
>
  Custom Button
</IssueReporterButton>
```

### Seamless Integration Examples

#### Dark Sidebar
```tsx
<IssueReporterButton
  variant="inline"
  unstyled
  className="flex w-full items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 rounded"
  icon={<Bug className="w-5 h-5" />}
>
  Report Issue
</IssueReporterButton>
```

#### Inline Text Link
```tsx
<p>
  Need help?
  <IssueReporterButton
    variant="inline"
    unstyled
    hideIcon
    className="text-blue-600 hover:text-blue-800 underline mx-1"
  >
    Contact support
  </IssueReporterButton>
</p>
```

### Button Variants

Use pre-styled button variants when not in unstyled mode:

```tsx
<IssueReporterButton buttonVariant="ghost" />    // Minimal style
<IssueReporterButton buttonVariant="outline" />  // Border only
<IssueReporterButton buttonVariant="default" />  // Primary style
```

### Using CSS Variables

```css
:root {
  --blario-primary: #6366f1;
  --blario-bg: #ffffff;
  --blario-foreground: #000000;
}
```

### Using Theme Props

```tsx
<BlarioProvider
  theme={{
    position: 'bottom-left',
    accent: '#10b981',
    className: 'custom-reporter',
  }}
>
```

### Position Options

- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

## Advanced Configuration

### Custom Redaction Patterns

```tsx
<BlarioProvider
  redaction={{
    patterns: [
      /api[_-]?key/gi,
      /password/gi,
      /secret/gi,
    ],
    customRedactor: (text) => {
      // Custom redaction logic
      return text.replace(/\b\d{4}\b/g, '[REDACTED]');
    },
  }}
>
```

### Rate Limiting

```tsx
<BlarioProvider
  rateLimit={{
    maxRequests: 10,
    windowMs: 60000, // 1 minute
  }}
>
```

### Custom API Endpoint

```tsx
<BlarioProvider
  apiBaseUrl="https://your-api.example.com"
>
```

## TypeScript Support

All components and hooks are fully typed. Import types as needed:

```tsx
import type {
  BlarioConfig,
  DiagnosticResponse,
  FormData,
  User,
} from '@blario/nextjs';
```

## Next.js App Router

The package is optimized for Next.js 13+ App Router with:

- `'use client'` directives
- SSR-safe implementation
- Automatic route tracking
- Edge runtime compatibility

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

### Basic Setup

```tsx
// app/layout.tsx
import { BlarioProvider } from '@blario/nextjs';
import '@blario/nextjs/styles.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BlarioProvider
          publishableKey="pk_live_xxx"
        >
          {children}
        </BlarioProvider>
      </body>
    </html>
  );
}

// app/page.tsx
import { IssueReporterButton, DiagnosticBanner } from '@blario/nextjs';

export default function Home() {
  return (
    <main>
      <DiagnosticBanner />
      <IssueReporterButton />
      <h1>Welcome to our app</h1>
    </main>
  );
}
```

### With Authentication

```tsx
import { BlarioProvider } from '@blario/nextjs';
import { useUser } from '@clerk/nextjs';

export function Providers({ children }) {
  const { user } = useUser();

  return (
    <BlarioProvider
      publishableKey="pk_live_xxx"
      user={{
        id: user?.id,
        email: user?.emailAddresses?.[0]?.emailAddress,
        name: user?.fullName,
      }}
    >
      {children}
    </BlarioProvider>
  );
}
```

### Custom Error Page

```tsx
// app/error.tsx
'use client';

import { useBlario } from '@blario/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { reportIssue } = useBlario();

  useEffect(() => {
    reportIssue({
      summary: error.message,
      category: 'error-page',
      severity: 'high',
    });
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## API Reference

Full API documentation available at [docs.blar.io/nextjs](https://docs.blar.io/nextjs)

## Contributing

See [CONTRIBUTING.md](https://github.com/blario/support-js/blob/main/CONTRIBUTING.md)

## License

MIT © [Blario](https://blar.io)