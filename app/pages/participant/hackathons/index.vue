<script setup lang="ts">
import { mockHackathons } from "~/data/mock";
import type { HackathonStatus } from "~/types";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Hackathons - ISM Incubator",
});

// State
const filterStatus = ref<HackathonStatus | "all">("all");
const searchQuery = ref("");

// Computed
const filteredHackathons = computed(() => {
  let result = mockHackathons;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (h) =>
        h.title.toLowerCase().includes(query) ||
        h.category.toLowerCase().includes(query),
    );
  }

  if (filterStatus.value !== "all") {
    result = result.filter((h) => h.status === filterStatus.value);
  }

  return result;
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusConfig: Record<
  HackathonStatus,
  {
    label: string;
    variant: "default" | "info" | "success" | "warning" | "error";
  }
> = {
  draft: { label: "Brouillon", variant: "default" },
  upcoming: { label: "A venir", variant: "info" },
  active: { label: "En cours", variant: "success" },
  evaluation: { label: "Evaluation", variant: "warning" },
  completed: { label: "Termine", variant: "default" },
};

function isRegistrationOpen(hackathon: (typeof mockHackathons)[0]) {
  const now = new Date();
  const start = new Date(hackathon.registrationStart);
  const end = new Date(hackathon.registrationEnd);
  return now >= start && now <= end;
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-heading-lg text-primary mb-1">Hackathons</h1>
      <p class="text-body text-gray-500">
        Decouvrez et participez aux hackathons de l'ISM
      </p>
    </div>

    <UiCard class="mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <UiInput
            v-model="searchQuery"
            placeholder="Rechercher par titre ou categorie..."
            type="search"
          >
            <template #prefix>
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </template>
          </UiInput>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in [
              { value: 'all', label: 'Tous' },
              { value: 'upcoming', label: 'A venir' },
              { value: 'active', label: 'En cours' },
              { value: 'completed', label: 'Termines' },
            ]"
            :key="status.value"
            :class="[
              'px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors',
              filterStatus === status.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
            @click="filterStatus = status.value as any"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
    </UiCard>

    <div
      v-if="filteredHackathons.length > 0"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <NuxtLink
        v-for="hackathon in filteredHackathons"
        :key="hackathon.id"
        :to="`/participant/hackathons/${hackathon.id}`"
        class="block group"
      >
        <UiCard
          class="h-full hover:shadow-card-hover transition-all overflow-hidden"
        >
          <div class="h-40 -mx-4 -mt-4 mb-4 bg-gray-100 overflow-hidden">
            <img
              v-if="hackathon.coverImage"
              :src="hackathon.coverImage"
              :alt="hackathon.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg
                class="w-12 h-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div class="flex items-start justify-between gap-2 mb-2">
            <UiBadge variant="default" size="sm">{{
              hackathon.category
            }}</UiBadge>
            <UiBadge
              :variant="statusConfig[hackathon.status].variant"
              size="sm"
              :dot="hackathon.status === 'active'"
            >
              {{ statusConfig[hackathon.status].label }}
            </UiBadge>
          </div>

          <h3
            class="text-body font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors"
          >
            {{ hackathon.title }}
          </h3>

          <p class="text-body-sm text-gray-600 line-clamp-2 mb-4">
            {{ hackathon.shortDescription }}
          </p>

          <div
            class="flex items-center justify-between pt-3 border-t border-neutral-border"
          >
            <div class="text-caption text-gray-500">
              <span
                v-if="isRegistrationOpen(hackathon)"
                class="text-green-600 font-medium"
              >
                Inscriptions ouvertes
              </span>
              <span v-else>
                {{ formatDate(hackathon.registrationStart) }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-caption text-gray-500">
              <span class="flex items-center gap-1">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {{ hackathon.participantCount }}
              </span>
            </div>
          </div>
        </UiCard>
      </NuxtLink>
    </div>

    <UiCard v-else class="text-center py-12">
      <svg
        class="w-16 h-16 mx-auto mb-4 text-gray-300"
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
      <p class="text-body text-gray-500">Aucun hackathon trouve</p>
    </UiCard>
  </div>
</template>
