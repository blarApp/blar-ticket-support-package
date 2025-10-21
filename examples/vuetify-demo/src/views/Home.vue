<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title class="text-h4">
            Welcome to Blario + Vuetify Demo
          </v-card-title>
          <v-card-subtitle>
            This demo shows Blario working perfectly with Vuetify (NO Tailwind CSS!)
          </v-card-subtitle>
          <v-card-text>
            <v-alert type="success" variant="tonal" class="mb-4">
              <v-alert-title>No Tailwind Required!</v-alert-title>
              This app uses Vuetify for UI components and Blario's standalone CSS bundle.
              Zero Tailwind dependencies.
            </v-alert>

            <h3 class="mb-2">Test the Issue Reporter:</h3>
            <ol>
              <li>Click the floating bug icon in the bottom-right corner</li>
              <li>Or click "Report Issue" in the app bar</li>
              <li>Or use the button below</li>
            </ol>
          </v-card-text>

          <v-card-actions>
            <IssueReporterButton
              variant="inline"
              class="v-btn"
            >
              <v-btn color="primary" prepend-icon="mdi-bug-outline">
                Open Issue Reporter
              </v-btn>
            </IssueReporterButton>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Features</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item prepend-icon="mdi-check-circle" title="Vuetify Components">
                All standard Vuetify components work perfectly
              </v-list-item>
              <v-list-item prepend-icon="mdi-check-circle" title="Blario Issue Reporter">
                Fully functional issue reporting with AI diagnostics
              </v-list-item>
              <v-list-item prepend-icon="mdi-check-circle" title="No Tailwind CSS">
                Uses Blario's standalone CSS bundle
              </v-list-item>
              <v-list-item prepend-icon="mdi-check-circle" title="Theme Integration">
                Blario colors match Vuetify theme via CSS variables
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Test Actions</v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              block
              class="mb-2"
              @click="triggerError"
            >
              Trigger Test Error
            </v-btn>
            <v-btn
              color="secondary"
              block
              class="mb-2"
              @click="reportProgrammatically"
            >
              Report Issue Programmatically
            </v-btn>
            <v-btn
              color="info"
              block
              @click="testConsoleLog"
            >
              Test Console Logging
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Vuetify Components Demo</v-card-title>
          <v-card-text>
            <v-tabs v-model="tab">
              <v-tab value="one">Buttons</v-tab>
              <v-tab value="two">Forms</v-tab>
              <v-tab value="three">Cards</v-tab>
            </v-tabs>

            <v-window v-model="tab">
              <v-window-item value="one">
                <v-container>
                  <v-btn color="primary" class="mr-2">Primary</v-btn>
                  <v-btn color="secondary" class="mr-2">Secondary</v-btn>
                  <v-btn color="success" class="mr-2">Success</v-btn>
                  <v-btn color="error" class="mr-2">Error</v-btn>
                </v-container>
              </v-window-item>

              <v-window-item value="two">
                <v-container>
                  <v-text-field label="Name" variant="outlined"></v-text-field>
                  <v-text-field label="Email" variant="outlined" type="email"></v-text-field>
                  <v-select
                    label="Select an option"
                    :items="['Option 1', 'Option 2', 'Option 3']"
                    variant="outlined"
                  ></v-select>
                </v-container>
              </v-window-item>

              <v-window-item value="three">
                <v-container>
                  <v-row>
                    <v-col v-for="i in 3" :key="i" cols="12" sm="4">
                      <v-card>
                        <v-card-title>Card {{ i }}</v-card-title>
                        <v-card-text>Sample card content</v-card-text>
                        <v-card-actions>
                          <v-btn color="primary" variant="text">Action</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IssueReporterButton, useBlario } from '@blario/vue';

const tab = ref('one');
const { reportIssue } = useBlario();

const triggerError = () => {
  try {
    throw new Error('Test error from Vuetify demo!');
  } catch (error) {
    console.error('Error caught:', error);
    reportIssue({
      summary: 'Test Error Triggered',
      steps: 'User clicked "Trigger Test Error" button',
      severity: 'medium',
      category: 'test',
      actual: (error as Error).message,
    });
  }
};

const reportProgrammatically = () => {
  reportIssue({
    summary: 'Programmatic issue report',
    steps: 'User clicked programmatic report button',
    expected: 'Should create issue without modal',
    severity: 'low',
    category: 'feedback',
  });
};

const testConsoleLog = () => {
  console.log('Test log message from Vuetify demo');
  console.warn('Test warning message');
  console.error('Test error message');
  alert('Check your console - Blario is capturing these logs!');
};
</script>
