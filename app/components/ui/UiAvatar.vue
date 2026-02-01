<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
}

const initials = computed(() => {
  if (!props.name) return '?'
  const names = props.name.trim().split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
  }
  return names[0].substring(0, 2).toUpperCase()
})

const bgColor = computed(() => {
  if (!props.name) return 'bg-gray-400'
  // Generate consistent color based on name
  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ]
  const hash = props.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
})
</script>

<template>
  <div
    :class="[
      'rounded-full flex items-center justify-center overflow-hidden flex-shrink-0',
      sizeClasses[size],
    ]"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt || name || 'Avatar'"
      class="w-full h-full object-cover"
    />
    <span
      v-else
      :class="[bgColor, 'w-full h-full flex items-center justify-center text-white font-medium']"
    >
      {{ initials }}
    </span>
  </div>
</template>
