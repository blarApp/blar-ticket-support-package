<template>
  <BlarioProvider
    :publishable-key="publishableKey"
    locale="en"
    :user="user"
    :capture="captureConfig"
    @after-submit="handleAfterSubmit"
    @error="handleError"
  >
    <v-app>
      <v-app-bar color="primary" prominent>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Blario + Vuetify Demo</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleTheme">
          <v-icon>{{ theme.global.name.value === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
        </v-btn>
        <AppBarActions />
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" temporary>
        <v-list>
          <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>
          <v-list-item prepend-icon="mdi-information" title="About" to="/about"></v-list-item>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/dashboard"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <DiagnosticBanner />
        <router-view />
      </v-main>

      <!-- Blario floating button (bottom-right) -->
      <IssueReporterButton />
    </v-app>
  </BlarioProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { BlarioProvider, IssueReporterButton, DiagnosticBanner } from '@blario/vue';
import AppBarActions from './components/AppBarActions.vue';

const publishableKey = import.meta.env.VITE_BLARIO_PUBLISHABLE_KEY;
const drawer = ref(false);
const theme = useTheme();

const user = {
  id: 'user-vuetify-123',
  email: 'vuetify.user@example.com',
  name: 'Vuetify User',
};

const captureConfig = {
  console: true,
  networkSample: false,
  maxConsoleLogs: 50,
};

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
};

const handleAfterSubmit = (issueId: string) => {
  console.log('Issue submitted successfully:', issueId);
};

const handleError = (error: Error) => {
  console.error('Blario error:', error);
};
</script>

<style>
/* Customize Blario to match Vuetify theme */
:root {
  --blario-primary: 25 118 210;              /* Vuetify blue #1976D2 */
  --blario-primary-foreground: 0 0% 100%;
  --blario-radius: 4px;                       /* Vuetify border radius */
}

/* No Tailwind CSS required! */
</style>
