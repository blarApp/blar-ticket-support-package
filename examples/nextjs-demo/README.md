# Blario Next.js Demo App

This is a demo Next.js application to test and showcase the `@blario/nextjs` package components and features.

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Set up environment variables

The demo includes a `.env.local` file with a test project ID. In production, replace it with your actual Blario project ID:

```bash
NEXT_PUBLIC_BLARIO_PROJECT_ID=your-actual-project-id
```

### 3. Run the development server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the demo.

## 📱 Demo Pages

### Home (`/`)
- Overview and navigation to all test pages
- Basic floating issue reporter button

### Test Modal (`/test-modal`)
- Different button variants (floating, inline)
- Pre-filled form data examples
- Category-specific reporting

### Test Hook (`/test-hook`)
- Programmatic issue reporting
- Using the `useBlario` hook
- Custom error reporting
- Console log generation

### Test Error Boundary (`/test-error`)
- Error boundary integration
- Component error handling
- Unhandled error testing
- Recovery mechanisms

### Test Styles (`/test-styles`)
- Button position variations
- Custom styling examples
- Theme customization
- Banner positioning

## 🧪 Testing Features

### Issue Reporter Modal
1. Click the floating button in the bottom-right corner
2. Fill out the form (summary is required)
3. Attach images (optional, max 3)
4. Submit to see the flow (note: demo project ID won't actually submit)

### Programmatic Reporting
1. Go to `/test-hook`
2. Use the buttons to test different reporting methods
3. Check console for logs

### Error Boundary
1. Go to `/test-error`
2. Click "Trigger Error in Component"
3. See the error boundary fallback UI
4. Click "Report This Issue" to pre-fill the error details

## 🎨 Customization

The demo shows various customization options:

- **Provider Configuration**: See `app/providers.tsx`
- **Button Styling**: See `/test-styles` page
- **Theme Options**: Position, accent color, custom classes
- **Form Pre-filling**: Category, severity, custom data

## 📝 Notes

- This demo uses a test project ID that won't actually submit to Blario
- In production, replace with your actual project ID from Blario dashboard
- The API endpoint can be customized in the provider
- Console and network capture are enabled in the demo configuration

## 🔗 Resources

- [Package Documentation](https://www.npmjs.com/package/@blario/nextjs)
- [GitHub Repository](https://github.com/blario/support-js)
- [Blario Website](https://blar.io)

## 🐛 Troubleshooting

### "createContext is not a function" Error
Make sure the BlarioProvider is wrapped in a Client Component (`app/providers.tsx` with `'use client'`).

### Styles not loading
Ensure you've imported the Blario styles in your `globals.css`:
```css
@import '@blario/nextjs/styles';
```

### Environment variables not working
- Variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Restart the dev server after changing `.env.local`