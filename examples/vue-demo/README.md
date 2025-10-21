# Blario Vue Demo

This is a comprehensive demo application showcasing the `@blario/vue` package features and components.

## Features

This demo includes examples of:

- **Issue Reporter Modal** - Test different modal configurations and pre-filled data
- **useBlario Composable** - Programmatic issue reporting and state management
- **Error Boundary** - Automatic error capture and reporting
- **Button Styles** - Various button variants and custom styling
- **Live Dashboard Demo** - Interactive e-commerce dashboard with guided tours
- **Chat Widget** - Interactive chat support widget
- **Diagnostic Banner** - Display system diagnostics and status

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Create a `.env.local` file with your Blario publishable key:

```env
VITE_BLARIO_PUBLISHABLE_KEY=your_publishable_key_here
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── views/          # Page components
│   ├── HomePage.vue
│   ├── TestModal.vue
│   ├── TestHook.vue
│   ├── TestError.vue
│   ├── TestStyles.vue
│   ├── DemoDashboard.vue
│   └── DemoDashboardIntegrations.vue
├── App.vue         # Root component with BlarioProvider
├── main.ts         # App entry point
├── router.ts       # Vue Router configuration
└── style.css       # Global styles
```

## Pages

### Home (`/`)

Landing page with links to all demo features.

### Test Modal (`/test-modal`)

Examples of the IssueReporterButton component with:
- Default floating button
- Inline button variants
- Pre-filled categories
- Custom form data

### Test Hook (`/test-hook`)

Demonstrates the `useBlario` composable:
- Opening the reporter programmatically
- Submitting issues without the modal
- Error reporting with custom data
- Accessing composable state

### Test Error (`/test-error`)

Error boundary integration examples:
- Synchronous error handling
- Async error handling
- Component-level errors

### Test Styles (`/test-styles`)

Button styling examples:
- Different variants (floating, inline)
- Custom colors and sizes
- Outline styles

### Demo Dashboard (`/demo-dashboard`)

Interactive e-commerce dashboard featuring:
- Revenue and order statistics
- Recent orders table
- Quick action buttons
- Guided tours (no data-tour-id required!)

### Dashboard Integrations (`/demo-dashboard/integrations`)

Integration management page with:
- Connected and available integrations
- Connection modal
- Integration categories

## Configuration

The demo is configured with the following Blario settings (see `src/App.vue`):

```typescript
{
  publishableKey: import.meta.env.VITE_BLARIO_PUBLISHABLE_KEY,
  apiBaseUrl: 'http://localhost:8000',
  locale: 'es',
  user: {
    id: 'demo-user-123',
    email: 'demo@example.com',
    name: 'Demo User'
  },
  capture: {
    console: true,
    networkSample: true,
    maxConsoleLogs: 100,
    maxNetworkLogs: 50,
  },
  theme: {
    mode: 'light' | 'dark' // Auto-detected from system preference
  }
}
```

## Learn More

- [@blario/vue Documentation](../../packages/vue/README.md)
- [Blario Platform](https://blario.app)
