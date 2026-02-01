<script setup lang="ts">
interface Tab {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

interface Props {
  tabs: Tab[]
  modelValue: string
  variant?: 'default' | 'pills' | 'underline'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const variantClasses = {
  default: {
    container: 'border-b border-neutral-border',
    tab: 'py-3 px-4 -mb-px border-b-2 transition-colors',
    active: 'border-primary text-primary',
    inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
  },
  pills: {
    container: 'bg-gray-100 p-1 rounded-lg',
    tab: 'py-2 px-4 rounded-md transition-all',
    active: 'bg-white text-primary shadow-sm',
    inactive: 'text-gray-600 hover:text-gray-900',
  },
  underline: {
    container: 'space-x-1',
    tab: 'py-2 px-4 border-b-2 transition-colors',
    active: 'border-secondary text-secondary',
    inactive: 'border-transparent text-gray-500 hover:text-gray-700',
  },
}
</script>

<template>
  <div>
    <div :class="['flex', variantClasses[variant].container]">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :disabled="tab.disabled"
        :class="[
          'text-body-sm font-medium whitespace-nowrap',
          variantClasses[variant].tab,
          modelValue === tab.id
            ? variantClasses[variant].active
            : variantClasses[variant].inactive,
          tab.disabled && 'opacity-50 cursor-not-allowed',
        ]"
        @click="!tab.disabled && emit('update:modelValue', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="mt-4">
      <slot :name="modelValue" />
    </div>
  </div>
</template>
