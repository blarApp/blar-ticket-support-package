<script setup lang="ts">
import { DialogRoot } from 'radix-vue';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
}

withDefaults(defineProps<DialogProps>(), {
  modal: true,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();
</script>

<template>
  <DialogRoot :open="open" :default-open="defaultOpen" :modal="modal" @update:open="emit('update:open', $event)">
    <slot />
  </DialogRoot>
</template>
