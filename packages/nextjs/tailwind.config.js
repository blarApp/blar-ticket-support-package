/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Important: we'll scope with PostCSS, not here
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
      },
    },
  },
  plugins: [],
}