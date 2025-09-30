# @blario/nextjs Setup Guide

This guide explains how to integrate @blario/nextjs into your Next.js application using the recommended approach where your application's Tailwind CSS compiles the utility classes.

## Installation

```bash
npm install @blario/nextjs
# or
yarn add @blario/nextjs
# or
pnpm add @blario/nextjs
```

## Configuration

### 1. Update tailwind.config.ts

```ts
import type { Config } from 'tailwindcss';
import preset from '@blario/nextjs/tailwind-preset';

const config: Config = {
  presets: [preset],
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    // IMPORTANT: Scan @blario/nextjs dist files for Tailwind classes
    "./node_modules/@blario/nextjs/dist/**/*.{js,ts,jsx,tsx,mjs,cjs}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--blario-background) / <alpha-value>)",
        foreground: "hsl(var(--blario-foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--blario-card) / <alpha-value>)",
          foreground: "hsl(var(--blario-card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--blario-popover) / <alpha-value>)",
          foreground: "hsl(var(--blario-popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--blario-primary) / <alpha-value>)",
          foreground: "hsl(var(--blario-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--blario-secondary) / <alpha-value>)",
          foreground: "hsl(var(--blario-secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--blario-muted) / <alpha-value>)",
          foreground: "hsl(var(--blario-muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--blario-accent) / <alpha-value>)",
          foreground: "hsl(var(--blario-accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--blario-destructive) / <alpha-value>)",
          foreground: "hsl(var(--blario-destructive-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--blario-border) / <alpha-value>)",
        input: "hsl(var(--blario-input) / <alpha-value>)",
        ring: "hsl(var(--blario-ring) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--blario-radius)",
        md: "calc(var(--blario-radius) - 2px)",
        sm: "calc(var(--blario-radius) - 4px)",
      }
    }
  }
} satisfies Config;

export default config;
```

### 2. Import Theme CSS in globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Blario theme CSS variables */
@import "@blario/nextjs/theme.css";
```

### 3. Configure next.config.js

Add @blario/nextjs to transpilePackages:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@blario/nextjs'],
};

module.exports = nextConfig;
```

### 4. Wrap Your App with BlarioProvider

In your root layout or _app.tsx:

```tsx
import { BlarioProvider } from '@blario/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BlarioProvider
          projectId="your-project-id"
          publishableKey="your-publishable-key"
          theme={{ mode: "light" }} // or "dark"
        >
          {children}
        </BlarioProvider>
      </body>
    </html>
  );
}
```

## Using Components

```tsx
import { IssueReporterButton, useBlario } from '@blario/nextjs';

export function MyComponent() {
  const { openReporter } = useBlario();

  return (
    <div>
      {/* Use the pre-built button */}
      <IssueReporterButton />

      {/* Or trigger programmatically */}
      <button onClick={() => openReporter()}>
        Report Issue
      </button>
    </div>
  );
}
```

## Using Utility Functions

The library exports utility functions for consistent styling:

```tsx
import { cn, buttonVariants } from '@blario/nextjs';

export function CustomButton({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

## Troubleshooting

### No styles appearing?
1. Check that the content glob includes `node_modules/@blario/nextjs/dist/**/*.{js,ts,jsx,tsx,mjs,cjs}`
2. Ensure `@import "@blario/nextjs/theme.css"` is in your globals.css
3. Verify `transpilePackages: ['@blario/nextjs']` is in next.config.js
4. Make sure the BlarioProvider is wrapping your application

### Theme variables not applied?
- Ensure the BlarioProvider is properly wrapping your app
- The `.blario-wrapper` class should be automatically applied by the provider

### TypeScript errors?
- Make sure you have the latest version of @blario/nextjs installed
- The library includes TypeScript definitions for all exports

## Alternative: Self-Contained CSS (Option B)

If you prefer not to configure Tailwind in your app, you can use the pre-built CSS:

```css
/* In globals.css */
@import "@blario/nextjs/styles.css";
```

Note: This approach includes all utility classes and may result in a larger CSS bundle.

## Key Points

- The library ships **without** `@tailwind` directives
- CSS variables are scoped under `.blario-wrapper`
- All components use utility classes (no inline styles)
- The provider automatically applies theme classes
- Components are compatible with shadcn/ui patterns

## Support

For issues or questions, please visit: https://github.com/blario/support-js