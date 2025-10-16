<template>
  <main class="min-h-screen p-8">
    <DiagnosticBanner />

    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Test Error Boundary</h1>

      <div class="space-y-8">
        <section>
          <h2 class="text-xl font-semibold mb-4">Error Handling</h2>
          <p class="mb-4 text-gray-600">
            Test error boundary integration by triggering errors.
          </p>

          <div class="space-y-4">
            <button
              @click="triggerError"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Trigger Error
            </button>

            <button
              @click="triggerAsyncError"
              class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded ml-2"
            >
              Trigger Async Error
            </button>

            <div v-if="showErrorComponent" class="mt-4">
              <ErrorComponent />
            </div>

            <button
              @click="showErrorComponent = true"
              class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded block mt-2"
            >
              Show Component That Throws
            </button>
          </div>
        </section>

        <section class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h2 class="text-xl font-semibold mb-4">Error Boundary Features</h2>
          <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Automatic error capture in components</li>
            <li>Error stack trace collection</li>
            <li>Automatic issue reporting</li>
            <li>Graceful error recovery</li>
          </ul>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DiagnosticBanner } from '@blario/vue';

const showErrorComponent = ref(false);

const triggerError = () => {
  throw new Error('This is a test error from TestError page');
};

const triggerAsyncError = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  throw new Error('This is an async test error');
};

// Simple error component
const ErrorComponent = {
  setup() {
    throw new Error('This component always throws an error');
  },
  template: '<div>This should never render</div>'
};
</script>
