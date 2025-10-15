# Migration Guide from Next.js to Vue

This document outlines the key differences between the `@blario/nextjs` and `@blario/vue` packages and how to migrate from one to the other.

## Architecture Differences

### Provider Pattern

**Next.js (React Context)**
```tsx
import { BlarioProvider } from '@blario/nextjs';

<BlarioProvider publishableKey="key">
  <App />
</BlarioProvider>
```

**Vue (Plugin)**
```typescript
import { BlarioPlugin } from '@blario/vue';

app.use(BlarioPlugin, {
  publishableKey: 'key'
});
```

### Hooks vs Composables

**Next.js**
```tsx
import { useBlario } from '@blario/nextjs';

const { openReporter, isModalOpen } = useBlario();
```

**Vue**
```typescript
import { useBlario } from '@blario/vue';

const { openReporter, isModalOpen } = useBlario();
```

*API is identical, but Vue composables return reactive refs*

### Components

**Next.js (React Components)**
```tsx
import { IssueReporterButton } from '@blario/nextjs';

<IssueReporterButton variant="floating" />
```

**Vue (Vue Components)**
```vue
<script setup>
import { IssueReporterButton } from '@blario/vue';
</script>

<template>
  <IssueReporterButton variant="floating" />
</template>
```

## Feature Parity

| Feature | Next.js | Vue | Notes |
|---------|---------|-----|-------|
| Issue Reporting | ✅ | ✅ | |
| File Uploads | ✅ | ✅ | Via signed URLs |
| Console Capture | ✅ | ✅ | |
| Network Capture | ✅ | ✅ | |
| Route Tracking | ✅ | ✅ | Next.js Router → Vue Router |
| Error Boundaries | ✅ | ✅ | Different implementation |
| Dark Mode | ✅ | ✅ | |
| Localization | ✅ | ✅ | en, es |
| TypeScript | ✅ | ✅ | Full support |
| Tour System | ✅ | ⚠️ | Vue implementation pending |
| Chat Widget | ✅ | ⚠️ | Vue implementation pending |

## Key Differences

### 1. Router Integration

**Next.js**
```tsx
import { usePathname, useSearchParams } from 'next/navigation';
// Automatic via Next.js App Router
```

**Vue**
```typescript
import { useRouter, useRoute } from 'vue-router';
// Automatic if vue-router is installed
```

### 2. Error Handling

**Next.js**
```tsx
import { withBlarioErrorBoundary } from '@blario/nextjs';

export default withBlarioErrorBoundary(MyComponent);
```

**Vue**
```vue
<script setup>
import { onErrorCaptured } from 'vue';
import { useBlario } from '@blario/vue';

const { openReporter } = useBlario();

onErrorCaptured((error) => {
  openReporter({ prefill: { summary: error.message } });
  return false;
});
</script>
```

### 3. Environment Variables

**Next.js**
```typescript
// Uses process.env.NEXT_PUBLIC_*
appVersion: process.env.NEXT_PUBLIC_APP_VERSION
```

**Vue (Vite)**
```typescript
// Uses import.meta.env.VITE_*
appVersion: import.meta.env.VITE_APP_VERSION
```

### 4. Build System

**Next.js**
- Uses `tsup` for bundling
- Server and client components

**Vue**
- Uses `Vite` for bundling
- SPA-focused architecture

## Migration Checklist

- [ ] Install `@blario/vue` and remove `@blario/nextjs`
- [ ] Replace `BlarioProvider` with `BlarioPlugin` in your app setup
- [ ] Update component imports to use Vue components
- [ ] Update hooks to use composables
- [ ] Update environment variables from `NEXT_PUBLIC_*` to `VITE_*`
- [ ] Update error boundary implementation
- [ ] Test route tracking with Vue Router
- [ ] Verify dark mode functionality
- [ ] Test file uploads
- [ ] Update Tailwind configuration if needed

## Common Issues

### Issue: Components not rendering
**Solution**: Ensure you've installed the plugin and imported styles

### Issue: Router not tracking
**Solution**: Make sure vue-router is installed and the plugin detects it

### Issue: Dark mode not working
**Solution**: Ensure your Tailwind config has `darkMode: "class"` enabled

### Issue: Types not working
**Solution**: Update your tsconfig.json to include proper module resolution

## Support

For questions or issues during migration:
- GitHub Issues: https://github.com/blarApp/blar-ticket-support-package/issues
- Documentation: https://docs.blar.io
