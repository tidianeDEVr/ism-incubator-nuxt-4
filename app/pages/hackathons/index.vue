<script setup lang="ts">
import { mockHackathons } from "~/data/mock";
import type { HackathonStatus } from "~/types";

useHead({
  title: "Hackathons - ISM Incubator",
  meta: [
    {
      name: "description",
      content:
        "Decouvrez tous les hackathons de l'incubateur ISM. Participez a des competitions innovantes et developpez vos projets.",
    },
  ],
});

const selectedStatus = ref<HackathonStatus | "all">("all");
const searchQuery = ref("");

const statusOptions = [
  { value: "all", label: "Tous" },
  { value: "active", label: "En cours" },
  { value: "upcoming", label: "A venir" },
  { value: "evaluation", label: "Evaluation" },
  { value: "completed", label: "Termines" },
];

const filteredHackathons = computed(() => {
  return mockHackathons.filter((hackathon) => {
    const matchesStatus =
      selectedStatus.value === "all" ||
      hackathon.status === selectedStatus.value;
    const matchesSearch =
      searchQuery.value === "" ||
      hackathon.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      hackathon.category
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
    return matchesStatus && matchesSearch;
  });
});

const activeCount = computed(
  () => mockHackathons.filter((h) => h.status === "active").length,
);
const upcomingCount = computed(
  () => mockHackathons.filter((h) => h.status === "upcoming").length,
);
</script>

<template>
  <div>
    <section class="bg-primary py-12 lg:py-16">
      <div class="container-padded">
        <div class="max-w-2xl">
          <h1 class="text-display-sm text-white mb-4">Hackathons</h1>
          <p class="text-body-lg text-white/70">
            Participez a nos competitions d'innovation et transformez vos idees
            en projets concrets. Rejoignez une communaute de createurs
            passionnes.
          </p>
        </div>

        <div class="flex gap-8 mt-8">
          <div>
            <div class="text-heading text-secondary font-bold">
              {{ activeCount }}
            </div>
            <div class="text-body-sm text-white/60">En cours</div>
          </div>
          <div>
            <div class="text-heading text-secondary font-bold">
              {{ upcomingCount }}
            </div>
            <div class="text-body-sm text-white/60">A venir</div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="py-6 border-b border-neutral-border bg-white sticky top-16 lg:top-20 z-40"
    >
      <div class="container-padded">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un hackathon..."
                class="w-full pl-10 pr-4 py-2.5 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              v-for="option in statusOptions"
              :key="option.value"
              :class="[
                'px-4 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors duration-200',
                selectedStatus === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
              @click="selectedStatus = option.value as HackathonStatus | 'all'"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 lg:py-16">
      <div class="container-padded">
        <div
          v-if="filteredHackathons.length > 0"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <HackathonCard
            v-for="hackathon in filteredHackathons"
            :key="hackathon.id"
            :hackathon="hackathon"
          />
        </div>

        <div v-else class="text-center py-16">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-heading-sm text-gray-900 mb-2">
            Aucun hackathon trouve
          </h3>
          <p class="text-body text-gray-500 mb-6">
            Essayez de modifier vos filtres ou votre recherche
          </p>
          <UiButton
            variant="outline"
            @click="
              selectedStatus = 'all';
              searchQuery = '';
            "
          >
            Reinitialiser les filtres
          </UiButton>
        </div>
      </div>
    </section>
  </div>
</template>
