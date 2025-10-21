<script setup lang="ts">
import { DialogDescription } from 'radix-vue';
import { cn } from '../../lib/cn';

export interface DialogDescriptionProps {
  class?: string;
}

const props = defineProps<DialogDescriptionProps>();
</script>

<template>
  <DialogDescription :class="cn('text-muted-foreground text-sm', props.class)">
    <slot />
  </DialogDescription>
</template>
