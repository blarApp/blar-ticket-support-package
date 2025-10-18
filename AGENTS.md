# Repository Guidelines

## Project Structure & Module Organization
- `packages/nextjs` contains the published SDK; `src` is grouped by features (`chat`, `tour`, `ui`, `provider`, `core`).
- `src/lib` stores shared utilities, `src/errors` centralizes runtime errors, and `src/styles` ships the CSS copied into `dist/`.
- Tests live next to their modules as `*.test.ts(x)` files and share bootstrap logic in `src/__tests__/setup.ts`.
- `examples/nextjs-demo` is the reference integration; update it whenever exports or env variables change.
- Root configs (`turbo.json`, `pnpm-workspace.yaml`) wire pnpm workspaces, Turbo pipelines, and Tailwind presets.

## Build, Test, and Development Commands
- Install with `pnpm install` (Node ≥18, pnpm ≥8).
- `pnpm dev` launches Turbo pipelines; use `--filter @blario/nextjs` for a focused watch build.
- `pnpm --filter @blario/nextjs build` runs `tsup` and PostCSS to refresh `dist/`.
- `pnpm test` fans out Vitest across packages; scope with `--filter` for faster runs.
- `pnpm lint`, `pnpm format:check`, and `pnpm typecheck` mirror CI; `pnpm lint:fix` applies safe ESLint fixes.

## Coding Style & Naming Conventions
- TypeScript + ES modules; author functional React components and colocate hooks in `src/hooks`.
- Prettier enforces two-space indentation, trailing commas, and double quotes; run `pnpm format` before pushing.
- ESLint (TypeScript, React, a11y, import plugins) blocks unused symbols, unordered imports, and inconsistent JSX props.
- Export components with PascalCase; util files use camelCase and default exports only when they wrap simple helpers.

## Testing Guidelines
- Vitest runs under `happy-dom` with Testing Library; `setup.ts` mocks Next.js routing and browser APIs.
- Name specs `*.test.tsx` or `*.spec.ts` and colocate them with the feature under test.
- `pnpm --filter @blario/nextjs test:coverage` writes reports to `packages/nextjs/coverage`; keep meaningful assertions.
- Prefer MSW for HTTP scenarios instead of ad-hoc `fetch` mocks so shared handlers stay realistic.

## Commit & Pull Request Guidelines
- Adopt Conventional Commits (`feat`, `fix`, `docs`, `chore`, etc.) with scopes that match packages (`feat(nextjs): …`).
- Each PR must add a `pnpm changeset`, pass lint + tests, explain user impact, and link an issue or internal ticket.
- Provide screenshots or terminal logs for UI changes and update package READMEs when public APIs move.

## Security & Configuration Tips
- Do not commit secrets; reference `NEXT_PUBLIC_BLARIO_PUBLISHABLE_KEY` and document additions in `README.md`.
- When introducing Tailwind utilities, verify the preset and `content` globs cover new paths before publishing.
