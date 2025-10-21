<script setup lang="ts">
import { DialogTitle } from 'radix-vue';
import { cn } from '../../lib/cn';

export interface DialogTitleProps {
  class?: string;
}

const props = defineProps<DialogTitleProps>();
</script>

<template>
  <DialogTitle :class="cn('text-lg leading-none font-semibold text-foreground', props.class)">
    <slot />
  </DialogTitle>
</template>
