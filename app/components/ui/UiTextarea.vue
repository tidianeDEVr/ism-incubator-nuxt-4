<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  rows: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.id || `textarea-${Math.random().toString(36).slice(2, 9)}`)

const textareaClasses = computed(() => [
  'w-full px-4 py-2.5 text-body rounded-lg border transition-colors duration-200 resize-none',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  'placeholder:text-gray-400',
  props.error
    ? 'border-status-error focus:border-status-error focus:ring-status-error/30'
    : 'border-neutral-border focus:border-primary focus:ring-primary/30',
  props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white',
])

function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="block text-body-sm font-medium text-gray-700 mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-status-error">*</span>
    </label>

    <textarea
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="textareaClasses"
      @input="onInput"
    />

    <p
      v-if="error"
      class="mt-1.5 text-body-sm text-status-error"
    >
      {{ error }}
    </p>

    <p
      v-else-if="hint"
      class="mt-1.5 text-body-sm text-gray-500"
    >
      {{ hint }}
    </p>
  </div>
</template>
