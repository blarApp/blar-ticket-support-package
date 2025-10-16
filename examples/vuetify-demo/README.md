# Blario + Vuetify Demo

This demo shows `@blario/vue` working perfectly with **Vuetify 3** and **NO Tailwind CSS**.

## Key Features

✅ **No Tailwind CSS** - Uses Blario's standalone CSS bundle
✅ **Vuetify 3** - Material Design components
✅ **Full Integration** - Issue reporter works seamlessly
✅ **Theme Matching** - Blario colors match Vuetify theme
✅ **Dark Mode** - Toggle theme in app bar
✅ **All Features** - Issue reporting, diagnostics, file uploads, etc.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```

## What to Test

1. **Click the floating bug icon** (bottom-right) to open the issue reporter
2. **Use the app bar button** "Report Issue"
3. **Test dark mode** with the theme toggle button
4. **Navigate pages** - Home, About, Dashboard
5. **Try quick actions** on the Dashboard page
6. **Verify styling** - All Blario components should look good with Vuetify

## No Tailwind CSS!

This project demonstrates that `@blario/vue` works with:
- ✅ Vuetify
- ✅ Element Plus (potential)
- ✅ Quasar (potential)
- ✅ PrimeVue (potential)
- ✅ Any Vue UI framework!

The package includes a complete CSS bundle, so Tailwind is completely optional.

## Customization

Blario colors are customized to match Vuetify's theme via CSS variables:

```css
:root {
  --blario-primary: 25 118 210;  /* Vuetify blue #1976D2 */
  --blario-radius: 4px;           /* Vuetify border radius */
}
```

See `src/App.vue` for the full customization.
