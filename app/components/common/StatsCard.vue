<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "secondary";
}

withDefaults(defineProps<Props>(), {
  variant: "default",
});
</script>

<template>
  <UiCard>
    <div class="flex items-start justify-between">
      <div>
        <p class="text-body-sm text-gray-500 mb-1">{{ title }}</p>
        <p class="text-display-sm font-bold text-primary">{{ value }}</p>
        <div v-if="trend" class="mt-2 flex items-center gap-1">
          <svg
            :class="[
              'w-4 h-4',
              trend.isPositive ? 'text-green-500' : 'text-red-500',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="trend.isPositive"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>
          <span
            :class="[
              'text-caption font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600',
            ]"
          >
            {{ trend.isPositive ? "+" : "" }}{{ trend.value }}%
          </span>
          <span class="text-caption text-gray-400">vs mois dernier</span>
        </div>
      </div>
      <div
        v-if="icon"
        :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center',
          variant === 'primary'
            ? 'bg-primary/10'
            : variant === 'secondary'
              ? 'bg-secondary/10'
              : 'bg-gray-100',
        ]"
      >
        <svg
          v-if="icon === 'folder'"
          :class="[
            'w-6 h-6',
            variant === 'primary'
              ? 'text-primary'
              : variant === 'secondary'
                ? 'text-secondary'
                : 'text-gray-600',
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>

        <svg
          v-if="icon === 'users'"
          :class="[
            'w-6 h-6',
            variant === 'primary'
              ? 'text-primary'
              : variant === 'secondary'
                ? 'text-secondary'
                : 'text-gray-600',
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        <svg
          v-if="icon === 'star'"
          :class="[
            'w-6 h-6',
            variant === 'primary'
              ? 'text-primary'
              : variant === 'secondary'
                ? 'text-secondary'
                : 'text-gray-600',
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>

        <svg
          v-if="icon === 'calendar'"
          :class="[
            'w-6 h-6',
            variant === 'primary'
              ? 'text-primary'
              : variant === 'secondary'
                ? 'text-secondary'
                : 'text-gray-600',
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <svg
          v-if="icon === 'clock'"
          :class="[
            'w-6 h-6',
            variant === 'primary'
              ? 'text-primary'
              : variant === 'secondary'
                ? 'text-secondary'
                : 'text-gray-600',
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <svg
          v-if="icon === 'check'"
          :class="[
            'w-6 h-6',
            variant === 'primary'
              ? 'text-primary'
              : variant === 'secondary'
                ? 'text-secondary'
                : 'text-gray-600',
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  </UiCard>
</template>
