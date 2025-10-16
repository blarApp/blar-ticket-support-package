# @blario/core

Shared core logic for the Blario JavaScript SDKs.

This package contains the framework-agnostic logic used by the Next.js and Vue SDKs, including:

- Zod schemas and TypeScript types for payloads and configuration.
- API client with retry logic and typed responses.
- Storage manager for persisting diagnostics locally.
- Capture manager for gathering console and network information.
- Upload manager for handling signed URL uploads.

## Development

Build the package:

```bash
pnpm --filter @blario/core build
```

Run type checking:

```bash
pnpm --filter @blario/core typecheck
```

## Publishing

The package is configured to publish to npm under the `@blario` scope. Use the repository-level Changesets workflow to release new versions.

