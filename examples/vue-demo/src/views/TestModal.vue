<template>
  <main class="min-h-screen p-8">
    <DiagnosticBanner />

    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Test Issue Reporter Modal</h1>

      <div class="space-y-8">
        <section>
          <h2 class="text-xl font-semibold mb-4">Floating Button (Default)</h2>
          <p class="mb-4 text-gray-600">
            The default floating button appears in the bottom-right corner.
          </p>
          <IssueReporterButton />
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Inline Button</h2>
          <p class="mb-4 text-gray-600">
            You can also use an inline button within your content.
          </p>
          <IssueReporterButton variant="inline">
            Report an Issue
          </IssueReporterButton>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Button with Category</h2>
          <p class="mb-4 text-gray-600">
            Pre-fill the category when opening the modal.
          </p>
          <IssueReporterButton
            variant="inline"
            category="ui-bug"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Report UI Bug
          </IssueReporterButton>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Button with Pre-filled Data</h2>
          <p class="mb-4 text-gray-600">
            Pre-fill form data when opening the modal.
          </p>
          <IssueReporterButton
            variant="inline"
            category="performance"
            :prefill="{
              summary: 'Performance issue on this page',
              severity: 'medium',
              steps: '1. Navigate to test-modal page\n2. Observe slow loading',
            }"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Report Performance Issue
          </IssueReporterButton>
        </section>

        <section class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h2 class="text-xl font-semibold mb-4">Modal Features</h2>
          <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Form validation (summary is required)</li>
            <li>File attachments (up to 3 images)</li>
            <li>Severity selection</li>
            <li>Auto-capture of browser context</li>
            <li>Console log capture (if errors occurred)</li>
            <li>Network request sampling (configurable)</li>
          </ul>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { IssueReporterButton, DiagnosticBanner } from '@blario/vue';
</script>
