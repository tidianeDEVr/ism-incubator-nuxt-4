<script setup lang="ts">
import { mockProjects, mockHackathons } from '~/data/mock'

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Dashboard Mentor - ISM Incubator',
})

// Mock current mentor ID
const currentMentorId = 'mentor-003'

// Get assigned projects
const assignedProjects = computed(() =>
  mockProjects.filter(p => p.assignedMentorId === currentMentorId)
)

const projectsByStatus = computed(() => ({
  pending: assignedProjects.value.filter(p => p.status === 'submitted' || p.status === 'evaluation'),
  evaluated: assignedProjects.value.filter(p => p.status === 'finalist' || p.status === 'winner'),
}))

// Count total participants across assigned projects
const totalParticipants = computed(() =>
  assignedProjects.value.reduce((sum, p) => sum + p.members.length, 0)
)

const stats = computed(() => [
  {
    title: 'Participants',
    value: totalParticipants.value,
    icon: 'users',
    variant: 'primary' as const,
  },
  {
    title: 'Projets assignes',
    value: assignedProjects.value.length,
    icon: 'folder',
    variant: 'secondary' as const,
  },
  {
    title: 'A evaluer',
    value: projectsByStatus.value.pending.length,
    icon: 'clock',
    variant: 'default' as const,
    trend: projectsByStatus.value.pending.length > 0 ? { value: projectsByStatus.value.pending.length, isPositive: false } : undefined,
  },
  {
    title: 'Hackathons actifs',
    value: new Set(assignedProjects.value.map(p => p.hackathonId)).size,
    icon: 'calendar',
    variant: 'default' as const,
  },
])

function getHackathonTitle(hackathonId: string) {
  return mockHackathons.find(h => h.id === hackathonId)?.title || 'Inconnu'
}

function formatDate(dateString?: string) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
}

const statusConfig: Record<string, { label: string; class: string }> = {
  submitted: { label: 'A evaluer', class: 'bg-blue-100 text-blue-700' },
  evaluation: { label: 'En cours', class: 'bg-amber-100 text-amber-700' },
  finalist: { label: 'Finaliste', class: 'bg-purple-100 text-purple-700' },
  winner: { label: 'Gagnant', class: 'bg-green-100 text-green-700' },
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-heading-lg text-primary mb-1">Bienvenue, Mentor</h1>
      <p class="text-body text-gray-500">Voici un apercu de vos projets assignes</p>
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
      <!-- Projects to Evaluate -->
      <div class="lg:col-span-2">
        <UiCard>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-heading-sm text-primary">Projets a evaluer</h2>
            <UiButton variant="ghost" size="sm" href="/mentor/projects">
              Voir tout
            </UiButton>
          </div>

          <div v-if="projectsByStatus.pending.length > 0" class="space-y-3">
            <NuxtLink
              v-for="project in projectsByStatus.pending.slice(0, 4)"
              :key="project.id"
              :to="`/mentor/projects/${project.id}`"
              class="block p-4 rounded-lg border border-neutral-border hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div class="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 class="text-body font-medium text-gray-900">{{ project.title }}</h3>
                  <p class="text-caption text-gray-500">{{ getHackathonTitle(project.hackathonId) }}</p>
                </div>
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', statusConfig[project.status]?.class]">
                  {{ statusConfig[project.status]?.label }}
                </span>
              </div>
              <p class="text-body-sm text-gray-600 line-clamp-2 mb-3">
                {{ project.description }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex -space-x-2">
                  <UiAvatar
                    v-for="member in project.members.slice(0, 3)"
                    :key="member.userId"
                    :name="member.name"
                    size="xs"
                    class="ring-2 ring-white"
                  />
                  <span
                    v-if="project.members.length > 3"
                    class="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center text-gray-600 ring-2 ring-white"
                  >
                    +{{ project.members.length - 3 }}
                  </span>
                </div>
                <span class="text-caption text-gray-400">
                  Soumis le {{ formatDate(project.submittedAt) }}
                </span>
              </div>
            </NuxtLink>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-body-sm">Tous les projets ont ete evalues</p>
          </div>
        </UiCard>
      </div>

      <!-- Quick Actions & Recent Activity -->
      <div class="space-y-6">
        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Actions rapides</h2>
          <div class="space-y-3">
            <UiButton variant="secondary" full-width href="/mentor/projects">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Suivre mes participants
            </UiButton>
            <UiButton variant="outline" full-width href="/mentor/messages">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Voir les messages
            </UiButton>
          </div>
        </UiCard>

        <UiCard>
          <h2 class="text-heading-sm text-primary mb-4">Projets finalistes</h2>
          <div v-if="projectsByStatus.evaluated.length > 0" class="space-y-3">
            <div
              v-for="project in projectsByStatus.evaluated.slice(0, 3)"
              :key="project.id"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold',
                  project.status === 'winner' ? 'bg-green-500' : 'bg-purple-500',
                ]"
              >
                {{ project.status === 'winner' ? '1' : 'F' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-body-sm font-medium text-gray-900 truncate">{{ project.title }}</p>
                <p class="text-caption text-gray-500">{{ project.members.length }} membre(s)</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-body-sm text-gray-500">
            Aucun projet finaliste
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>
