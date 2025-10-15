<template>
  <div class="blario-root">
    <slot />
    <IssueReporterModal />
  </div>
</template>

<script setup lang="ts">
import IssueReporterModal from './IssueReporterModal.vue';
</script>
