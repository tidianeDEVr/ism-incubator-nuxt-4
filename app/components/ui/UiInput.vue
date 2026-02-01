<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const slots = useSlots()

const autoId = useId()
const inputId = computed(() => props.id || `input-${autoId}`)

const hasPrefix = computed(() => !!slots.prefix)
const hasSuffix = computed(() => !!slots.suffix)

const inputClasses = computed(() => [
  'w-full py-2.5 text-body rounded-lg border transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  'placeholder:text-gray-400',
  hasPrefix.value ? 'pl-11' : 'pl-4',
  hasSuffix.value ? 'pr-11' : 'pr-4',
  props.error
    ? 'border-status-error focus:border-status-error focus:ring-status-error/30'
    : 'border-neutral-border focus:border-primary focus:ring-primary/30',
  props.disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'bg-white',
])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
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

    <div class="relative">
      <div
        v-if="hasPrefix"
        class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="onInput"
      >

      <div
        v-if="hasSuffix"
        class="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <slot name="suffix" />
      </div>
    </div>

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
