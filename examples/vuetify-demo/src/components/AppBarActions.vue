<template>
  <v-btn variant="text" @click="handleReportClick">
    <v-icon left>mdi-bug</v-icon>
    Report Issue
  </v-btn>
</template>

<script setup lang="ts">
import { useBlario } from '@blario/vue';

// This works because AppBarActions is a CHILD of BlarioProvider
const { openReporter } = useBlario();

const handleReportClick = () => {
  openReporter({
    category: 'app-bar',
    prefill: {
      summary: 'Issue reported from app bar',
    },
  });
};
</script>
