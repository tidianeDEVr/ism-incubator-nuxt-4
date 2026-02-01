<script setup lang="ts">
import { mockHackathons } from "~/data/mock";

const displayedHackathons = computed(() => {
  return mockHackathons
    .filter((h) => h.status === "active" || h.status === "upcoming")
    .slice(0, 3);
});
</script>

<template>
  <section class="py-16 lg:py-24">
    <div class="container-padded">
      <div
        class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
      >
        <div>
          <h2 class="text-display-sm text-primary mb-2">Hackathons a venir</h2>
          <p class="text-body-lg text-gray-600">
            Decouvrez nos prochains evenements et inscrivez-vous
          </p>
        </div>
        <UiButton variant="outline" href="/hackathons">
          Voir tous les hackathons
        </UiButton>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <HackathonCard
          v-for="hackathon in displayedHackathons"
          :key="hackathon.id"
          :hackathon="hackathon"
        />
      </div>

      <div v-if="displayedHackathons.length === 0" class="text-center py-16">
        <div
          class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-8 h-8 text-gray-400"
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
        </div>
        <h3 class="text-heading-sm text-gray-900 mb-2">
          Aucun hackathon prevu
        </h3>
        <p class="text-body text-gray-500">
          Revenez bientot pour decouvrir nos prochains evenements
        </p>
      </div>
    </div>
  </section>
</template>
