<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false,
})

const variantClasses = {
  default: 'bg-white shadow-card',
  elevated: 'bg-white shadow-card-hover',
  outlined: 'bg-white border border-neutral-border',
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const cardClasses = computed(() => [
  'rounded-xl',
  variantClasses[props.variant],
  paddingClasses[props.padding],
  props.hoverable ? 'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer' : '',
])
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>
