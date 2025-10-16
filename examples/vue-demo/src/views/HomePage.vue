<template>
  <main class="min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">
        Blario Vue Demo
      </h1>

      <div class="prose dark:prose-invert mb-8">
        <p>
          This is a demo application to test the @blario/vue package components.
        </p>
        <p>
          Try the different features and components available in the SDK:
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 mb-12">
        <router-link
          to="/test-modal"
          class="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          <h2 class="text-xl font-semibold mb-2">Test Modal</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Test the issue reporter modal with different configurations
          </p>
        </router-link>

        <router-link
          to="/test-hook"
          class="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          <h2 class="text-xl font-semibold mb-2">Test Hook</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Test programmatic issue reporting using the useBlario composable
          </p>
        </router-link>

        <router-link
          to="/test-error"
          class="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          <h2 class="text-xl font-semibold mb-2">Test Error Boundary</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Test error boundary integration and error reporting
          </p>
        </router-link>

        <router-link
          to="/test-styles"
          class="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
        >
          <h2 class="text-xl font-semibold mb-2">Test Styles</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Test different button styles and positions
          </p>
        </router-link>

        <router-link
          to="/demo-dashboard"
          class="p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
        >
          <h2 class="text-xl font-semibold mb-2">🚀 Live Dashboard Demo</h2>
          <p class="text-gray-600 dark:text-gray-400">
            Interactive e-commerce dashboard with guided tours (no data-tour-id required!)
          </p>
        </router-link>
      </div>

      <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 class="font-semibold mb-2">Quick Test:</h3>
        <p class="mb-4">
          Click the floating button in the bottom-right corner to open the issue reporter modal.
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Note: The demo is configured with a test project ID. In production, you would use your actual Blario project ID.
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
</script>
