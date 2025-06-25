import React, { useState } from 'react';
import { useTheme, useThemeStyles } from '../contexts/ThemeContext';

const ThemeDemo: React.FC = () => {
  const { theme, effectiveTheme } = useTheme();
  const themeStyles = useThemeStyles();
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className={themeStyles.cardClass}>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Theme System Demo</h2>
        <p className="text-text-secondary mb-4">
          This component demonstrates the comprehensive theming system with CSS variables, 
          accessible colors, and consistent styling across light and dark modes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-background-secondary p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-text-primary mb-2">Current Theme</h3>
            <p className="text-text-muted text-sm">
              <span className="font-medium">Mode:</span> {theme}
            </p>
            <p className="text-text-muted text-sm">
              <span className="font-medium">Effective:</span> {effectiveTheme}
            </p>
            <p className="text-text-muted text-sm">
              <span className="font-medium">Auto-switching:</span> {theme === 'system' ? 'Yes' : 'No'}
            </p>
          </div>
          
          <div className="bg-surface p-4 rounded-lg">
            <h3 className="font-semibold text-text-primary mb-2">Features</h3>
            <ul className="text-text-secondary text-sm space-y-1">
              <li>✅ CSS Variables</li>
              <li>✅ System Detection</li>
              <li>✅ localStorage Persistence</li>
              <li>✅ High Contrast Colors</li>
              <li>✅ Accessible Focus States</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Color Palette Demo */}
      <div className={themeStyles.cardClass}>
        <h3 className="text-xl font-semibold text-text-primary mb-4">Color Palette</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="w-full h-16 bg-primary rounded-lg mb-2"></div>
            <span className="text-text-secondary text-sm">Primary</span>
          </div>
          <div className="text-center">
            <div className="w-full h-16 bg-secondary rounded-lg mb-2"></div>
            <span className="text-text-secondary text-sm">Secondary</span>
          </div>
          <div className="text-center">
            <div className="w-full h-16 bg-accent rounded-lg mb-2"></div>
            <span className="text-text-secondary text-sm">Accent</span>
          </div>
          <div className="text-center">
            <div className="w-full h-16 bg-surface rounded-lg border border-border mb-2"></div>
            <span className="text-text-secondary text-sm">Surface</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-full h-16 bg-success rounded-lg mb-2"></div>
            <span className="text-text-secondary text-sm">Success</span>
          </div>
          <div className="text-center">
            <div className="w-full h-16 bg-warning rounded-lg mb-2"></div>
            <span className="text-text-secondary text-sm">Warning</span>
          </div>
          <div className="text-center">
            <div className="w-full h-16 bg-error rounded-lg mb-2"></div>
            <span className="text-text-secondary text-sm">Error</span>
          </div>
          <div className="text-center">
            <div className="w-full h-16 bg-info rounded-lg mb-2"></div>
            <span className="text-text-secondary text-sm">Info</span>
          </div>
        </div>
      </div>

      {/* Component Examples */}
      <div className={themeStyles.cardClass}>
        <h3 className="text-xl font-semibold text-text-primary mb-4">Component Examples</h3>
        
        <div className="space-y-6">
          {/* Buttons */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <button className={themeStyles.buttonPrimaryClass}>
                Primary Button
              </button>
              <button className="btn-primary" disabled>
                Disabled Button
              </button>
              <button className="bg-secondary text-text-inverse px-4 py-2 rounded-md hover:opacity-80 transition-opacity">
                Secondary Button
              </button>
            </div>
          </div>

          {/* Form Elements */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Form Elements</h4>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Text Input
                </label>
                <input
                  type="text"
                  className={themeStyles.inputClass}
                  placeholder="Enter some text..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Select Dropdown
                </label>
                <select className="form-input w-full">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Textarea
                </label>
                <textarea
                  className="form-input w-full"
                  rows={3}
                  placeholder="Enter a longer message..."
                />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Typography</h4>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-text-primary">Heading 1</h1>
              <h2 className="text-3xl font-semibold text-text-primary">Heading 2</h2>
              <h3 className="text-2xl font-medium text-text-primary">Heading 3</h3>
              <p className="text-text-secondary">
                This is body text with secondary color for better hierarchy.
              </p>
              <p className="text-text-muted text-sm">
                This is muted text, often used for captions or less important information.
              </p>
              <code className="bg-surface px-2 py-1 rounded text-sm font-mono text-text-primary">
                const theme = useTheme();
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className={themeStyles.cardClass}>
        <h3 className="text-xl font-semibold text-text-primary mb-4">Usage Instructions</h3>
        
        <div className="prose prose-sm text-text-secondary max-w-none">
          <h4 className="text-text-primary font-semibold">For Developers:</h4>
          <ul className="space-y-1">
            <li>Use CSS variables (var(--color-*)) for custom styles</li>
            <li>Use Tailwind classes (bg-primary, text-text-primary, etc.) for rapid development</li>
            <li>Use utility classes (.btn-primary, .form-input, .card) for common components</li>
            <li>Access theme context with useTheme() hook</li>
          </ul>
          
          <h4 className="text-text-primary font-semibold mt-4">Example Code:</h4>
          <pre className="bg-surface p-4 rounded-lg text-sm overflow-x-auto">
            <code className="text-text-primary">{`// Using theme context
const { theme, effectiveTheme, setTheme } = useTheme();

// Using theme styles hook
const themeStyles = useThemeStyles();

// Custom CSS with variables
.my-component {
  background-color: var(--color-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

// Tailwind classes
<div className="bg-card text-text-primary border border-border">
  <button className="btn-primary">Click me</button>
</div>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
