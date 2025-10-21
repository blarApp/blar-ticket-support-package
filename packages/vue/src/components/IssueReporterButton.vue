<template>
  <button
    v-if="unstyled"
    :class="unstyledClasses"
    :aria-label="ariaLabel"
    data-tour-id="issue-reporter-button"
    @click="handleClick"
  >
    <slot>
      <Bug v-if="!hideIcon" :class="iconClass" />
      <span v-if="!hideText" :class="textClassName">{{ children || DEFAULT_TEXT }}</span>
    </slot>
  </button>

  <button
    v-else-if="variant === 'inline'"
    :class="inlineClasses"
    :aria-label="ariaLabel"
    data-tour-id="issue-reporter-button"
    @click="handleClick"
  >
    <slot>
      <Bug v-if="!hideIcon" :class="iconClass" />
      <span v-if="!hideText" :class="textClassName">{{ children || DEFAULT_TEXT }}</span>
    </slot>
  </button>

  <button
    v-else
    :class="floatingClasses"
    :aria-label="ariaLabel"
    data-tour-id="issue-reporter-button"
    @click="handleClick"
  >
    <slot>
      <Bug v-if="!hideIcon" :class="iconClass" />
      <span v-if="!hideText && !defaultHideText" :class="textClassName">{{ children || DEFAULT_TEXT }}</span>
    </slot>
  </button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { Bug } from 'lucide-vue-next';
import { useBlario } from '../composables/useBlario';
import { BlarioKey } from '../plugin/BlarioPlugin';
import { cn } from '../lib/cn';

// Types
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
export type ButtonPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type ButtonDisplayVariant = 'floating' | 'inline';

export interface IssueReporterButtonProps {
  variant?: ButtonDisplayVariant;
  position?: ButtonPosition;
  unstyled?: boolean;
  className?: string;
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  children?: string;
  icon?: any;
  iconClassName?: string;
  textClassName?: string;
  hideIcon?: boolean;
  hideText?: boolean;
  category?: string;
  prefill?: Record<string, any>;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<IssueReporterButtonProps>(), {
  variant: 'floating',
  unstyled: false,
  hideIcon: false,
  hideText: false,
  ariaLabel: 'Report an issue',
});

// Constants
const POSITION_CLASSES: Record<ButtonPosition, string> = {
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
};

const DEFAULT_FLOATING_CLASSES = 'fixed z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all';
const DEFAULT_ICON_SIZE = 'h-6 w-6';
const DEFAULT_TEXT = 'Report Issue';

const { openReporter } = useBlario();
const blario = inject(BlarioKey);

const finalPosition = computed(() =>
  props.position ?? blario?.state.config.theme?.position ?? 'bottom-right'
);

const defaultHideText = computed(() =>
  props.variant === 'floating' && props.hideText === undefined
);

const iconClass = computed(() =>
  props.iconClassName || DEFAULT_ICON_SIZE
);

const unstyledClasses = computed(() =>
  cn(
    props.variant === 'floating' ? `fixed z-50 ${POSITION_CLASSES[finalPosition.value]}` : undefined,
    props.className
  )
);

const inlineClasses = computed(() =>
  cn('blario-button-inline', props.className)
);

const floatingClasses = computed(() =>
  cn(
    DEFAULT_FLOATING_CLASSES,
    POSITION_CLASSES[finalPosition.value],
    blario?.state.config.theme?.accent && `bg-[${blario.state.config.theme.accent}]`,
    props.className
  )
);

const handleClick = () => {
  openReporter({
    category: props.category,
    prefill: props.prefill
  });
};
</script>
