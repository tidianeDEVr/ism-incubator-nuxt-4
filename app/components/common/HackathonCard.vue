<script setup lang="ts">
import type { Hackathon, HackathonStatus } from "~/types";

interface Props {
  hackathon: Hackathon;
}

defineProps<Props>();

const statusConfig: Record<
  HackathonStatus,
  { label: string; variant: "success" | "warning" | "info" | "default" }
> = {
  draft: { label: "Brouillon", variant: "default" },
  upcoming: { label: "A venir", variant: "info" },
  active: { label: "En cours", variant: "success" },
  evaluation: { label: "Evaluation", variant: "warning" },
  completed: { label: "Termine", variant: "default" },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
</script>

<template>
  <NuxtLink :to="`/hackathons/${hackathon.slug}`" class="group block">
    <UiCard variant="outlined" padding="none" hoverable class="overflow-hidden">
      <div class="relative h-48 bg-primary/5 overflow-hidden">
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"
        />
        <div
          v-if="hackathon.coverImage"
          class="absolute inset-0 bg-cover bg-top bg-no-repeat"
          :style="{ backgroundImage: `url(${hackathon.coverImage})` }"
        />

        <div class="absolute top-4 right-4">
          <UiBadge :variant="statusConfig[hackathon.status].variant" dot>
            {{ statusConfig[hackathon.status].label }}
          </UiBadge>
        </div>
      </div>

      <div class="p-6">
        <div class="text-body-sm text-secondary font-medium mb-2">
          {{ hackathon.category }}
        </div>

        <h3
          class="text-heading-sm text-primary mb-2 group-hover:text-secondary transition-colors duration-200"
        >
          {{ hackathon.title }}
        </h3>

        <p class="text-body-sm text-gray-600 mb-4 line-clamp-2">
          {{ hackathon.shortDescription }}
        </p>

        <div class="flex items-center gap-4 text-body-sm text-gray-500 mb-4">
          <div class="flex items-center gap-1.5">
            <svg
              class="w-4 h-4"
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
            {{ formatDate(hackathon.submissionStart) }}
          </div>
          <div class="flex items-center gap-1.5">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ hackathon.participantCount }} participants
          </div>
        </div>

        <div
          v-if="hackathon.prizes.length > 0"
          class="flex items-center gap-2 pt-4 border-t border-neutral-border"
        >
          <svg
            class="w-5 h-5 text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-body-sm font-semibold text-primary">
            {{ hackathon.prizes[0]?.value }}
          </span>
          <span class="text-body-sm text-gray-500"> a gagner </span>
        </div>
      </div>
    </UiCard>
  </NuxtLink>
</template>
