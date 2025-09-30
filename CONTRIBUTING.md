# Contributing to Blar Support JS

First off, thank you for considering contributing to Blar Support JS! It's people like you that make Blar such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes (`pnpm test`)
5. Make sure your code lints (`pnpm lint`)
6. Create a changeset (`pnpm changeset`)

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

1. Clone the repository
```bash
git clone https://github.com/blario/support-js.git
cd support-js
```

2. Install dependencies
```bash
pnpm install
```

3. Build packages
```bash
pnpm build
```

### Development Workflow

1. **Make your changes** in a new git branch:
```bash
git checkout -b my-feature-branch
```

2. **Run tests** to ensure everything works:
```bash
pnpm test
```

3. **Check linting**:
```bash
pnpm lint
```

4. **Format code**:
```bash
pnpm format
```

5. **Create a changeset** for your changes:
```bash
pnpm changeset
```

Select the packages that have changed and describe your changes. This will be used to generate the changelog and determine version bumps.

### Project Structure

```
blar-support-js/
├── packages/
│   ├── nextjs/         # Next.js SDK
│   ├── react/          # React SDK (planned)
│   └── node/           # Node.js SDK (planned)
├── examples/           # Example applications
├── .changeset/         # Changeset configuration
├── .github/            # GitHub workflows
└── docs/              # Documentation
```

### Testing

We use Vitest for testing. Tests should be placed next to the code they test in `__tests__` directories or as `.test.ts` files.

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Code Style

We use ESLint and Prettier for code formatting. The configuration is already set up, and formatting will be automatically applied on commit via Husky hooks.

- Use TypeScript for all new code
- Follow the existing code style
- Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Messages

We follow the Conventional Commits specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning
- `refactor:` Code changes that neither fix bugs nor add features
- `perf:` Performance improvements
- `test:` Adding or correcting tests
- `build:` Changes to build system or dependencies
- `ci:` Changes to CI configuration
- `chore:` Other changes that don't modify src or test files

Examples:
```
feat(nextjs): add support for custom themes
fix(api): handle network timeouts correctly
docs: update installation instructions
```

### Releasing

Releases are handled automatically via GitHub Actions when changes are merged to `main`. The process:

1. Create a PR with your changes
2. Add a changeset describing your changes
3. Get PR approved and merge to `main`
4. Changesets bot will create a "Version Packages" PR
5. Merge the version PR to trigger a release

### Documentation

- Update documentation for any user-facing changes
- Add JSDoc comments for public APIs
- Include examples for new features

## Questions?

Feel free to open an issue with your question or reach out on our [Discord](https://discord.gg/blario).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.