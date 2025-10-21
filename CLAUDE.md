# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blar Support JS is a monorepo of JavaScript/TypeScript SDKs for AI-powered issue diagnostics and support. The repository provides framework-specific SDKs (`@blario/nextjs` and `@blario/vue`) that share common functionality through the `@blario/core` package.

## Repository Structure

This is a **pnpm workspace monorepo** managed by **Turborepo** with the following structure:

```
packages/
  core/            - Shared core logic (API client, capture manager, storage, schemas)
  nextjs/          - Next.js SDK with React components
  vue/             - Vue 3 SDK with Vue components
examples/
  nextjs-demo/     - Demo Next.js application
  vue-demo/        - Demo Vue application
  vuetify-demo/    - Demo Vuetify application
```

### Package Details

**`@blario/core`** - Framework-agnostic shared functionality:
- `src/managers/api.ts` - API client with retry logic and signed URL upload
- `src/managers/storage.ts` - LocalStorage manager for diagnostic history
- `src/managers/upload.ts` - File upload manager with progress tracking
- `src/managers/websocket.ts` - WebSocket connection manager
- `src/schemas.ts` - Zod schemas for validation

**`@blario/nextjs`** - Next.js/React SDK:
- `src/provider/` - React context provider (BlarioProvider)
- `src/hooks/` - React hooks (useBlario, useBlarioUpload, useSupportChat, use-mobile, use-toast)
- `src/ui/` - UI components (IssueReporterModal, IssueReporterButton, DiagnosticBanner, SupportChatButton, SupportChatModal, shadcn/ui components)
- `src/tour/` - Product tour system (TourProvider, TourOverlay, element finding/waiting)
- `src/errors/` - Error boundary components
- `src/lib/` - Utility functions (cn, variants)
- `src/styles/` - Tailwind CSS styles

**`@blario/vue`** - Vue 3 SDK:
- `src/plugin/BlarioPlugin.ts` - Vue plugin for global installation
- `src/composables/` - Vue composables (useBlario, useBlarioUpload)
- `src/components/` - Vue components (BlarioProvider, BlarioRoot, IssueReporterModal, IssueReporterButton, DiagnosticBanner, ChatWidget, TourProvider)
- `src/lib/` - Utility functions (cn, variants)
- `src/styles/` - Standalone CSS (framework-agnostic, works without Tailwind)

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

**Core package:**
```bash
cd packages/core
pnpm dev              # Development mode with watch
pnpm build            # Build the package
pnpm typecheck        # Type checking
pnpm clean            # Remove dist folder
```

**Next.js package:**
```bash
cd packages/nextjs
pnpm dev              # Development mode with watch
pnpm build            # Build the package
pnpm build:css        # Build only CSS
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage
pnpm size             # Check bundle size
pnpm typecheck        # Type checking
pnpm lint             # Lint
```

**Vue package:**
```bash
cd packages/vue
pnpm dev              # Development mode with watch (Vite)
pnpm build            # Build library, CSS, and theme
pnpm build:css        # Build standalone CSS only
pnpm build:theme      # Copy theme CSS to dist
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage
pnpm size             # Check bundle size
pnpm typecheck        # Type checking (vue-tsc)
pnpm lint             # Lint
```

### Running a Single Test
```bash
# In any package directory (nextjs or vue)
pnpm test <test-file-pattern>

# Examples
pnpm test api.test.ts
pnpm test BlarioPlugin.test.ts
```

## Key Architecture Patterns

### 1. Monorepo with Shared Core
The repository uses a **shared core architecture**:
- `@blario/core` contains framework-agnostic logic (API client, schemas, managers)
- Framework-specific packages (`@blario/nextjs`, `@blario/vue`) depend on `@blario/core`
- Core singletons are managed via factory functions: `getApiClient()`, `getCaptureManager()`, `getStorageManager()`
- Each singleton has a corresponding `reset*()` function for cleanup

**Turborepo build pipeline:**
- Core package builds first (dependency via `^build` in turbo.json)
- Framework packages build after core is ready
- Tests depend on completed builds

### 2. Framework Integration Patterns

**React (Next.js):**
- Uses React Context via `BlarioProvider` component
- Must use `'use client'` directive in Next.js App Router
- Hooks: `useBlario()`, `useBlarioUpload()`, `useSupportChat()`
- Build: tsup + PostCSS for Tailwind

**Vue 3:**
- Uses Vue Plugin pattern via `app.use(BlarioPlugin, options)`
- Provides global `$blario` instance via `app.config.globalProperties`
- Composables: `useBlario()`, `useBlarioUpload()`
- Integrates with Vue Router for route tracking (if available)
- Build: Vite + PostCSS for standalone CSS
- CSS is framework-agnostic (works without Tailwind, supports Vuetify/PrimeVue/Quasar/ElementPlus)

### 3. File Upload Architecture
Both packages use a **signed URL upload pattern**:
- Attachments are NOT sent as base64 in the JSON payload
- Files are uploaded separately using signed URLs from the backend
- Upload managers handle progress tracking and retry logic
- Upload flow: request signed URL → upload file directly → attach to issue

Implementation in `@blario/core/src/managers/upload.ts`.

### 4. State Management Patterns
**React:** Context API with `readonly()` state
**Vue:** Reactive state with `reactive()` and `readonly()` wrapper, provided via dependency injection (`inject(BlarioKey)`)

Both patterns provide:
- Configuration (API keys, user info, theme)
- Modal state management
- Issue submission flow
- Rate limiting
- Diagnostic history

### 5. Capture System
The `CaptureManager` from `@blario/core` automatically collects:
- Console logs (configurable max: 50)
- Network requests (optional, configurable max: 20)
- Viewport information
- Browser metadata
- Route history

This data is attached to issue reports for AI diagnostics.

### 6. AI Triage System
The `ApiClient` in `@blario/core` provides AI-powered issue prefill:
- `generateIssuePrefill()` sends chat history to triage endpoint
- Backend AI analyzes conversation and suggests issue category, severity, description
- Framework packages apply triage responses to their respective UI forms

### 7. Tour System
Both frameworks support guided product tours:
- Tour providers manage tour state and progression
- DOM element finding by various selectors (CSS, text content, ARIA labels)
- Element waiter utilities handle asynchronous element loading
- Tours can target dynamic content and wait for elements to appear

## TypeScript Configuration

All packages use strict TypeScript settings:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`

Path aliases:
- `@/*` → `./src/*` (all packages)

## Testing

All packages use **Vitest** with:
- `happy-dom` environment for DOM testing
- Component testing libraries:
  - `@testing-library/react` for Next.js package
  - `@vue/test-utils` for Vue package
- Global test utilities via `src/__tests__/setup.ts`
- Coverage reporting with text, JSON, and HTML formats

## Styling

**Next.js package:**
- Uses **Tailwind CSS** with custom preset (`tailwind-preset.js`)
- shadcn/ui components (Radix UI primitives + Tailwind)
- Dark mode via `dark` class on document root
- Utilities: `cn()` from `src/lib/cn.ts` for class merging

**Vue package:**
- Uses **standalone CSS** (framework-agnostic, no Tailwind dependency required)
- Optionally supports Tailwind via `tailwind-preset.js`
- Compatible with Vuetify, PrimeVue, Quasar, Element Plus
- Radix Vue components (Vue port of Radix UI)
- Dark mode via `dark` class on document root
- Utilities: `cn()` from `src/lib/cn.ts` for class merging

## Building and Bundling

**Core package (tsup):**
- Outputs: CJS, ESM, and type declarations
- No CSS output

**Next.js package (tsup):**
- Outputs: CJS, ESM, and type declarations
- CSS built separately via PostCSS
- Size limit: 25KB gzipped (enforced by size-limit)

**Vue package (Vite):**
- Outputs: ESM, CJS, and type declarations
- CSS built separately via PostCSS
- Standalone CSS scoped to `.blario-root` for isolation
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

**Development:**
- Node.js >= 18.0.0
- pnpm >= 8.0.0

**SDK peer dependencies:**
- `@blario/nextjs`: Next.js >= 13.4.0, React >= 18.2.0, Tailwind CSS >= 3.4.0
- `@blario/vue`: Vue >= 3.3.0, Vue Router >= 4.0.0, Tailwind CSS >= 3.4.0 (optional)

## Integration Notes for Consumers

**When integrating `@blario/nextjs`:**
1. **Tailwind content paths**: Must include `'./node_modules/@blario/nextjs/dist/**/*.{js,ts,jsx,tsx,mjs,cjs}'` in `tailwind.config.ts`
2. **Tailwind preset**: Import and use `preset` from `@blario/nextjs/tailwind-preset`
3. **Client Component wrapper**: BlarioProvider requires `'use client'` directive
4. **Environment variables**: Use `NEXT_PUBLIC_` prefix for publishable keys
5. **Dark mode**: Ensure `darkMode: "class"` in Tailwind config

**When integrating `@blario/vue`:**
1. **Plugin registration**: Use `app.use(BlarioPlugin, { publishableKey, ... })` in main.ts/js
2. **CSS import options**:
   - Standalone CSS (no Tailwind): `import '@blario/vue/styles.css'`
   - With Tailwind: Include content path and preset in `tailwind.config.js`
3. **Tailwind content paths** (if using Tailwind): `'./node_modules/@blario/vue/dist/**/*.{js,mjs,vue}'`
4. **Tailwind preset** (if using Tailwind): Import preset from `@blario/vue/tailwind-preset`
5. **Dark mode**: Ensure `darkMode: "class"` in Tailwind config (if using Tailwind)
6. **Framework compatibility**: Works with Vuetify, PrimeVue, Quasar, Element Plus, or vanilla Vue

## Important Development Practices

- Always use `pnpm` for package management (never npm or yarn)
- Core package must build before framework packages (Turborepo handles this)
- Run `pnpm build` at root before testing locally
- Use `pnpm link` for local development testing
- Test in example apps before publishing:
  - `examples/nextjs-demo` for Next.js changes
  - `examples/vue-demo` or `examples/vuetify-demo` for Vue changes
- Maintain bundle size under 25KB per package
- All new features should include tests
- Follow accessibility best practices (WCAG 2.1 AA)
