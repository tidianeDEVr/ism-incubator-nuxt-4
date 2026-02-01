<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  type: 'button',
})

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary/30',
  secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary/30',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/30',
  ghost: 'text-primary hover:bg-primary/10 focus:ring-primary/30',
  danger: 'bg-status-error text-white hover:bg-red-600 focus:ring-red-500/30',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-body-sm gap-1.5',
  md: 'px-4 py-2.5 text-body gap-2',
  lg: 'px-6 py-3 text-body-lg gap-2.5',
}

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.fullWidth ? 'w-full' : '',
])

const component = computed(() => props.href ? resolveComponent('NuxtLink') : 'button')
</script>

<template>
  <component
    :is="component"
    :type="!href ? type : undefined"
    :to="href || undefined"
    :disabled="disabled || loading"
    :class="buttonClasses"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </component>
</template>
