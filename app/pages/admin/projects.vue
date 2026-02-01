<script setup lang="ts">
import { mockProjects, mockHackathons, mockMentors } from "~/data/mock"
import type { Project, ProjectStatus } from "~/types"

definePageMeta({
  layout: "dashboard",
})

useHead({
  title: "Gestion des Projets - ISM Incubator",
})

// State
const projects = ref<Project[]>([...mockProjects])
const selectedHackathon = ref<string>("all")
const searchQuery = ref("")
const viewMode = ref<"pipeline" | "table">("pipeline")
const selectedProject = ref<Project | null>(null)
const isDetailOpen = ref(false)
const showNotifyModal = ref(false)
const notifyType = ref<"accepted" | "rejected">("accepted")
const notifyMessage = ref("")
const isSendingNotification = ref(false)

// Pipeline columns - Flux simplifié: Soumis → En évaluation → Accepté/Refusé
const pipelineColumns = [
  { id: "submitted", title: "Soumis", color: "#3B82F6", bgColor: "bg-blue-50" },
  { id: "evaluation", title: "En evaluation", color: "#F59E0B", bgColor: "bg-amber-50" },
  { id: "accepted", title: "Accepte", color: "#22C55E", bgColor: "bg-green-50" },
  { id: "rejected", title: "Refuse", color: "#EF4444", bgColor: "bg-red-50" },
]

// Table columns
const tableColumns = [
  { key: "title", label: "Projet" },
  { key: "hackathon", label: "Hackathon", class: "hidden md:table-cell" },
  { key: "team", label: "Equipe", class: "hidden lg:table-cell" },
  { key: "mentor", label: "Mentor", class: "hidden sm:table-cell" },
  { key: "status", label: "Statut" },
  { key: "actions", label: "", class: "w-24" },
]

// Map internal status to pipeline columns
const statusToPipeline: Record<string, string> = {
  submitted: "submitted",
  evaluation: "evaluation",
  finalist: "accepted",
  winner: "accepted",
  rejected: "rejected",
}

const pipelineToStatus: Record<string, ProjectStatus> = {
  submitted: "submitted",
  evaluation: "evaluation",
  accepted: "finalist",
  rejected: "rejected",
}

const statusConfig: Record<string, { label: string; variant: "default" | "info" | "success" | "warning" | "error" }> = {
  draft: { label: "Brouillon", variant: "default" },
  submitted: { label: "Soumis", variant: "info" },
  evaluation: { label: "En evaluation", variant: "warning" },
  finalist: { label: "Accepte", variant: "success" },
  winner: { label: "Accepte", variant: "success" },
  rejected: { label: "Refuse", variant: "error" },
  accepted: { label: "Accepte", variant: "success" },
}

// Computed
const filteredProjects = computed(() => {
  let result = projects.value.filter(p => p.status !== "draft")

  if (selectedHackathon.value !== "all") {
    result = result.filter(p => p.hackathonId === selectedHackathon.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      p =>
        p.title.toLowerCase().includes(query) ||
        p.members.some(m => m.name.toLowerCase().includes(query))
    )
  }

  return result
})

const pipelineData = computed(() => {
  const data: Record<string, Project[]> = {
    submitted: [],
    evaluation: [],
    accepted: [],
    rejected: [],
  }

  filteredProjects.value.forEach(project => {
    const pipelineStatus = statusToPipeline[project.status] || "submitted"
    if (data[pipelineStatus]) {
      data[pipelineStatus].push(project)
    }
  })

  return data
})

// Stats
const stats = computed(() => ({
  total: filteredProjects.value.length,
  submitted: pipelineData.value.submitted?.length ?? 0,
  evaluation: pipelineData.value.evaluation?.length ?? 0,
  accepted: pipelineData.value.accepted?.length ?? 0,
  rejected: pipelineData.value.rejected?.length ?? 0,
}))

// Methods
function getHackathonTitle(hackathonId: string) {
  return mockHackathons.find(h => h.id === hackathonId)?.title || "Inconnu"
}

function getMentorName(mentorId?: string) {
  if (!mentorId) return "Non assigne"
  return mockMentors.find(m => m.id === mentorId)?.name || "Inconnu"
}

function openProjectDetail(project: Project) {
  selectedProject.value = project
  isDetailOpen.value = true
}

function updateProjectStatus(project: Project, newStatus: ProjectStatus) {
  const index = projects.value.findIndex(p => p.id === project.id)
  const currentProject = projects.value[index]
  if (index !== -1 && currentProject) {
    const updatedProject = {
      ...currentProject,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }
    projects.value[index] = updatedProject

    if (selectedProject.value?.id === project.id) {
      selectedProject.value = { ...updatedProject }
    }
  }
}

function updateProjectMentor(project: Project, mentorId: string | undefined) {
  const index = projects.value.findIndex(p => p.id === project.id)
  const currentProject = projects.value[index]
  if (index !== -1 && currentProject) {
    const updatedProject = {
      ...currentProject,
      assignedMentorId: mentorId,
      updatedAt: new Date().toISOString(),
    }
    projects.value[index] = updatedProject

    if (selectedProject.value?.id === project.id) {
      selectedProject.value = { ...updatedProject }
    }
  }
}

function handleProjectMove(project: Project, fromColumn: string, toColumn: string) {
  const newStatus = pipelineToStatus[toColumn]
  if (newStatus) {
    updateProjectStatus(project, newStatus)
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

// Accept/Reject with notification
function acceptProject(project: Project, notify: boolean = false) {
  updateProjectStatus(project, "finalist")
  if (notify) {
    openNotifyModal(project, "accepted")
  }
}

function rejectProject(project: Project, notify: boolean = false) {
  updateProjectStatus(project, "rejected")
  if (notify) {
    openNotifyModal(project, "rejected")
  }
}

function openNotifyModal(project: Project, type: "accepted" | "rejected") {
  selectedProject.value = project
  notifyType.value = type
  notifyMessage.value = type === "accepted"
    ? `Felicitations! Votre projet "${project.title}" a ete accepte. Nous vous contacterons prochainement pour la suite du processus.`
    : `Nous avons le regret de vous informer que votre projet "${project.title}" n'a pas ete retenu. Nous vous encourageons a participer aux prochains hackathons.`
  showNotifyModal.value = true
}

async function sendNotification() {
  isSendingNotification.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))
  isSendingNotification.value = false
  showNotifyModal.value = false
  // Show success feedback (in real app, this would be a toast)
  alert("Notification envoyee avec succes!")
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-heading-lg text-primary mb-1">Projets Soumis</h1>
        <p class="text-body text-gray-500">
          Evaluez et gerez les projets soumis par les participants
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          :class="[
            'p-2 rounded-lg transition-colors',
            viewMode === 'pipeline'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
          title="Vue Pipeline"
          @click="viewMode = 'pipeline'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </button>
        <button
          :class="[
            'p-2 rounded-lg transition-colors',
            viewMode === 'table'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
          title="Vue Tableau"
          @click="viewMode = 'table'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-primary">{{ stats.total }}</div>
        <div class="text-caption text-gray-500">Total</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-blue-500">{{ stats.submitted }}</div>
        <div class="text-caption text-gray-500">Soumis</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-amber-500">{{ stats.evaluation }}</div>
        <div class="text-caption text-gray-500">En evaluation</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-green-500">{{ stats.accepted }}</div>
        <div class="text-caption text-gray-500">Acceptes</div>
      </UiCard>
      <UiCard class="text-center">
        <div class="text-2xl font-bold text-red-500">{{ stats.rejected }}</div>
        <div class="text-caption text-gray-500">Refuses</div>
      </UiCard>
    </div>

    <!-- Filters -->
    <UiCard class="mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <UiInput
            v-model="searchQuery"
            placeholder="Rechercher par projet ou membre..."
            type="search"
          >
            <template #prefix>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </template>
          </UiInput>
        </div>
        <div class="sm:w-64">
          <select
            v-model="selectedHackathon"
            class="w-full px-4 py-2.5 border border-neutral-border rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="all">Tous les hackathons</option>
            <option v-for="hackathon in mockHackathons" :key="hackathon.id" :value="hackathon.id">
              {{ hackathon.title }}
            </option>
          </select>
        </div>
      </div>
    </UiCard>

    <!-- Pipeline View -->
    <template v-if="viewMode === 'pipeline'">
      <UiPipeline
        :columns="pipelineColumns"
        :model-value="pipelineData"
        :items-per-page="5"
        @item-click="openProjectDetail"
        @item-move="handleProjectMove"
      >
        <template #item="{ item }">
          <div class="bg-white p-3 rounded-lg shadow-sm border border-neutral-border hover:shadow-card transition-shadow">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h4 class="text-body-sm font-medium text-gray-900 line-clamp-1">
                {{ item.title }}
              </h4>
            </div>
            <p class="text-caption text-secondary mb-2">
              {{ getHackathonTitle(item.hackathonId) }}
            </p>
            <p class="text-caption text-gray-500 line-clamp-2 mb-3">
              {{ item.description }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex -space-x-2">
                <UiAvatar
                  v-for="member in item.members.slice(0, 3)"
                  :key="member.userId"
                  :name="member.name"
                  size="xs"
                  class="ring-2 ring-white"
                />
                <span
                  v-if="item.members.length > 3"
                  class="w-6 h-6 rounded-full bg-gray-200 text-xs flex items-center justify-center text-gray-600 ring-2 ring-white"
                >
                  +{{ item.members.length - 3 }}
                </span>
              </div>
              <span class="text-caption text-gray-400">
                {{ formatDate(item.submittedAt) }}
              </span>
            </div>
          </div>
        </template>
      </UiPipeline>
    </template>

    <!-- Table View -->
    <template v-else>
      <UiCard>
        <UiTable :columns="tableColumns" :data="filteredProjects" empty-text="Aucun projet trouve">
          <template #title="{ item }">
            <div>
              <div class="text-body-sm font-medium text-gray-900">{{ item.title }}</div>
              <div class="text-caption text-gray-500 line-clamp-1">{{ item.description }}</div>
            </div>
          </template>

          <template #hackathon="{ item }">
            <span class="text-body-sm text-gray-600">
              {{ getHackathonTitle(item.hackathonId) }}
            </span>
          </template>

          <template #team="{ item }">
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <UiAvatar
                  v-for="member in item.members.slice(0, 2)"
                  :key="member.userId"
                  :name="member.name"
                  size="xs"
                  class="ring-2 ring-white"
                />
              </div>
              <span class="text-body-sm text-gray-600">
                {{ item.members.length }}
              </span>
            </div>
          </template>

          <template #mentor="{ item }">
            <span class="text-body-sm text-gray-600">
              {{ getMentorName(item.assignedMentorId) }}
            </span>
          </template>

          <template #status="{ item }">
            <UiBadge :variant="statusConfig[item.status]?.variant || 'default'" size="sm">
              {{ statusConfig[item.status]?.label || item.status }}
            </UiBadge>
          </template>

          <template #actions="{ item }">
            <div class="flex items-center gap-1">
              <button
                class="p-1.5 text-gray-400 hover:text-primary transition-colors"
                title="Voir details"
                @click="openProjectDetail(item)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                v-if="item.status === 'submitted' || item.status === 'evaluation'"
                class="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                title="Accepter"
                @click="acceptProject(item, true)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                v-if="item.status === 'submitted' || item.status === 'evaluation'"
                class="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                title="Refuser"
                @click="rejectProject(item, true)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </template>
        </UiTable>
      </UiCard>
    </template>

    <!-- Project Detail Modal -->
    <UiModal
      v-model="isDetailOpen"
      :title="selectedProject?.title || 'Detail du projet'"
      size="lg"
    >
      <template v-if="selectedProject">
        <div class="space-y-6">
          <!-- Header Info -->
          <div class="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-neutral-border">
            <div>
              <p class="text-body-sm text-secondary font-medium mb-1">
                {{ getHackathonTitle(selectedProject.hackathonId) }}
              </p>
              <p class="text-caption text-gray-500">
                Soumis le {{ formatDate(selectedProject.submittedAt) }}
              </p>
            </div>
            <UiBadge :variant="statusConfig[selectedProject.status]?.variant || 'default'" size="md">
              {{ statusConfig[selectedProject.status]?.label || selectedProject.status }}
            </UiBadge>
          </div>

          <!-- Project Info -->
          <div>
            <h4 class="text-body-sm font-semibold text-gray-900 mb-2">Description</h4>
            <p class="text-body-sm text-gray-600">{{ selectedProject.description }}</p>
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 class="text-body-sm font-semibold text-gray-900 mb-2">Probleme</h4>
              <p class="text-body-sm text-gray-600">{{ selectedProject.problemStatement }}</p>
            </div>
            <div>
              <h4 class="text-body-sm font-semibold text-gray-900 mb-2">Solution</h4>
              <p class="text-body-sm text-gray-600">{{ selectedProject.solution }}</p>
            </div>
          </div>

          <!-- Tech Stack -->
          <div>
            <h4 class="text-body-sm font-semibold text-gray-900 mb-2">Technologies</h4>
            <div class="flex flex-wrap gap-2">
              <UiBadge v-for="tech in selectedProject.techStack" :key="tech" variant="default" size="sm">
                {{ tech }}
              </UiBadge>
            </div>
          </div>

          <!-- Team -->
          <div>
            <h4 class="text-body-sm font-semibold text-gray-900 mb-2">
              Equipe ({{ selectedProject.members.length }} membres)
            </h4>
            <div class="grid sm:grid-cols-2 gap-2">
              <div
                v-for="member in selectedProject.members"
                :key="member.userId"
                class="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
              >
                <UiAvatar :name="member.name" size="sm" />
                <div class="min-w-0">
                  <div class="text-body-sm font-medium text-gray-900 truncate">
                    {{ member.name }}
                    <UiBadge v-if="member.isLead" variant="secondary" size="sm" class="ml-1">Lead</UiBadge>
                  </div>
                  <div class="text-caption text-gray-500">{{ member.role }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Links -->
          <div v-if="selectedProject.pitchDeckUrl || selectedProject.demoVideoUrl || selectedProject.sourceCodeUrl">
            <h4 class="text-body-sm font-semibold text-gray-900 mb-2">Ressources</h4>
            <div class="flex flex-wrap gap-2">
              <a
                v-if="selectedProject.pitchDeckUrl"
                :href="selectedProject.pitchDeckUrl"
                target="_blank"
                class="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-body-sm text-gray-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Pitch Deck
              </a>
              <a
                v-if="selectedProject.demoVideoUrl"
                :href="selectedProject.demoVideoUrl"
                target="_blank"
                class="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-body-sm text-gray-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Video Demo
              </a>
              <a
                v-if="selectedProject.sourceCodeUrl"
                :href="selectedProject.sourceCodeUrl"
                target="_blank"
                class="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-body-sm text-gray-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code Source
              </a>
            </div>
          </div>

          <!-- Mentor Assignment -->
          <div class="pt-4 border-t border-neutral-border">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-body-sm font-semibold text-gray-900 mb-1">Mentor assigne</h4>
                <div class="flex items-center gap-2">
                  <UiAvatar
                    v-if="selectedProject.assignedMentorId"
                    :name="getMentorName(selectedProject.assignedMentorId)"
                    size="sm"
                  />
                  <span class="text-body-sm text-gray-600">
                    {{ getMentorName(selectedProject.assignedMentorId) }}
                  </span>
                </div>
              </div>
              <select
                :value="selectedProject.assignedMentorId || ''"
                class="px-3 py-1.5 text-body-sm border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                @change="updateProjectMentor(selectedProject, ($event.target as HTMLSelectElement).value || undefined)"
              >
                <option value="">Non assigne</option>
                <option v-for="mentor in mockMentors.filter(m => m.isActive)" :key="mentor.id" :value="mentor.id">
                  {{ mentor.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex flex-wrap gap-3 w-full">
          <UiButton variant="ghost" @click="isDetailOpen = false">Fermer</UiButton>
          <div class="flex-1" />

          <!-- Actions based on status -->
          <template v-if="selectedProject?.status === 'submitted'">
            <UiButton variant="outline" @click="updateProjectStatus(selectedProject, 'evaluation')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Evaluer
            </UiButton>
          </template>

          <template v-if="selectedProject?.status === 'submitted' || selectedProject?.status === 'evaluation'">
            <UiButton variant="outline" class="text-red-600 border-red-200 hover:bg-red-50" @click="rejectProject(selectedProject!, true)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Refuser et notifier
            </UiButton>
            <UiButton class="bg-green-600 hover:bg-green-700" @click="acceptProject(selectedProject!, true)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Accepter et notifier
            </UiButton>
          </template>

          <template v-if="selectedProject?.status === 'finalist' || selectedProject?.status === 'rejected'">
            <UiButton variant="outline" @click="openNotifyModal(selectedProject!, selectedProject!.status === 'finalist' ? 'accepted' : 'rejected')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifier le participant
            </UiButton>
          </template>
        </div>
      </template>
    </UiModal>

    <!-- Notification Modal -->
    <UiModal v-model="showNotifyModal" title="Notifier le participant" size="md">
      <div class="space-y-4">
        <div :class="[
          'p-4 rounded-lg',
          notifyType === 'accepted' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        ]">
          <div class="flex items-center gap-2 mb-2">
            <svg v-if="notifyType === 'accepted'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span :class="['text-body-sm font-medium', notifyType === 'accepted' ? 'text-green-700' : 'text-red-700']">
              {{ notifyType === 'accepted' ? 'Projet accepte' : 'Projet refuse' }}
            </span>
          </div>
          <p class="text-body-sm text-gray-600">{{ selectedProject?.title }}</p>
        </div>

        <div>
          <label class="block text-body-sm font-medium text-gray-700 mb-2">
            Message de notification
          </label>
          <textarea
            v-model="notifyMessage"
            class="w-full p-3 border border-neutral-border rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            rows="4"
            placeholder="Message personnalise..."
          />
        </div>

        <div class="p-3 bg-gray-50 rounded-lg">
          <p class="text-caption text-gray-500">
            Ce message sera envoye a tous les membres de l'equipe :
          </p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="member in selectedProject?.members"
              :key="member.userId"
              class="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-caption"
            >
              <UiAvatar :name="member.name" size="xs" />
              {{ member.name }}
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <UiButton variant="ghost" @click="showNotifyModal = false">Annuler</UiButton>
        <UiButton :loading="isSendingNotification" @click="sendNotification">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Envoyer la notification
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
