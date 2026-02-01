<script setup lang="ts">
import { mockHackathons, mockProjects } from "~/data/mock";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Dashboard Participant - ISM Incubator",
});

// Mock current user ID
const currentUserId = "user-p1";

// Get user's projects
const myProjects = computed(() =>
  mockProjects.filter((p) => p.members.some((m) => m.userId === currentUserId)),
);

// Get active hackathons
const activeHackathons = computed(() =>
  mockHackathons.filter(
    (h) => h.status === "active" || h.status === "upcoming",
  ),
);

const stats = computed(() => [
  {
    title: "Mes Projets",
    value: myProjects.value.length,
    icon: "folder",
    variant: "primary" as const,
  },
  {
    title: "En evaluation",
    value: myProjects.value.filter(
      (p) => p.status === "evaluation" || p.status === "submitted",
    ).length,
    icon: "clock",
    variant: "secondary" as const,
  },
  {
    title: "Finaliste",
    value: myProjects.value.filter(
      (p) => p.status === "finalist" || p.status === "winner",
    ).length,
    icon: "star",
    variant: "default" as const,
  },
  {
    title: "Hackathons actifs",
    value: activeHackathons.value.length,
    icon: "calendar",
    variant: "default" as const,
  },
]);

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

const statusConfig: Record<string, { label: string; class: string }> = {
  draft: { label: "Brouillon", class: "bg-gray-100 text-gray-700" },
  submitted: { label: "Soumis", class: "bg-blue-100 text-blue-700" },
  evaluation: { label: "En evaluation", class: "bg-amber-100 text-amber-700" },
  finalist: { label: "Finaliste", class: "bg-purple-100 text-purple-700" },
  winner: { label: "Gagnant", class: "bg-green-100 text-green-700" },
};
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-heading-lg text-primary mb-1">Bienvenue, Amadou</h1>
      <p class="text-body text-gray-500">
        Suivez vos projets et participez aux hackathons
      </p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      <StatsCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :variant="stat.variant"
      />
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <UiCard>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-heading-sm text-primary">Mes Projets</h2>
            <UiButton variant="ghost" size="sm" href="/participant/projects">
              Voir tout
            </UiButton>
          </div>

          <div v-if="myProjects.length > 0" class="space-y-3">
            <NuxtLink
              v-for="project in myProjects.slice(0, 3)"
              :key="project.id"
              :to="`/participant/projects/${project.id}`"
              class="block p-4 rounded-lg border border-neutral-border hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div class="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 class="text-body font-medium text-gray-900">
                    {{ project.title }}
                  </h3>
                  <p class="text-caption text-gray-500">
                    {{
                      mockHackathons.find((h) => h.id === project.hackathonId)
                        ?.title
                    }}
                  </p>
                </div>
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    statusConfig[project.status]?.class,
                  ]"
                >
                  {{ statusConfig[project.status]?.label }}
                </span>
              </div>
              <p class="text-body-sm text-gray-600 line-clamp-2">
                {{ project.description }}
              </p>
            </NuxtLink>
          </div>

          <div v-else class="text-center py-8">
            <svg
              class="w-12 h-12 mx-auto mb-3 text-gray-300"
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
            <p class="text-body-sm text-gray-500 mb-4">
              Vous n'avez pas encore de projet
            </p>
            <UiButton
              variant="secondary"
              size="sm"
              href="/participant/hackathons"
            >
              Participer a un hackathon
            </UiButton>
          </div>
        </UiCard>
      </div>

      <div class="space-y-6">
        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Actions rapides</h2>
          <div class="space-y-3">
            <UiButton
              variant="secondary"
              full-width
              href="/participant/hackathons"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Rejoindre un hackathon
            </UiButton>
            <UiButton variant="outline" full-width href="/participant/projects">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Gerer mes projets
            </UiButton>
            <UiButton variant="outline" full-width href="/participant/messages">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Mes messages
            </UiButton>
          </div>
        </UiCard>

        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Hackathons a venir</h2>
          <div v-if="activeHackathons.length > 0" class="space-y-3">
            <NuxtLink
              v-for="hackathon in activeHackathons.slice(0, 3)"
              :key="hackathon.id"
              :to="`/participant/hackathons/${hackathon.id}`"
              class="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="text-body-sm font-medium text-gray-900">{{
                  hackathon.title
                }}</span>
                <UiBadge
                  :variant="hackathon.status === 'active' ? 'success' : 'info'"
                  size="sm"
                  :dot="hackathon.status === 'active'"
                >
                  {{ hackathon.status === "active" ? "En cours" : "A venir" }}
                </UiBadge>
              </div>
              <div class="text-caption text-gray-500">
                Inscriptions: {{ formatDate(hackathon.registrationStart) }} -
                {{ formatDate(hackathon.registrationEnd) }}
              </div>
            </NuxtLink>
          </div>
          <div v-else class="text-center py-4 text-body-sm text-gray-500">
            Aucun hackathon a venir
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>
