<template>
  <main class="min-h-screen p-8">
    <DiagnosticBanner />

    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Test useBlario Composable</h1>

      <div class="space-y-8">
        <section>
          <h2 class="text-xl font-semibold mb-4">Composable Methods</h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold mb-2">openReporter()</h3>
              <p class="text-gray-600 mb-2">
                Open the reporter modal programmatically
              </p>
              <button
                @click="() => openReporter({ category: 'feature-request' })"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Open Reporter with Category
              </button>
            </div>

            <div>
              <h3 class="font-semibold mb-2">reportIssue()</h3>
              <p class="text-gray-600 mb-2">
                Submit an issue without opening the modal
              </p>
              <button
                @click="handleProgrammaticReport"
                :disabled="isSubmitting"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {{ isSubmitting ? 'Submitting...' : 'Report Issue Programmatically' }}
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Error Reporting</h2>
          <div class="space-y-4">
            <div>
              <label class="block mb-2">
                Custom error message:
                <input
                  v-model="customError"
                  type="text"
                  placeholder="Enter error message"
                  class="mt-1 block w-full px-3 py-2 border rounded-md"
                />
              </label>
              <button
                @click="handleErrorReport"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Report Custom Error
              </button>
            </div>

            <div>
              <h3 class="font-semibold mb-2">Generate Console Logs</h3>
              <p class="text-gray-600 mb-2">
                Generate some console logs that will be captured
              </p>
              <button
                @click="simulateConsoleErrors"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Generate Console Errors
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Composable State</h2>
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <dl class="space-y-2">
              <div>
                <dt class="font-semibold">isSubmitting:</dt>
                <dd>{{ isSubmitting ? 'Yes' : 'No' }}</dd>
              </div>
              <div>
                <dt class="font-semibold">lastDiagnostic:</dt>
                <dd>
                  <pre v-if="lastDiagnostic" class="text-sm bg-white dark:bg-gray-800 p-2 rounded mt-1 overflow-auto">{{ JSON.stringify(lastDiagnostic, null, 2) }}</pre>
                  <span v-else>None</span>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBlario, DiagnosticBanner } from '@blario/vue';

const { openReporter, reportIssue, lastDiagnostic, isSubmitting } = useBlario();
const customError = ref('');

const handleProgrammaticReport = async () => {
  try {
    const result = await reportIssue({
      summary: 'Programmatically reported issue',
      steps: 'This issue was reported using the useBlario composable',
      severity: 'medium',
      category: 'test',
    });

    if (result) {
      console.log('Issue reported successfully:', result);
    }
  } catch (error) {
    console.error('Failed to report issue:', error);
  }
};

const handleErrorReport = async () => {
  try {
    // Simulate an error
    throw new Error(customError.value || 'This is a simulated error for testing');
  } catch (error: any) {
    await reportIssue({
      summary: `Error: ${error.message}`,
      steps: error.stack || 'No stack trace available',
      severity: 'high',
      category: 'error',
      actual: error.message,
    });
  }
};

const simulateConsoleErrors = () => {
  console.error('This is a test error message');
  console.warn('This is a test warning');
  console.log('Normal log message');
  console.error(new Error('Test error with stack trace'));
};
</script>
