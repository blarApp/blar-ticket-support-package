'use client';

import { useState, useEffect } from 'react';
import { useBlario } from '@blario/nextjs';

export default function TestDarkMode() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { openReporter } = useBlario();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Trigger storage event for other tabs/components
    window.dispatchEvent(new Event('storage'));

    // Force a page reload to apply theme changes
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Dark Mode Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Current theme: <span className="font-semibold">{theme}</span>
          </p>
          <button
            onClick={toggleTheme}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Toggle Theme
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => openReporter()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Open Blario Reporter
          </button>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Test Card
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This card should change appearance in dark mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}