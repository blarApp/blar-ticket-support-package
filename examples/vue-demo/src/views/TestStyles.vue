<template>
  <main class="min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Test Button Styles</h1>

      <div class="space-y-8">
        <section>
          <h2 class="text-xl font-semibold mb-4">Button Variants</h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold mb-2">Floating (Default)</h3>
              <p class="text-gray-600 mb-2">
                Button appears fixed in the bottom-right corner
              </p>
              <IssueReporterButton variant="floating" />
            </div>

            <div>
              <h3 class="font-semibold mb-2">Inline</h3>
              <p class="text-gray-600 mb-2">
                Button appears inline with content
              </p>
              <IssueReporterButton variant="inline">
                Inline Report Button
              </IssueReporterButton>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">Custom Styles</h2>
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold mb-2">Custom Colors</h3>
              <div class="flex gap-2 flex-wrap">
                <IssueReporterButton
                  variant="inline"
                  class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Purple Button
                </IssueReporterButton>

                <IssueReporterButton
                  variant="inline"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Green Button
                </IssueReporterButton>

                <IssueReporterButton
                  variant="inline"
                  class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                >
                  Orange Button
                </IssueReporterButton>
              </div>
            </div>

            <div>
              <h3 class="font-semibold mb-2">Different Sizes</h3>
              <div class="flex gap-2 items-center flex-wrap">
                <IssueReporterButton
                  variant="inline"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                >
                  Small
                </IssueReporterButton>

                <IssueReporterButton
                  variant="inline"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Medium
                </IssueReporterButton>

                <IssueReporterButton
                  variant="inline"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded text-lg"
                >
                  Large
                </IssueReporterButton>
              </div>
            </div>

            <div>
              <h3 class="font-semibold mb-2">Outline Style</h3>
              <IssueReporterButton
                variant="inline"
                class="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded"
              >
                Outline Button
              </IssueReporterButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { IssueReporterButton } from '@blario/vue';
</script>
