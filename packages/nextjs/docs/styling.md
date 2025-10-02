# Styling Guide

## Overview

The `@blario/nextjs` package provides extensive customization options for the IssueReporterButton component, allowing it to blend seamlessly into any design system.

## Table of Contents

- [Basic Styling](#basic-styling)
- [Unstyled Mode](#unstyled-mode)
- [Button Variants](#button-variants)
- [Custom Icons](#custom-icons)
- [Seamless Integration Examples](#seamless-integration-examples)
- [CSS Variables](#css-variables)

## Basic Styling

### Using className

The simplest way to customize the button is by passing custom classes via the `className` prop:

```tsx
<IssueReporterButton
  variant="inline"
  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg"
>
  Custom Styled Button
</IssueReporterButton>
```

### Button Sizes

Control the button size using the `buttonSize` prop:

```tsx
<IssueReporterButton
  variant="inline"
  buttonSize="sm"  // 'sm' | 'default' | 'lg' | 'icon'
>
  Small Button
</IssueReporterButton>
```

## Unstyled Mode

For complete control over styling, use `unstyled={true}`. This removes all default styles and renders a plain HTML button:

```tsx
<IssueReporterButton
  variant="inline"
  unstyled
  className="your-custom-classes"
>
  Completely Custom Button
</IssueReporterButton>
```

### Benefits of Unstyled Mode

- No default styles applied
- Complete control over appearance
- Perfect for design system integration
- Smaller CSS footprint

## Button Variants

When not using unstyled mode, you can use built-in button variants:

```tsx
<IssueReporterButton
  variant="inline"
  buttonVariant="ghost"  // 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
>
  Ghost Button
</IssueReporterButton>
```

### Available Variants

- `default` - Primary button style with background
- `destructive` - Red/danger style for critical actions
- `outline` - Border only, transparent background
- `secondary` - Secondary color scheme
- `ghost` - Minimal style, hover effect only
- `link` - Styled as a text link

## Custom Icons

Replace the default bug icon with your own:

### Using Emoji Icons

```tsx
<IssueReporterButton
  variant="inline"
  unstyled
  icon={<span>🐛</span>}
>
  Report Issue
</IssueReporterButton>
```

### Using Icon Libraries

```tsx
import { MessageCircle } from 'lucide-react';

<IssueReporterButton
  variant="inline"
  icon={<MessageCircle className="w-4 h-4" />}
>
  Send Feedback
</IssueReporterButton>
```

### Hiding Icons or Text

```tsx
// Icon only
<IssueReporterButton
  variant="inline"
  hideText
>
  {/* Shows only the icon */}
</IssueReporterButton>

// Text only
<IssueReporterButton
  variant="inline"
  hideIcon
>
  Report an Issue
</IssueReporterButton>
```

## Seamless Integration Examples

### Dark Sidebar Integration

Make the button blend perfectly into a dark sidebar:

```tsx
<nav className="bg-gray-900 p-4">
  <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 rounded">
    Settings
  </a>
  <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 rounded">
    Documentation
  </a>

  <IssueReporterButton
    variant="inline"
    unstyled
    className="flex w-full items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition cursor-pointer"
    icon={<span>🐛</span>}
  >
    Report Issue
  </IssueReporterButton>

  <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800 rounded">
    Log Out
  </a>
</nav>
```

### Inline Text Link

Embed the button as a natural text link:

```tsx
<p className="text-sm text-gray-600">
  Need help? Check our documentation or
  <IssueReporterButton
    variant="inline"
    unstyled
    hideIcon
    className="text-blue-600 hover:text-blue-800 underline mx-1 cursor-pointer"
  >
    report an issue
  </IssueReporterButton>
  and we'll get back to you.
</p>
```

### Gradient Button

Create a modern gradient button:

```tsx
<IssueReporterButton
  variant="inline"
  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700"
  icon={<MessageCircle className="w-5 h-5" />}
>
  Send Feedback
</IssueReporterButton>
```

### Floating Action Button (FAB)

Customize the floating button position and style:

```tsx
<IssueReporterButton
  variant="floating"
  position="bottom-right"
  className="bg-indigo-600 hover:bg-indigo-700"
/>
```

## CSS Variables

The package uses CSS variables for theming. You can override these in your global CSS:

```css
:root {
  --blario-primary: 240 5.9% 10%;
  --blario-primary-foreground: 0 0% 98%;
  --blario-background: 0 0% 100%;
  --blario-foreground: 240 10% 3.9%;
  --blario-border: 240 5.9% 90%;
  --blario-ring: 240 5.9% 10%;
  --blario-radius: 0.5rem;
}

/* Dark mode */
:root.dark {
  --blario-primary: 210 40% 98%;
  --blario-primary-foreground: 222.2 47.4% 11.2%;
  --blario-background: 222.2 84% 4.9%;
  --blario-foreground: 210 40% 98%;
  --blario-border: 217.2 32.6% 17.5%;
  --blario-ring: 212.7 26.8% 83.9%;
}
```

## Advanced Customization

### Custom Wrapper Component

For complex integrations, create a wrapper component:

```tsx
import { IssueReporterButton } from '@blario/nextjs';
import { Bug } from 'lucide-react';

export function CustomReportButton({ variant = 'default' }) {
  const styles = {
    default: "bg-blue-500 hover:bg-blue-600",
    minimal: "text-gray-600 hover:text-gray-900",
    alert: "bg-red-500 hover:bg-red-600 animate-pulse"
  };

  return (
    <IssueReporterButton
      variant="inline"
      unstyled
      className={`px-4 py-2 rounded-lg transition ${styles[variant]}`}
      icon={<Bug className="w-5 h-5" />}
    >
      Report Issue
    </IssueReporterButton>
  );
}
```

### Responsive Design

Make the button responsive to different screen sizes:

```tsx
<IssueReporterButton
  variant="inline"
  className="text-sm px-3 py-1 md:text-base md:px-4 md:py-2 lg:text-lg lg:px-6 lg:py-3"
>
  Report Issue
</IssueReporterButton>
```

## Best Practices

1. **Use `unstyled` mode** when you need complete control over styling
2. **Leverage existing design tokens** from your design system
3. **Test accessibility** - ensure sufficient color contrast and focus indicators
4. **Consider mobile users** - make touch targets at least 44x44px
5. **Be consistent** - match the button style to your app's design language

## Troubleshooting

### Styles Not Applying

If custom styles aren't applying:

1. Ensure you're using `unstyled={true}` for complete control
2. Check CSS specificity - you may need to use `!important` or increase specificity
3. Verify the component is receiving the latest package version

### Icon Not Changing

When providing a custom icon:

1. Don't use both `icon` prop and `hideIcon={true}`
2. Ensure the icon component is properly imported
3. Apply sizing classes directly to the icon component

### Button Not Clickable

If the button isn't responding to clicks:

1. Check z-index conflicts with other elements
2. Ensure no invisible overlays are blocking the button
3. Verify the `openReporter` function is properly initialized