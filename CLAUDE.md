# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blar Support JS is a monorepo of JavaScript/TypeScript SDKs for AI-powered issue diagnostics and support. The primary package is `@blario/nextjs`, a drop-in issue reporter for Next.js applications with AI-powered diagnostics, interactive chat support, and guided product tours.

## Repository Structure

This is a **pnpm workspace monorepo** with the following structure:

```
packages/
  nextjs/          - Next.js SDK with React components (main package)
examples/
  nextjs-demo/     - Demo Next.js application
```

The `@blario/nextjs` package architecture:
- `src/core/` - Core functionality (API client, data capture, storage, file upload, schemas)
- `src/provider/` - React context provider (BlarioProvider)
- `src/hooks/` - React hooks (useBlario, useBlarioUpload, use-mobile, use-toast)
- `src/ui/` - UI components (IssueReporterModal, IssueReporterButton, DiagnosticBanner, shadcn/ui components)
- `src/chat/` - Chat widget functionality
- `src/tour/` - Product tour system (TourProvider, TourOverlay, element finding/waiting)
- `src/errors/` - Error boundary components
- `src/lib/` - Utility functions (cn, variants)
- `src/styles/` - CSS styles

## Common Development Commands

### Root Level Commands
```bash
# Install dependencies (always use pnpm, not npm or yarn)
pnpm install

# Build all packages
pnpm build

# Build only packages (not examples)
pnpm build:packages

# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm typecheck

# Format code
pnpm format

# Check formatting
pnpm format:check

# Create a changeset (for versioning)
pnpm changeset

# Clean everything
pnpm clean
```

### Package-Specific Commands
```bash
# Navigate to the nextjs package
cd packages/nextjs

# Development mode with watch
pnpm dev

# Build the package
pnpm build

# Build only CSS
pnpm build:css

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Check bundle size
pnpm size

# Type checking
pnpm typecheck

# Lint
pnpm lint
```

### Running a Single Test
```bash
# In packages/nextjs directory
pnpm test <test-file-pattern>

# Example
pnpm test api.test.ts
```

## Key Architecture Patterns

### 1. Singleton Pattern for Core Services
The package uses singleton instances for core services to avoid multiple initializations:
- `getApiClient()` / `resetApiClient()` in `src/core/api.ts`
- `getCaptureManager()` / `resetCaptureManager()` in `src/core/capture.ts`
- `getStorageManager()` / `resetStorageManager()` in `src/core/storage.ts`

These singletons are created on first access and can be reset when the BlarioProvider unmounts.

### 2. File Upload Architecture
The package uses a **signed URL upload pattern** for attachments:
- Attachments are NOT sent as base64 in the JSON payload
- Files are uploaded separately using signed URLs from the backend
- The `useBlarioUpload` hook manages upload progress and retry logic
- Upload flow: request signed URL → upload file directly → attach to issue

See `src/core/upload.ts` for the upload manager implementation.

### 3. Context-Based State Management
The `BlarioProvider` uses React Context to provide:
- Configuration (API keys, user info, theme)
- Modal state management
- Issue submission flow
- Rate limiting
- Diagnostic history

The provider must be wrapped in a Client Component (`'use client'`) when used in Next.js App Router.

### 4. Capture System
The `CaptureManager` (in `src/core/capture.ts`) automatically collects:
- Console logs (configurable max: 50)
- Network requests (optional, configurable max: 20)
- Viewport information
- Browser metadata
- Route history

This data is attached to issue reports for AI diagnostics.

### 5. AI Triage System
The package includes AI-powered issue prefill:
- `generateIssuePrefill()` in `src/core/api.ts` sends chat history to triage endpoint
- Backend AI analyzes conversation and suggests issue category, severity, description
- Results are applied to the issue reporter form via `applyTriageResponse()` in BlarioProvider

### 6. Tour System
The tour feature enables guided product tours:
- `TourProvider` manages tour state and progression
- `withTour()` helper finds DOM elements by various selectors (CSS, text content, ARIA labels)
- `elementWaiter` utilities handle asynchronous element loading
- Tours can target dynamic content and wait for elements to appear

## TypeScript Configuration

The package uses strict TypeScript settings:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`

Path aliases are configured:
- `@/*` → `./src/*`
- `@/components/ui/*` → `./src/ui/components/*`
- `@/hooks/*` → `./src/hooks/*`

## Testing

Tests use **Vitest** with:
- `happy-dom` environment for DOM testing
- `@testing-library/react` for component testing
- Global test utilities via `src/__tests__/setup.ts`
- Coverage reporting with text, JSON, and HTML formats

## Styling

The package uses **Tailwind CSS** with:
- Custom preset in `tailwind-preset.js`
- shadcn/ui components (Radix UI primitives + Tailwind)
- Theme CSS in `src/styles/theme.css`
- Dark mode support via `dark` class on document root
- CSS utilities: `cn()` from `src/lib/cn.ts` for class merging

## Building and Bundling

Build process uses **tsup**:
- Outputs: CJS, ESM, and type declarations
- CSS is built separately via PostCSS
- Size limit: 25KB gzipped (enforced by size-limit)

## Versioning and Publishing

The monorepo uses **Changesets** for version management:
1. Create a changeset: `pnpm changeset`
2. Select affected packages and change type (major/minor/patch)
3. Changesets are committed with changes
4. On release: `pnpm changeset:version` updates package.json versions
5. Publish: `pnpm changeset:publish`

## Commit Convention

The project follows **Conventional Commits** (enforced by commitlint):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test changes
- `build:` - Build system changes
- `ci:` - CI/CD changes
- `chore:` - Maintenance tasks
- `revert:` - Revert previous changes

Commits are validated pre-commit via husky and lint-staged.

## Environment Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- For SDK usage: Next.js >= 13.4.0, React >= 18.2.0, Tailwind CSS >= 3.4.0

## Integration Notes for Consumers

When integrating `@blario/nextjs`:
1. **Tailwind content paths**: Must include `'./node_modules/@blario/nextjs/dist/**/*.{js,ts,jsx,tsx,mjs,cjs}'` in `tailwind.config.ts`
2. **Tailwind preset**: Import and use `preset` from `@blario/nextjs/tailwind-preset`
3. **Client Component wrapper**: BlarioProvider requires `'use client'` directive
4. **Environment variables**: Use `NEXT_PUBLIC_` prefix for publishable keys
5. **Dark mode**: Ensure `darkMode: "class"` in Tailwind config

## Important Development Practices

- Always use `pnpm` for package management
- Run `pnpm build` before testing locally
- Use `pnpm link` for local development testing
- Test in the examples/nextjs-demo app before publishing
- Maintain bundle size under 25KB
- All new features should include tests
- Follow accessibility best practices (WCAG 2.1 AA)
