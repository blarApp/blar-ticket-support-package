'use client';

import { BlarioProvider, TourProvider, ChatWidget } from '@blario/nextjs';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode | React.ReactNode[] }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Listen for theme changes from localStorage or system preference
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Check system preference
      setTheme('dark');
    }

    // Listen for theme changes
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (newTheme) {
        setTheme(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BlarioProvider
      publishableKey={process.env.NEXT_PUBLIC_BLARIO_PUBLISHABLE_KEY!}
      apiBaseUrl="http://localhost:8000"
      locale="es"
      user={{
        id: 'demo-user-123',
        email: 'demo@example.com',
        name: 'Demo User'
      }}
      capture={{
        console: true,
        networkSample: true,
        maxConsoleLogs: 100,
        maxNetworkLogs: 50,
      }}
      theme={{
        mode: theme
      }}
      onAfterSubmit={(issueId) => {
        console.log('Issue submitted with ID:', issueId);
      }}
      onError={(error) => {
        console.error('Blario error:', error);
      }}
    >
      <TourProvider>
        {children}
        <ChatWidget />
      </TourProvider>
    </BlarioProvider>
  );
}