# Examples

## Quick Start Examples

### Basic Setup

The simplest way to add Blario to your Next.js app:

```tsx
// app/layout.tsx
import { BlarioProvider } from '@blario/nextjs';
import '@blario/nextjs/styles.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BlarioProvider projectId={process.env.NEXT_PUBLIC_BLARIO_PROJECT_ID}>
          {children}
        </BlarioProvider>
      </body>
    </html>
  );
}

// app/page.tsx
import { IssueReporterButton } from '@blario/nextjs';

export default function Page() {
  return (
    <div>
      <h1>My App</h1>
      <IssueReporterButton />
    </div>
  );
}
```

---

## Common Use Cases

### 1. Navigation Bar Integration

```tsx
// components/navbar.tsx
import { IssueReporterButton } from '@blario/nextjs';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-4">
        <Logo />
        <NavLinks />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <IssueReporterButton
          variant="inline"
          buttonVariant="ghost"
          buttonSize="sm"
        >
          Feedback
        </IssueReporterButton>

        <UserMenu />
      </div>
    </nav>
  );
}
```

### 2. Sidebar Menu Integration

```tsx
// components/sidebar.tsx
import { IssueReporterButton } from '@blario/nextjs';
import {
  Settings,
  Users,
  FileText,
  HelpCircle,
  LogOut
} from 'lucide-react';

export function Sidebar() {
  const menuItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: Users, label: 'Team', href: '/team' },
    { icon: FileText, label: 'Documents', href: '/docs' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 h-screen p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 hover:text-white transition"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        ))}

        <IssueReporterButton
          variant="inline"
          unstyled
          className="flex w-full items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 hover:text-white transition cursor-pointer"
          icon={<HelpCircle className="w-5 h-5" />}
        >
          Report Issue
        </IssueReporterButton>

        <a
          href="/logout"
          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 hover:text-white transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </a>
      </nav>
    </aside>
  );
}
```

### 3. Error Page Integration

```tsx
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { IssueReporterButton } from '@blario/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Something went wrong!</h1>
        <p className="text-gray-600">
          An unexpected error occurred. Our team has been notified.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Try Again
          </button>

          <IssueReporterButton
            variant="inline"
            buttonVariant="default"
            prefill={{
              title: 'Error: ' + error.message,
              description: error.stack,
              category: 'error'
            }}
          >
            Report This Issue
          </IssueReporterButton>
        </div>
      </div>
    </div>
  );
}
```

### 4. Feedback Widget

```tsx
// components/feedback-widget.tsx
import { useState } from 'react';
import { IssueReporterButton } from '@blario/nextjs';
import { MessageSquare, X } from 'lucide-react';

export function FeedbackWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">How can we help?</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <IssueReporterButton
          variant="inline"
          unstyled
          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
          category="bug"
        >
          🐛 Report a Bug
        </IssueReporterButton>

        <IssueReporterButton
          variant="inline"
          unstyled
          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
          category="feature"
        >
          💡 Request a Feature
        </IssueReporterButton>

        <IssueReporterButton
          variant="inline"
          unstyled
          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
          category="feedback"
        >
          💬 Send Feedback
        </IssueReporterButton>
      </div>
    </div>
  );
}
```

### 5. Programmatic Trigger

```tsx
// components/data-table.tsx
import { useBlario } from '@blario/nextjs';

export function DataTable({ data }) {
  const { openReporter } = useBlario();

  const handleRowError = (row, error) => {
    openReporter({
      category: 'data-error',
      prefill: {
        title: `Data Error in Row ${row.id}`,
        description: `Error: ${error.message}\n\nRow Data: ${JSON.stringify(row, null, 2)}`,
        metadata: {
          rowId: row.id,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      }
    });
  };

  return (
    <table>
      {/* Table implementation */}
    </table>
  );
}
```

### 6. Form Validation Error

```tsx
// components/contact-form.tsx
import { useState } from 'react';
import { useBlario } from '@blario/nextjs';

export function ContactForm() {
  const [errors, setErrors] = useState({});
  const { openReporter } = useBlario();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Form submission logic
    } catch (error) {
      if (error.code === 'VALIDATION_ERROR') {
        setErrors(error.fields);
      } else {
        // Unexpected error - allow user to report
        openReporter({
          category: 'form-error',
          prefill: {
            title: 'Form Submission Failed',
            description: `Error submitting contact form: ${error.message}`,
            metadata: {
              formData: new FormData(e.target),
              errorCode: error.code
            }
          }
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 7. User Authentication Flow

```tsx
// components/auth-guard.tsx
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BlarioProvider } from '@blario/nextjs';

export function AuthGuard({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    return <LoginPage />;
  }

  // Pass user info to Blario for better issue tracking
  return (
    <BlarioProvider
      projectId={process.env.NEXT_PUBLIC_BLARIO_PROJECT_ID}
      config={{
        user: {
          id: user.id,
          email: user.email,
          name: user.displayName,
          metadata: {
            plan: user.subscriptionPlan,
            role: user.role,
            company: user.company
          }
        }
      }}
    >
      {children}
    </BlarioProvider>
  );
}
```

### 8. Admin Dashboard Integration

```tsx
// app/admin/layout.tsx
import { IssueReporterButton } from '@blario/nextjs';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>

          <div className="flex items-center gap-2">
            <IssueReporterButton
              variant="inline"
              buttonVariant="outline"
              buttonSize="sm"
              category="admin-issue"
              prefill={{
                page: 'admin-dashboard',
                userRole: 'admin'
              }}
            >
              Report Admin Issue
            </IssueReporterButton>

            <NotificationBell />
            <UserProfile />
          </div>
        </div>
      </header>

      <main className="p-4">
        {children}
      </main>

      {/* Floating button as backup */}
      <IssueReporterButton
        position="bottom-left"
        className="md:hidden" // Only show on mobile
      />
    </div>
  );
}
```

### 9. E-commerce Cart Error

```tsx
// components/shopping-cart.tsx
import { useBlario } from '@blario/nextjs';

export function ShoppingCart({ items }) {
  const { openReporter } = useBlario();

  const handleCheckoutError = (error) => {
    openReporter({
      category: 'checkout-error',
      prefill: {
        title: 'Checkout Failed',
        description: error.message,
        metadata: {
          cartItems: items,
          totalAmount: calculateTotal(items),
          errorType: error.type,
          sessionId: getSessionId()
        }
      }
    });
  };

  return (
    <div>
      {/* Cart implementation */}
    </div>
  );
}
```

### 10. Custom Styled Examples

```tsx
// components/custom-buttons.tsx
import { IssueReporterButton } from '@blario/nextjs';

export function CustomButtons() {
  return (
    <div className="space-y-4">
      {/* Gradient button */}
      <IssueReporterButton
        variant="inline"
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition"
      >
        Beautiful Gradient
      </IssueReporterButton>

      {/* Neumorphic style */}
      <IssueReporterButton
        variant="inline"
        unstyled
        className="bg-gray-200 px-6 py-3 rounded-xl shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff]"
      >
        Neumorphic
      </IssueReporterButton>

      {/* Glassmorphic style */}
      <IssueReporterButton
        variant="inline"
        unstyled
        className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-lg border border-white/30"
      >
        Glassmorphic
      </IssueReporterButton>

      {/* Animated pulse */}
      <IssueReporterButton
        variant="inline"
        className="bg-red-500 text-white px-6 py-3 rounded animate-pulse"
      >
        Urgent Issue
      </IssueReporterButton>

      {/* With tooltip */}
      <div className="relative group inline-block">
        <IssueReporterButton
          variant="inline"
          buttonVariant="outline"
        >
          Hover for Info
        </IssueReporterButton>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
          Click to report an issue
        </span>
      </div>
    </div>
  );
}
```

---

## Advanced Patterns

### Custom Hook for Issue Reporting

```tsx
// hooks/useIssueReporter.ts
import { useBlario } from '@blario/nextjs';
import { useRouter } from 'next/navigation';

export function useIssueReporter() {
  const { openReporter } = useBlario();
  const router = useRouter();

  const reportPageIssue = () => {
    openReporter({
      prefill: {
        page: window.location.href,
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    });
  };

  const reportAndRedirect = async (issueData, redirectTo = '/') => {
    await openReporter(issueData);
    router.push(redirectTo);
  };

  return {
    reportPageIssue,
    reportAndRedirect
  };
}
```

### Context Menu Integration

```tsx
// components/context-menu.tsx
import { useState } from 'react';
import { useBlario } from '@blario/nextjs';

export function ContextMenuWrapper({ children }) {
  const [contextMenu, setContextMenu] = useState(null);
  const { openReporter } = useBlario();

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY });
  };

  const handleReportIssue = () => {
    openReporter({
      prefill: {
        element: e.target.tagName,
        position: { x: contextMenu.x, y: contextMenu.y }
      }
    });
    setContextMenu(null);
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {children}

      {contextMenu && (
        <div
          className="fixed bg-white shadow-lg rounded p-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={handleReportIssue}
            className="px-3 py-1 hover:bg-gray-100 w-full text-left"
          >
            Report Issue Here
          </button>
        </div>
      )}
    </div>
  );
}
```