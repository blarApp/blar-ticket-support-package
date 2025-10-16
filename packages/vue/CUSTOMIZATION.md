# Customization Guide

This guide shows how to customize @blario/vue regardless of whether you're using Tailwind CSS or not.

## Without Tailwind CSS

### Basic Customization

Customize the theme by overriding CSS variables in your global CSS file:

```css
/* src/style.css */
:root {
  /* Primary brand color */
  --blario-primary: 220 95% 50%;              /* Blue */
  --blario-primary-foreground: 0 0% 100%;     /* White */

  /* Background */
  --blario-background: 0 0% 100%;             /* White */
  --blario-foreground: 222 84% 5%;            /* Dark gray */

  /* Borders & inputs */
  --blario-border: 214 32% 91%;
  --blario-input: 214 32% 91%;
  --blario-radius: 0.5rem;                    /* Border radius */
}
```

### Dark Mode

Enable dark mode by adding a `dark` class to your root element:

```vue
<template>
  <div :class="{ dark: isDarkMode }">
    <BlarioProvider>
      <App />
    </BlarioProvider>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const isDarkMode = ref(false);
</script>
```

Customize dark mode colors:

```css
.dark {
  --blario-background: 222 84% 5%;
  --blario-foreground: 210 40% 98%;
  --blario-primary: 210 40% 98%;
  --blario-border: 217 33% 18%;
}
```

### Complete Color System

All available CSS variables:

```css
:root {
  /* Backgrounds */
  --blario-background: 0 0% 100%;
  --blario-foreground: 222 84% 5%;
  --blario-card: 0 0% 100%;
  --blario-card-foreground: 222 84% 5%;
  --blario-popover: 0 0% 100%;
  --blario-popover-foreground: 222 84% 5%;

  /* Brand colors */
  --blario-primary: 222 47% 11%;
  --blario-primary-foreground: 210 40% 98%;
  --blario-secondary: 210 40% 96%;
  --blario-secondary-foreground: 222 47% 11%;

  /* UI states */
  --blario-muted: 210 40% 96%;
  --blario-muted-foreground: 215 16% 47%;
  --blario-accent: 210 40% 96%;
  --blario-accent-foreground: 222 47% 11%;
  --blario-destructive: 0 84% 60%;
  --blario-destructive-foreground: 210 40% 98%;

  /* Form elements */
  --blario-border: 214 32% 91%;
  --blario-input: 214 32% 91%;
  --blario-ring: 222 84% 5%;

  /* Border radius */
  --blario-radius: 0.5rem;
}
```

### Example: Vuetify Integration

```vue
<template>
  <v-app>
    <BlarioProvider>
      <v-main>
        <router-view />
      </v-main>
      <IssueReporterButton />
    </BlarioProvider>
  </v-app>
</template>

<script setup>
import { BlarioProvider, IssueReporterButton } from '@blario/vue';
import '@blario/vue/styles.css';
</script>

<style>
/* Match Blario colors to your Vuetify theme */
:root {
  --blario-primary: 211 100% 50%;              /* Vuetify blue */
  --blario-primary-foreground: 0 0% 100%;
  --blario-radius: 4px;                        /* Vuetify border radius */
}
</style>
```

## With Tailwind CSS

### Using the Preset

```js
// tailwind.config.js
import blarioPreset from '@blario/vue/tailwind-preset';

export default {
  presets: [blarioPreset],
  content: [
    './src/**/*.{vue,js,ts}',
    './node_modules/@blario/vue/dist/**/*.{js,mjs,vue}',
  ],
};
```

### Customizing Colors

Override colors in your Tailwind config:

```js
// tailwind.config.js
import blarioPreset from '@blario/vue/tailwind-preset';

export default {
  presets: [blarioPreset],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(220, 95%, 50%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
      },
    },
  },
  content: [
    './src/**/*.{vue,js,ts}',
    './node_modules/@blario/vue/dist/**/*.{js,mjs,vue}',
  ],
};
```

## Runtime Customization

### Theme Provider

Customize theme at runtime via the provider:

```vue
<template>
  <BlarioProvider
    :theme="{
      mode: isDark ? 'dark' : 'light',
      position: 'bottom-left',
      accent: '#10b981',
    }"
  >
    <App />
  </BlarioProvider>
</template>
```

### CSS-in-JS

For dynamic theming, update CSS variables programmatically:

```vue
<script setup>
import { watch } from 'vue';

const updateTheme = (primaryColor) => {
  document.documentElement.style.setProperty(
    '--blario-primary',
    primaryColor
  );
};

// Update when user changes theme
watch(userTheme, (theme) => {
  updateTheme(theme.primaryColor);
});
</script>
```

## Button Customization

### Custom Classes

```vue
<template>
  <IssueReporterButton
    variant="inline"
    class="custom-button"
  >
    Report Issue
  </IssueReporterButton>
</template>

<style scoped>
.custom-button {
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s;
}

.custom-button:hover {
  transform: scale(1.05);
}
</style>
```

### Unstyled Mode

Complete control with unstyled mode:

```vue
<template>
  <IssueReporterButton unstyled class="my-button">
    <MyIcon />
    <span>Report</span>
  </IssueReporterButton>
</template>

<style scoped>
.my-button {
  /* Completely custom styles */
}
</style>
```

## Framework-Specific Examples

### Element Plus

```css
:root {
  --blario-primary: 64 158 255;          /* Element Plus primary */
  --blario-radius: 4px;
  --blario-border: 220 223 230;
}
```

### Quasar

```css
:root {
  --blario-primary: 26 188 156;          /* Quasar primary */
  --blario-radius: 4px;
}
```

### PrimeVue

```css
:root {
  --blario-primary: 33 150 243;          /* PrimeVue primary */
  --blario-radius: 6px;
}
```

## Tips

1. **HSL Format**: All colors use HSL format without `hsl()` wrapper (e.g., `220 95% 50%`)
2. **Opacity Support**: Use `hsl(var(--blario-primary) / 0.5)` for transparency
3. **Scoped Customization**: Apply variables to specific containers for different themes
4. **Dark Mode**: Add `dark` class to any parent element, not just `:root`
5. **Inspector**: Use browser dev tools to inspect Blario components and see which variables they use
