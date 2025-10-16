# Testing Without Tailwind CSS

## Quick Test (5 minutes)

### 1. Modify the vue-demo to not use Tailwind

```bash
cd examples/vue-demo
```

**Edit `src/style.css`:**
```css
/* Replace Tailwind imports with standalone CSS */
@import '@blario/vue/styles.css';

/* Remove these lines:
@import '@blario/vue/theme.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
*/

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
```

**Rename/backup Tailwind config (optional):**
```bash
mv tailwind.config.js tailwind.config.js.disabled
mv postcss.config.js postcss.config.js.disabled
```

### 2. Build and run

```bash
npm run build  # Should complete without errors
npm run dev    # Test in browser
```

### 3. Test these features

- [ ] Click the floating reporter button (bottom-right)
- [ ] Modal opens with proper styling
- [ ] All form fields are visible and styled
- [ ] Buttons have hover states
- [ ] File upload area displays correctly
- [ ] Submit button works
- [ ] Close modal works
- [ ] Dark mode toggle (if implemented in demo)

### 4. Check in Browser DevTools

Open DevTools → Network → CSS:
- You should see `blario.css` loaded (~22KB)
- You should NOT see any Tailwind-generated CSS files

Open DevTools → Elements → Inspect modal:
- Verify CSS variables are applied: `--blario-primary`, `--blario-background`, etc.
- Check that utility classes work: `.flex`, `.gap-2`, `.rounded-md`, etc.

### 5. Test Customization

Add to `src/style.css`:
```css
:root {
  --blario-primary: 220 95% 50%;        /* Bright blue */
  --blario-radius: 12px;                 /* Rounder corners */
}
```

Reload and verify:
- [ ] Primary button is bright blue
- [ ] Border radius is larger (12px)

### 6. Restore Tailwind (optional)

```bash
mv tailwind.config.js.disabled tailwind.config.js
mv postcss.config.js.disabled postcss.config.js
```

Edit `src/style.css` back to original.

---

## Create a Fresh Test Project

### Option 1: Vuetify Project

```bash
npm create vite@latest test-blario-vuetify -- --template vue
cd test-blario-vuetify
npm install
npm install @blario/vue@alpha vue-router
npm install vuetify
```

**main.ts:**
```ts
import { createApp } from 'vue';
import App from './App.vue';
import '@blario/vue/styles.css';  // No Tailwind needed!
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

const vuetify = createVuetify();
const app = createApp(App);
app.use(vuetify);
app.mount('#app');
```

**App.vue:**
```vue
<template>
  <v-app>
    <BlarioProvider publishable-key="pk_test_123">
      <v-main>
        <v-container>
          <h1>Vuetify + Blario Test</h1>
          <v-btn color="primary">Vuetify Button</v-btn>
        </v-container>
      </v-main>
      <IssueReporterButton />
    </BlarioProvider>
  </v-app>
</template>

<script setup>
import { BlarioProvider, IssueReporterButton } from '@blario/vue';
</script>
```

Run: `npm run dev` and test the reporter button.

### Option 2: Plain Vue (No UI Framework)

```bash
npm create vite@latest test-blario-plain -- --template vue
cd test-blario-plain
npm install
npm install @blario/vue@alpha vue-router
```

**main.ts:**
```ts
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import '@blario/vue/styles.css';  // Only CSS needed!

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: App }],
});

const app = createApp(App);
app.use(router);
app.mount('#app');
```

**App.vue:**
```vue
<template>
  <BlarioProvider publishable-key="pk_test_123">
    <div class="app">
      <h1>Plain Vue + Blario (No Tailwind)</h1>
      <p>Click the button in the bottom-right corner</p>
      <IssueReporterButton />
    </div>
  </BlarioProvider>
</template>

<script setup>
import { BlarioProvider, IssueReporterButton } from '@blario/vue';
</script>

<style>
body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 20px;
}

/* Optional: Customize Blario */
:root {
  --blario-primary: 139 92% 46%;  /* Green */
}
</style>
```

Run: `npm run dev`

---

## Automated Tests

### Build Test

```bash
# In the vue package directory
cd packages/vue

# Clean build
npm run clean
npm run build

# Check output
ls -lh dist/blario.css  # Should be ~22KB
ls -lh dist/styles/theme.css
```

### Visual Regression Test

Use the demo dashboard:
```bash
cd examples/vue-demo
npm run dev
```

Test all these pages:
- `/` - Home page with floating button
- `/test-modal` - Modal test
- `/test-styles` - Style test
- `/settings` - Settings page

Take screenshots and verify styling looks correct.

---

## Checklist: What Should Work

### ✅ Basic Functionality
- [ ] Package builds without Tailwind installed
- [ ] Components render without errors
- [ ] Modal opens and closes
- [ ] Forms are usable and styled
- [ ] Buttons have proper styles and hover states
- [ ] Icons display correctly

### ✅ Styling
- [ ] All utility classes work (flex, gap, rounded, etc.)
- [ ] Colors are applied from CSS variables
- [ ] Border radius from `--blario-radius` works
- [ ] Spacing is consistent
- [ ] Text sizing and weights are correct

### ✅ Dark Mode
- [ ] Adding `class="dark"` to parent triggers dark mode
- [ ] All dark mode colors apply correctly
- [ ] Text remains readable in dark mode

### ✅ Customization
- [ ] Changing `--blario-primary` updates primary color
- [ ] Changing `--blario-radius` updates border radius
- [ ] CSS variable overrides work globally

### ✅ Responsiveness
- [ ] Modal is responsive on mobile
- [ ] Floating button is accessible on mobile
- [ ] Form layout adapts to screen size

---

## Common Issues

**If styles don't apply:**
1. Check `@blario/vue/styles.css` is imported in main.ts
2. Verify CSS file loads in Network tab
3. Check for CSS conflicts with other frameworks

**If classes don't work:**
1. Clear Vite cache: `rm -rf node_modules/.vite`
2. Rebuild package: `cd packages/vue && npm run build`
3. Reinstall in demo: `cd examples/vue-demo && npm install`

**If customization doesn't work:**
1. Verify CSS variables are in `:root` or proper scope
2. Check color format is HSL without `hsl()` wrapper
3. Use browser DevTools to inspect computed styles
