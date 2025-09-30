# Blar Support JS

Official JavaScript/TypeScript SDKs for Blar - AI-powered issue diagnostics for modern applications.

[![CI](https://github.com/blario/support-js/actions/workflows/ci.yml/badge.svg)](https://github.com/blario/support-js/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@blario/nextjs/alpha.svg)](https://www.npmjs.com/package/@blario/nextjs)
[![npm downloads](https://img.shields.io/npm/dm/@blario/nextjs.svg)](https://www.npmjs.com/package/@blario/nextjs)

## 📢 Current Status

**@blario/nextjs** is now available on npm! 🎉

- **Version**: 0.1.0-alpha.1
- **Status**: Alpha (expect breaking changes)
- **Install**: `npm install @blario/nextjs@alpha`
- **NPM**: https://www.npmjs.com/package/@blario/nextjs

## 📦 Packages

| Package | Version | Status | Description |
|---------|---------|--------|-------------|
| [`@blario/nextjs`](./packages/nextjs) | [![npm](https://img.shields.io/npm/v/@blario/nextjs/alpha.svg)](https://www.npmjs.com/package/@blario/nextjs) | **Alpha** | Next.js SDK with React components |
| `@blario/react` | - | Planning | Framework-agnostic React SDK |
| `@blario/node` | - | Planning | Node.js server SDK |
| `@blario/browser` | - | Planning | Vanilla JavaScript browser SDK |

## 🚀 Quick Start

### Installation

```bash
# Install the alpha version
npm install @blario/nextjs@alpha

# Or with yarn
yarn add @blario/nextjs@alpha

# Or with pnpm
pnpm add @blario/nextjs@alpha
```

### Setup (Next.js App Router)

#### 1. Set up environment variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_BLARIO_PROJECT_ID=your-project-id-here
```

#### 2. Create a Client Component wrapper for providers

Since the BlarioProvider uses React Context, it must be wrapped in a Client Component:

```tsx
// app/providers.tsx
'use client';

import { BlarioProvider } from '@blario/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BlarioProvider projectId={process.env.NEXT_PUBLIC_BLARIO_PROJECT_ID!}>
      {children}
    </BlarioProvider>
  );
}
```

#### 3. Add the provider to your root layout

```tsx
// app/layout.tsx
import { Providers } from './providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Your app description',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### 4. Add the components to your pages

```tsx
// app/page.tsx
import { IssueReporterButton, DiagnosticBanner } from '@blario/nextjs';

export default function Page() {
  return (
    <main>
      <DiagnosticBanner />
      <h1>Welcome to your app</h1>
      {/* Your app content */}
      <IssueReporterButton />
    </main>
  );
}
```

#### 5. Import styles (if using Tailwind CSS)

```css
/* app/globals.css */
@import '@blario/nextjs/styles';
/* Your other styles */
```

## 🎯 Features

- 🤖 **AI-Powered Diagnostics** - Instant analysis and suggested fixes
- 🎨 **Drop-in Components** - Pre-built UI with shadcn/ui
- 📊 **Auto Context Capture** - Browser, console, network data
- 🛡️ **Privacy-First** - Built-in PII redaction
- ⚡ **Lightweight** - < 25KB gzipped
- 🌍 **i18n Ready** - Internationalization support
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 🎯 **TypeScript** - Full type safety

## 🏗️ Architecture

This monorepo uses:
- **pnpm workspaces** for package management
- **Changesets** for versioning and publishing
- **Vitest** for testing
- **TypeScript** for type safety
- **ESLint & Prettier** for code quality
- **GitHub Actions** for CI/CD

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint

# Format code
pnpm format
```

### Package Development

```bash
# Navigate to specific package
cd packages/nextjs

# Development mode with watch
pnpm dev

# Run package tests
pnpm test

# Build package
pnpm build
```

### Testing Locally

Use `pnpm link` to test packages in your application:

```bash
# In the package directory
cd packages/nextjs
pnpm link

# In your application
pnpm link @blario/nextjs
```

## 🐛 Troubleshooting

### Common Issues

#### "createContext is not a function" Error

**Problem**: You're getting `TypeError: createContext is not a function` when using BlarioProvider.

**Solution**: The BlarioProvider must be used in a Client Component. Make sure to:
1. Create a separate `providers.tsx` file with `'use client'` directive
2. Wrap the BlarioProvider in that file
3. Import the wrapper in your layout (see setup instructions above)

#### Environment Variables Not Working

**Problem**: Getting `undefined` for project ID.

**Solution**:
1. Ensure your env variable starts with `NEXT_PUBLIC_` prefix
2. Restart your Next.js dev server after adding env variables
3. Check that `.env.local` is in your project root

#### Styles Not Loading

**Problem**: Components appear unstyled.

**Solution**: Import the styles in your global CSS:
```css
@import '@blario/nextjs/styles';
```

#### TypeScript Errors

**Problem**: Getting type errors when importing components.

**Solution**: Ensure your `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  }
}
```

## 📝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Creating a Changeset

When making changes:

```bash
# Create a changeset
pnpm changeset

# Select the packages and type of change
# Write a summary of your changes
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `test:` Test updates
- `refactor:` Code refactoring

## 🔒 Security

- All data transmission uses HTTPS
- Automatic PII redaction
- No tracking cookies
- SOC 2 Type II compliant infrastructure

For security issues, please email security@blar.io instead of using GitHub issues.

## 📚 Documentation

- [Full Documentation](https://docs.blar.io)
- [API Reference](https://docs.blar.io/api)
- [Integration Guides](https://docs.blar.io/guides)

## 🏢 Enterprise

For enterprise features including:
- SSO/SAML authentication
- Advanced analytics
- SLA support
- Custom deployment options

Contact sales@blar.io

## 💬 Community & Support

- [Discord](https://discord.gg/blario)
- [GitHub Discussions](https://github.com/blario/support-js/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/blario)

## 📄 License

MIT © [Blar Inc.](https://blar.io)

See [LICENSE](LICENSE) for more information.

## 🙏 Acknowledgments

Built with:
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<p align="center">
  Made with ❤️ by the Blar team
</p>
