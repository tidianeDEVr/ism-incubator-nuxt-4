<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary'
  size?: 'sm' | 'md'
  outline?: boolean
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  outline: false,
  dot: false,
})

const baseClasses = 'inline-flex items-center font-medium rounded-full'

const solidVariants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
}

const outlineVariants = {
  default: 'border border-gray-300 text-gray-700',
  success: 'border border-green-500 text-green-700',
  warning: 'border border-amber-500 text-amber-700',
  error: 'border border-red-500 text-red-700',
  info: 'border border-blue-500 text-blue-700',
  primary: 'border border-primary text-primary',
  secondary: 'border border-secondary text-secondary',
}

const dotColors = {
  default: 'bg-gray-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

const badgeClasses = computed(() => [
  baseClasses,
  props.outline ? outlineVariants[props.variant] : solidVariants[props.variant],
  sizeClasses[props.size],
])
</script>

<template>
  <span :class="badgeClasses">
    <span
      v-if="dot"
      :class="['w-1.5 h-1.5 rounded-full mr-1.5', dotColors[variant]]"
    />
    <slot />
  </span>
</template>
