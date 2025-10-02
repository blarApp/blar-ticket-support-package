# API Reference

## Components

### IssueReporterButton

The main button component for triggering the issue reporter modal.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'floating' \| 'inline'` | `'floating'` | Display mode of the button |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Position for floating variant |
| `unstyled` | `boolean` | `false` | Remove all default styles |
| `className` | `string` | - | Custom CSS classes |
| `buttonVariant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | - | Button style variant |
| `buttonSize` | `'default' \| 'sm' \| 'lg' \| 'icon'` | - | Button size |
| `children` | `React.ReactNode` | `'Report Issue'` | Button text content |
| `icon` | `React.ReactNode` | `<Bug />` | Custom icon component |
| `iconClassName` | `string` | - | CSS classes for icon |
| `textClassName` | `string` | - | CSS classes for text |
| `hideIcon` | `boolean` | `false` | Hide the icon |
| `hideText` | `boolean` | `false` | Hide the text |
| `category` | `string` | - | Pre-fill issue category |
| `prefill` | `Record<string, any>` | - | Pre-fill form data |
| `aria-label` | `string` | `'Report an issue'` | Accessibility label |

#### Examples

```tsx
// Basic usage
<IssueReporterButton />

// Inline button with custom text
<IssueReporterButton variant="inline">
  Send Feedback
</IssueReporterButton>

// Completely custom styled button
<IssueReporterButton
  variant="inline"
  unstyled
  className="custom-button-class"
  icon={<CustomIcon />}
>
  Report Bug
</IssueReporterButton>
```

---

### IssueReporterModal

The modal dialog for issue submission. Usually triggered by IssueReporterButton.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Control modal visibility |
| `onClose` | `() => void` | - | Callback when modal closes |
| `onSuccess` | `(issueId: string) => void` | - | Callback after successful submission |
| `category` | `string` | - | Pre-selected category |
| `prefill` | `Record<string, any>` | - | Pre-filled form data |

#### Examples

```tsx
import { IssueReporterModal, useBlario } from '@blario/nextjs';

function CustomImplementation() {
  const { isOpen, openReporter, closeReporter } = useBlario();

  return (
    <>
      <button onClick={openReporter}>Open Modal</button>

      <IssueReporterModal
        isOpen={isOpen}
        onClose={closeReporter}
        onSuccess={(issueId) => {
          console.log('Issue created:', issueId);
          closeReporter();
        }}
      />
    </>
  );
}
```

---

### DiagnosticBanner

Displays AI-powered diagnostics after issue submission.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top' \| 'bottom'` | `'top'` | Banner position |
| `autoHide` | `boolean` | `false` | Auto-hide after delay |
| `autoHideDelay` | `number` | `10000` | Delay in ms before auto-hide |
| `className` | `string` | - | Custom CSS classes |
| `onDismiss` | `() => void` | - | Callback when dismissed |

#### Examples

```tsx
<DiagnosticBanner
  position="top"
  autoHide
  autoHideDelay={5000}
/>
```

---

### BlarioProvider

The context provider that wraps your application.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `projectId` | `string` | Yes | Your Blario project ID |
| `config` | `BlarioConfig` | No | Configuration options |
| `children` | `React.ReactNode` | Yes | Your app components |

#### Config Options

```tsx
interface BlarioConfig {
  projectId: string;
  apiUrl?: string;
  captureConsole?: boolean;
  captureNetwork?: boolean;
  captureErrors?: boolean;
  captureScreenshot?: boolean;
  maxLogEntries?: number;
  theme?: {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    accent?: string;
  };
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
}
```

#### Examples

```tsx
<BlarioProvider
  projectId={process.env.NEXT_PUBLIC_BLARIO_PROJECT_ID}
  config={{
    captureScreenshot: true,
    maxLogEntries: 100,
    theme: {
      position: 'bottom-left',
      accent: '#6366f1'
    },
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }}
>
  <App />
</BlarioProvider>
```

---

### ErrorBoundary

Catches and reports React errors automatically.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fallback` | `React.ComponentType<{error: Error}>` | - | Fallback component |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | - | Error callback |
| `children` | `React.ReactNode` | - | Protected components |

#### Examples

```tsx
import { ErrorBoundary } from '@blario/nextjs';

function ErrorFallback({ error }) {
  return (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

<ErrorBoundary fallback={ErrorFallback}>
  <YourApp />
</ErrorBoundary>
```

---

## Hooks

### useBlario

Access Blario functionality programmatically.

#### Returns

```tsx
interface UseBlarioReturn {
  openReporter: (options?: {
    category?: string;
    prefill?: Record<string, any>;
  }) => void;
  closeReporter: () => void;
  isOpen: boolean;
  submitIssue: (data: IssueData) => Promise<string>;
  captureScreenshot: () => Promise<string>;
}
```

#### Examples

```tsx
import { useBlario } from '@blario/nextjs';

function MyComponent() {
  const { openReporter, isOpen } = useBlario();

  const handleError = (error) => {
    openReporter({
      category: 'error',
      prefill: {
        description: error.message,
        stackTrace: error.stack
      }
    });
  };

  return (
    <div>
      {/* Your component */}
    </div>
  );
}
```

---

### useBlarioContext

Access the full Blario context including configuration.

#### Returns

```tsx
interface BlarioContextValue {
  config: BlarioConfig;
  isModalOpen: boolean;
  openReporter: (options?: ReporterOptions) => void;
  closeReporter: () => void;
  lastDiagnostic: DiagnosticResponse | null;
  clearDiagnostic: () => void;
}
```

---

## Types

### IssueData

```tsx
interface IssueData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  attachments?: File[];
  metadata?: Record<string, any>;
}
```

### DiagnosticResponse

```tsx
interface DiagnosticResponse {
  id: string;
  status: 'pending' | 'ready' | 'error';
  result?: {
    summary: string;
    suggestions: string[];
    relatedIssues: Array<{
      id: string;
      title: string;
      similarity: number;
    }>;
  };
  error?: string;
}
```

### User

```tsx
interface User {
  id?: string;
  email?: string;
  name?: string;
  metadata?: Record<string, any>;
}
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BLARIO_PROJECT_ID` | Yes | Your Blario project ID |
| `NEXT_PUBLIC_BLARIO_API_URL` | No | Custom API endpoint |

---

## Events

The package emits several events you can listen to:

```tsx
// Listen for issue submission
window.addEventListener('blario:issue:submitted', (event) => {
  console.log('Issue submitted:', event.detail.issueId);
});

// Listen for diagnostic results
window.addEventListener('blario:diagnostic:ready', (event) => {
  console.log('Diagnostics:', event.detail);
});

// Listen for errors
window.addEventListener('blario:error', (event) => {
  console.error('Blario error:', event.detail);
});
```

---

## Error Handling

The package provides built-in error handling:

```tsx
try {
  await submitIssue(data);
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // Handle network errors
  } else if (error.code === 'VALIDATION_ERROR') {
    // Handle validation errors
  } else {
    // Handle other errors
  }
}
```

---

## TypeScript Support

The package is fully typed. Import types as needed:

```tsx
import type {
  IssueReporterButtonProps,
  BlarioConfig,
  IssueData,
  DiagnosticResponse
} from '@blario/nextjs';
```