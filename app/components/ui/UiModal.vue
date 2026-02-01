<script setup lang="ts">
interface Props {
  modelValue?: boolean;
  open?: boolean;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  persistent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  open: undefined,
  size: "md",
  closable: true,
  persistent: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "update:open": [value: boolean];
  close: [];
}>();

const isOpen = computed(() => props.modelValue ?? props.open ?? false);

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full mx-4",
};

function close() {
  if (props.closable) {
    emit("update:modelValue", false);
    emit("update:open", false);
    emit("close");
  }
}

function onBackdropClick() {
  if (!props.persistent) {
    close();
  }
}

onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (
      e.key === "Escape" &&
      isOpen.value &&
      props.closable &&
      !props.persistent
    ) {
      close();
    }
  };
  document.addEventListener("keydown", handleEscape);
  onUnmounted(() => {
    document.removeEventListener("keydown", handleEscape);
  });
});

watch(isOpen, (open) => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="onBackdropClick"
        />

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="isOpen"
              :class="[
                'relative w-full bg-white rounded-2xl shadow-modal',
                sizeClasses[size],
              ]"
              @click.stop
            >
              <!-- Header -->
              <div
                v-if="title || closable"
                class="flex items-center justify-between p-5 border-b border-neutral-border"
              >
                <h3 v-if="title" class="text-heading-sm text-primary">
                  {{ title }}
                </h3>
                <button
                  v-if="closable"
                  type="button"
                  class="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  @click="close"
                >
                  <span class="sr-only">Fermer</span>
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Body -->
              <div class="p-5 max-h-[600px] overflow-y-auto">
                <slot />
              </div>

              <!-- Footer -->
              <div
                v-if="$slots.footer"
                class="flex items-center justify-end gap-3 p-5 border-t border-neutral-border"
              >
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
