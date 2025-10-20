<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h4">About This Demo</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <h3 class="mb-3">Technology Stack</h3>
            <v-list>
              <v-list-item>
                <v-list-item-title>Vue 3</v-list-item-title>
                <v-list-item-subtitle>Latest version with Composition API</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Vuetify 3</v-list-item-title>
                <v-list-item-subtitle>Material Design component framework</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>@blario/vue</v-list-item-title>
                <v-list-item-subtitle>Issue reporter with standalone CSS</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Vite</v-list-item-title>
                <v-list-item-subtitle>Fast build tool and dev server</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" md="6">
            <h3 class="mb-3">Key Features</h3>
            <v-chip class="ma-1" color="primary">No Tailwind CSS</v-chip>
            <v-chip class="ma-1" color="secondary">Vuetify Integration</v-chip>
            <v-chip class="ma-1" color="success">Standalone CSS Bundle</v-chip>
            <v-chip class="ma-1" color="info">AI Diagnostics</v-chip>
            <v-chip class="ma-1" color="warning">Theme Customization</v-chip>
            <v-chip class="ma-1" color="error">Dark Mode</v-chip>

            <v-alert type="info" class="mt-4">
              This demonstrates that @blario/vue works perfectly with any UI framework,
              not just Tailwind CSS!
            </v-alert>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <h3 class="mb-3">How It Works</h3>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>Installation</v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre class="pa-3 bg-grey-lighten-4">
npm install @blario/vue vue-router vuetify
              </pre>
              <p class="mt-2">No Tailwind CSS dependencies required!</p>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>Setup</v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre class="pa-3 bg-grey-lighten-4">
// main.ts
import '@blario/vue/styles.css';
import 'vuetify/styles';

const app = createApp(App);
app.use(createVuetify());
app.mount('#app');
              </pre>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>Customization</v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre class="pa-3 bg-grey-lighten-4">
/* CSS Variables */
:root {
  --blario-primary: 25 118 210;  /* Match Vuetify */
  --blario-radius: 4px;
}
              </pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
// No imports needed for this static page
</script>
