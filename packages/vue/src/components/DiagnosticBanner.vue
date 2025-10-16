<template>
  <div
    v-if="lastDiagnostic && !dismissed"
    class="blario-diagnostic-banner fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white py-3 px-4 shadow-lg"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0">
          <CheckCircle class="h-5 w-5" />
        </div>
        <div>
          <p class="font-medium">Issue reported successfully!</p>
          <p class="text-sm opacity-90">
            Issue ID: {{ lastDiagnostic.issueId }}
          </p>
        </div>
      </div>
      <button
        @click="handleDismiss"
        class="ml-4 p-1 hover:bg-blue-700 rounded transition-colors"
        aria-label="Dismiss"
      >
        <X class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CheckCircle, X } from 'lucide-vue-next';
import { useBlario } from '../composables/useBlario';

const { lastDiagnostic, clearDiagnostic } = useBlario();
const dismissed = ref(false);

const handleDismiss = () => {
  dismissed.value = true;
  clearDiagnostic();
};
</script>

<style scoped>
.blario-diagnostic-banner {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
