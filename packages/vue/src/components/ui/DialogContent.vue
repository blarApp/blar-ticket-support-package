<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from 'radix-vue';
import { X } from 'lucide-vue-next';
import { cn } from '../../lib/cn';

export interface DialogContentProps {
  class?: string;
  showCloseButton?: boolean;
}

const props = withDefaults(defineProps<DialogContentProps>(), {
  showCloseButton: true,
});
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      :class="cn(
        'fixed inset-0 z-50 bg-black/80',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
      )"
      :style="{
        position: 'fixed',
        inset: '0',
        zIndex: '10000',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }"
    />
    <DialogContent
      :class="cn(
        'blario-wrapper fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg gap-4',
        'border bg-background p-6 shadow-lg duration-200',
        'translate-x-[-50%] translate-y-[-50%]',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'sm:rounded-lg',
        props.class
      )"
      :style="{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10001,
        backgroundColor: 'hsl(var(--blario-background))',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        maxWidth: '42rem',
        width: 'calc(100% - 2rem)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }"
    >
      <slot />
      <DialogClose
        v-if="showCloseButton"
        :class="cn(
          'absolute top-4 right-4 rounded-sm opacity-70',
          'ring-offset-background transition-opacity hover:opacity-100',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:pointer-events-none',
          'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
        )"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
