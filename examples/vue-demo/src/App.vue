<template>
  <BlarioProvider
    :publishable-key="publishableKey"
    api-base-url="http://localhost:8000"
    locale="es"
    :user="user"
    :capture="capture"
    :theme="{ mode: theme }"
    @after-submit="handleAfterSubmit"
    @error="handleError"
  >
    <TourProvider>
      <router-view />
      <ChatWidget />
    </TourProvider>
  </BlarioProvider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BlarioProvider, TourProvider, ChatWidget } from '@blario/vue';

const publishableKey = import.meta.env.VITE_BLARIO_PUBLISHABLE_KEY || '';
const theme = ref<'light' | 'dark'>('light');

const user = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  name: 'Demo User'
};

const capture = {
  console: true,
  networkSample: true,
  maxConsoleLogs: 100,
  maxNetworkLogs: 50,
};

onMounted(() => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  if (savedTheme) {
    theme.value = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Check system preference
    theme.value = 'dark';
  }

  // Listen for theme changes
  const handleStorageChange = () => {
    const newTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (newTheme) {
      theme.value = newTheme;
    }
  };

  window.addEventListener('storage', handleStorageChange);

  return () => window.removeEventListener('storage', handleStorageChange);
});

const handleAfterSubmit = (issueId: string) => {
  console.log('Issue submitted with ID:', issueId);
};

const handleError = (error: Error) => {
  console.error('Blario error:', error);
};
</script>
