# Theme System Implementation

## Overview
A comprehensive theming system has been implemented for the Ruminster Frontend application, providing scalable dark/light mode support with high accessibility standards.

## ✅ Features Implemented

### 1. **Global CSS Variables System** (`src/index.css`)
- **Colors**: Primary, secondary, accent, background variants, text colors, borders, state colors
- **Typography**: Font families, sizes, weights (Inter for sans-serif, JetBrains Mono for code)
- **Spacing**: Consistent spacing scale (xs to 2xl)
- **Border Radius**: Standardized radius values (sm to xl)
- **Shadows**: Depth-appropriate shadows for both light and dark themes
- **High Contrast**: WCAG AA compliant color combinations

### 2. **React Theme Context** (`src/contexts/ThemeContext.tsx`)
- **Theme Modes**: Light, Dark, System (auto-switching)
- **localStorage Persistence**: User preference saved across sessions
- **System Detection**: Responds to OS theme changes via `window.matchMedia`
- **Real-time Updates**: Instant theme switching without page reload
- **Hooks**: `useTheme()` and `useThemeStyles()` for easy component integration

### 3. **Enhanced Theme Toggle** (`src/components/ThemeToggle.tsx`)
- **Interactive Toggle**: Main button for quick light/dark switching
- **Theme Selector**: Hover dropdown with Light/Dark/System options
- **Visual Feedback**: Icons and labels indicate current state
- **Accessibility**: Proper ARIA labels and keyboard navigation

### 4. **Tailwind Integration** (`tailwind.config.js`)
- **CSS Variables Mapping**: All Tailwind colors mapped to CSS variables
- **Automatic Updates**: Colors update automatically when theme changes
- **Extended Configuration**: Font families, sizes, spacing, shadows integrated

### 5. **Updated Components**
- **HomePage**: Converted from inline styles to theme-aware classes
- **LoginPage**: Updated with accessible form styling and theme colors
- **App.tsx**: Integrated with ThemeProvider wrapper

### 6. **Utility Classes** (`src/index.css`)
- `.btn-primary`: Themed button with hover and disabled states
- `.form-input`: Consistent input styling with focus states
- `.card`: Card component with appropriate shadows and borders
- `.theme-*`: Direct utility classes for theme colors

## 🎨 Color Palette

### Light Theme
- **Primary**: rgb(28, 99, 63) (Green)
- **Background**: #ffffff (White)
- **Text Primary**: #0f172a (Dark slate)
- **Text Secondary**: #475569 (Medium slate)
- **Surface**: #f1f5f9 (Light slate)

### Dark Theme
- **Primary**:rgb(28, 99, 63) (Bright green)
- **Background**:rgb(9, 14, 26) (Dark slate)
- **Text Primary**: #f1f5f9 (Light slate)
- **Text Secondary**: #cbd5e1 (Medium light slate)
- **Surface**:rgb(41, 64, 97) (Medium slate)

## 📚 Usage Examples

### Basic Theme Usage
```tsx
import { useTheme } from './contexts/ThemeContext';

const MyComponent = () => {
  const { theme, effectiveTheme, setTheme } = useTheme();
  
  return (
    <div className="bg-background text-text-primary">
      <p>Current theme: {effectiveTheme}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
};
```

### Using Theme Styles Hook
```tsx
import { useThemeStyles } from './contexts/ThemeContext';

const MyComponent = () => {
  const themeStyles = useThemeStyles();
  
  return (
    <div className={themeStyles.cardClass}>
      <button className={themeStyles.buttonPrimaryClass}>
        Themed Button
      </button>
    </div>
  );
};
```

### Custom CSS with Variables
```css
.my-component {
  background-color: var(--color-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  font-family: var(--font-family-sans);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Tailwind Classes
```tsx
<div className="bg-card text-text-primary border border-border rounded-lg p-md shadow-md">
  <h2 className="text-2xl font-semibold text-text-primary mb-4">Title</h2>
  <p className="text-text-secondary">Description text</p>
  <button className="btn-primary">Action</button>
</div>
```

## 🔧 Developer Guidelines

### Do's ✅
- Use CSS variables for custom styling: `var(--color-primary)`
- Use Tailwind theme classes: `bg-primary`, `text-text-primary`
- Use utility classes for common components: `.btn-primary`, `.card`
- Test both light and dark modes during development
- Ensure sufficient color contrast (4.5:1 minimum)

### Don'ts ❌
- Don't use hardcoded colors: `#ffffff`, `#000000`
- Don't use non-theme Tailwind colors: `bg-blue-500`, `text-gray-800`
- Don't create components without theme support
- Don't forget to test theme switching functionality

## 🧪 Testing
- Build completes successfully with `npm run build`
- Theme toggle works correctly
- localStorage persistence functional
- System theme detection active
- All components respond to theme changes
- Accessibility standards maintained

## 🚀 Future Enhancements
- Add animation preferences (reduce motion support)
- Implement theme-specific component variants
- Add more semantic color tokens
- Create theme preview component
- Add high contrast mode option
