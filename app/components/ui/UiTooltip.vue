<script setup lang="ts">
interface Props {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 0,
})
</script>

<template>
  <div class="ui-tooltip-wrapper">
    <slot />
    <div
      :class="[
        'ui-tooltip',
        `ui-tooltip--${position}`,
      ]"
      :style="{ '--tooltip-delay': `${delay}ms` }"
    >
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
.ui-tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.ui-tooltip {
  position: absolute;
  z-index: 50;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background-color: #1f2937;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 150ms ease,
    transform 150ms ease;
  transition-delay: var(--tooltip-delay, 0ms);
}

.ui-tooltip-wrapper:hover .ui-tooltip {
  opacity: 1;
}

/* Positions */
.ui-tooltip--top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  margin-bottom: 4px;
}

.ui-tooltip--bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  margin-top: 4px;
}

.ui-tooltip--left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(-4px);
  margin-right: 4px;
}

.ui-tooltip--right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(4px);
  margin-left: 4px;
}

/* Hover animations */
.ui-tooltip-wrapper:hover .ui-tooltip--top {
  transform: translateX(-50%) translateY(0);
}

.ui-tooltip-wrapper:hover .ui-tooltip--bottom {
  transform: translateX(-50%) translateY(0);
}

.ui-tooltip-wrapper:hover .ui-tooltip--left {
  transform: translateY(-50%) translateX(0);
}

.ui-tooltip-wrapper:hover .ui-tooltip--right {
  transform: translateY(-50%) translateX(0);
}
</style>
