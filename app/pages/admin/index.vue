<script setup lang="ts">
import { mockHackathons } from "~/data/mock";

definePageMeta({
  layout: "dashboard",
});

useHead({
  title: "Dashboard Admin - ISM Incubator",
});

const stats = computed(() => [
  {
    title: "Projets soumis",
    value: 42,
    icon: "folder",
    variant: "primary" as const,
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Participants",
    value: 156,
    icon: "users",
    variant: "secondary" as const,
    trend: { value: 8, isPositive: true },
  },
  {
    title: "Mentors actifs",
    value: 12,
    icon: "star",
    variant: "default" as const,
    trend: { value: 2, isPositive: true },
  },
  {
    title: "Hackathons",
    value: mockHackathons.filter(
      (h) => h.status === "active" || h.status === "upcoming",
    ).length,
    icon: "calendar",
    variant: "default" as const,
  },
]);

const recentProjects = [
  {
    id: 1,
    name: "FinApp Mobile",
    team: "Team Alpha",
    hackathon: "FinTech Challenge",
    status: "submitted",
    date: "2026-01-30",
  },
  {
    id: 2,
    name: "EcoTrack",
    team: "Green Warriors",
    hackathon: "GreenTech",
    status: "evaluation",
    date: "2026-01-29",
  },
  {
    id: 3,
    name: "HealthBot",
    team: "MedTech",
    hackathon: "Innovation Challenge",
    status: "submitted",
    date: "2026-01-28",
  },
  {
    id: 4,
    name: "AgriSmart",
    team: "Farm Tech",
    hackathon: "Innovation Challenge",
    status: "finalist",
    date: "2026-01-27",
  },
];

const statusColors: Record<string, string> = {
  submitted: "bg-gray-100 text-gray-700",
  evaluation: "bg-blue-100 text-blue-700",
  finalist: "bg-purple-100 text-purple-700",
  winner: "bg-green-100 text-green-700",
};

const statusLabels: Record<string, string> = {
  submitted: "Soumis",
  evaluation: "Evaluation",
  finalist: "Finaliste",
  winner: "Gagnant",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-heading-lg text-primary mb-1">Dashboard</h1>
      <p class="text-body text-gray-500">
        Bienvenue sur le tableau de bord administrateur
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      <StatsCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :variant="stat.variant"
        :trend="stat.trend"
      />
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Recent Projects -->
      <div class="lg:col-span-2">
        <UiCard>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-heading-sm text-primary">Projets recents</h2>
            <UiButton variant="ghost" size="sm" href="/admin/projects">
              Voir tout
            </UiButton>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-neutral-border">
                  <th
                    class="text-left py-3 px-4 text-body-sm font-semibold text-gray-600"
                  >
                    Projet
                  </th>
                  <th
                    class="text-left py-3 px-4 text-body-sm font-semibold text-gray-600 hidden sm:table-cell"
                  >
                    Hackathon
                  </th>
                  <th
                    class="text-left py-3 px-4 text-body-sm font-semibold text-gray-600"
                  >
                    Statut
                  </th>
                  <th
                    class="text-left py-3 px-4 text-body-sm font-semibold text-gray-600 hidden md:table-cell"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="project in recentProjects"
                  :key="project.id"
                  class="border-b border-neutral-border last:border-0 hover:bg-gray-50"
                >
                  <td class="py-3 px-4">
                    <div>
                      <div class="text-body-sm font-medium text-gray-900">
                        {{ project.name }}
                      </div>
                      <div class="text-caption text-gray-500">
                        {{ project.team }}
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 hidden sm:table-cell">
                    <span class="text-body-sm text-gray-600">{{
                      project.hackathon
                    }}</span>
                  </td>
                  <td class="py-3 px-4">
                    <span
                      :class="[
                        'px-2 py-1 rounded-full text-xs font-medium',
                        statusColors[project.status],
                      ]"
                    >
                      {{ statusLabels[project.status] }}
                    </span>
                  </td>
                  <td class="py-3 px-4 hidden md:table-cell">
                    <span class="text-body-sm text-gray-500">{{
                      formatDate(project.date)
                    }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiCard>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Actions rapides</h2>
          <div class="space-y-3">
            <UiButton variant="secondary" full-width href="/admin/hackathons">
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
              Créer un hackathon
            </UiButton>
            <UiButton variant="outline" full-width href="/admin/mentors">
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Ajouter un mentor
            </UiButton>
            <UiButton variant="outline" full-width href="/admin/projects">
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
              Gerer les projets
            </UiButton>
          </div>
        </UiCard>

        <!-- Active Hackathons -->
        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Hackathons actifs</h2>
          <div class="space-y-3">
            <div
              v-for="hackathon in mockHackathons.filter(
                (h) => h.status === 'active',
              )"
              :key="hackathon.id"
              class="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="text-body-sm font-medium text-gray-900">{{
                  hackathon.title
                }}</span>
                <UiBadge variant="success" size="sm" dot>En cours</UiBadge>
              </div>
              <div class="flex items-center gap-4 text-caption text-gray-500">
                <span>{{ hackathon.participantCount }} participants</span>
                <span>{{ hackathon.projectCount }} projets</span>
              </div>
            </div>
            <div
              v-if="
                mockHackathons.filter((h) => h.status === 'active').length === 0
              "
              class="text-center py-4 text-body-sm text-gray-500"
            >
              Aucun hackathon actif
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>
